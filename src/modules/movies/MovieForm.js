import React, { useContext, useEffect, useState } from 'react';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Layout,
  Radio,
  Row,
  Upload,
  notification,
} from 'antd';
import axios from 'axios';
import moment from 'moment/moment';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { CREATE_MOVIE, UPDATE_MOVIE } from './graphql/Mutations';
import {
  DEFAULTDATETIMEFORMATFORREPORTS,
  ROUTES,
} from '../../common/constants';
import { GET_MOVIE_DETAILS, GET_SIGNED_URL } from './graphql/Queries';
import Portal from '../../components/Portal';
import { ThemeContext } from '../../context/ThemeContext';
import '../../styles/pages/movieForm.less';

const MovieForm = () => {
  const [form] = Form.useForm();
  const { movieId } = useParams();
  const [loading, setLoading] = useState(false);
  const [imageKey, setImageKey] = useState('');

  const navigate = useNavigate();

  const { getTheme } = useContext(ThemeContext);
  const theme = getTheme();

  const imageRegex =
    /^(https?:\/\/.*\.(com|org)\/.*\.(?:png|jpg|jpeg|gif|bmp|webp))$/;

  const [getSignedUrl] = useLazyQuery(GET_SIGNED_URL, {
    fetchPolicy: 'cache-and-network',
    onCompleted: () => {},
    onError: () => {},
  });

  const { error: queryError, data } = useQuery(GET_MOVIE_DETAILS, {
    variables: { id: movieId },
    fetchPolicy: 'cache-and-network',
    skip: !movieId,
    onError: ({ graphQLErrors, clientErrors }) => {
      if (graphQLErrors) {
        navigate(-1);
        graphQLErrors?.forEach((error) => {
          notification.destroy();
          notification.error({
            message: 'Error',
            description: `${error?.message}`,
            className: `notification-error notification-error-${theme}`,
          });
        });
      } else {
        navigate(-1);
        clientErrors?.forEach((error) => {
          notification.destroy();
          notification.error({
            message: 'Error',
            description: `Error ${error?.message}`,
            className: `notification-error notification-error-${theme}`,
          });
        });
      }
    },
  });

  if (queryError) {
    notification.destroy();
    notification.error({
      message: 'Error Occured!',
      description: `${queryError}`,
      className: `notification-error notification-error-${theme}`,
    });
  }

  const [movieMutation, { error }] = useMutation(
    movieId ? UPDATE_MOVIE : CREATE_MOVIE,
    {
      fetchPolicy: 'network-only',
      onCompleted: () => {
        const action = movieId ? 'Updated' : 'Added';
        notification.destroy();
        notification.success({
          message: `Movie ${action} Successfully!`,
          description: `Movie ${action} Successfully!`,
          className: `notification-success notification-success-${theme}`,
        });
        navigate(-1);
      },
      onError: ({ graphQLErrors, clientErrors }) => {
        if (graphQLErrors) {
          navigate(-1);
          graphQLErrors?.forEach((error) => {
            notification.destroy();
            notification.error({
              message: 'Error',
              description: `${error?.message}`,
              className: `notification-error notification-error-${theme}`,
            });
          });
        } else {
          navigate(-1);
          clientErrors?.forEach((error) => {
            notification.destroy();
            notification.error({
              message: 'Error',
              description: `Error ${error?.message}`,
              className: `notification-error notification-error-${theme}`,
            });
          });
        }
      },
    },
  );

  useEffect(() => {
    if (data) {
      const movie = data?.movie?.data;

      const initialValues = {
        ...movie,
        releaseDate: moment(movie?.releaseDate)?.isValid()
          ? moment(movie?.releaseDate)
          : null,
      };
      form.setFieldsValue(initialValues);
    }
  }, [form, data]);

  if (error) {
    navigate(ROUTES?.MOVIE_CARD);
    notification.destroy(); //remember removed return
    notification.error({
      message: 'Error Occured!',
      description: `${error?.message}`,
      className: `notification-error notification-error-${theme}`,
    });
  }

  const validateImageUrl = (_, value) => {
    if (imageRegex?.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('Please input the valid image URL'));
  };

  const handleImageUpload = async ({ file }) => {
    if (file?.status === 'uploading') {
      setLoading(true);
      return;
    }

    if (file?.status === 'done') {
      setLoading(false);
      notification.destroy();
      notification.success({
        message: 'Success!',
        description: file?.status,
      });
    }

    if (file?.status === 'error') {
      notification.destroy();
      notification.error({
        message: 'Error Occured!',
        description: file?.status,
      });
    }

    try {
      const { data } = await getSignedUrl({
        variables: {
          data: {
            fileName: file?.name,
            movieId: movieId,
          },
        },
      });

      const { signedUrl, key } = data?.getMoviesSignedPutUrl;

      await axios
        .put(signedUrl, file, {
          headers: {
            'Content-Type': file?.type,
          },
        })
        .then((res) => console.log('Response', res))
        .catch((error) => console.log('Error:', error));
      setImageKey(key);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || error?.message || 'Upload failed!';
      notification.destroy();
      notification.error({
        message: 'Error Occured!',
        description: errorMessage,
        className: `notification-error notification-error-${theme}`,
      });
    }
  };

  const uploadButton = (
    <div className="upload-text">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div>Upload</div>
    </div>
  );

  const handleSubmit = (values) => {
    const formattedReleaseDate = values?.releaseDate
      ? moment(values?.releaseDate)?.toISOString()
      : null;

    const variables = {
      ...values,
      budget: parseInt(values?.budget),
      releaseDate: formattedReleaseDate,
      revenue: parseInt(values?.revenue),
      runtime: parseInt(values?.runtime),
    };

    if (movieId) {
      variables.imageUrl = imageKey;
    }

    try {
      form.validateFields();
      if (movieId) {
        movieMutation({ variables: { data: { ...variables }, id: movieId } });
      } else {
        movieMutation({ variables: { data: variables } });
      }
    } catch (error) {
      notification.destroy();
      notification.error({
        message: 'Validation Failed!',
        description: error,
        className: `notification-error notification-error-${theme}`,
      });
    }
  };

  const movieTitle = data?.movie?.data?.title;

  const imageUrl = data?.movie?.data?.imageUrl;

  return (
    <>
      <Portal portalId="breadcrumbs-portal">
        <Breadcrumb>
          <Breadcrumb.Item>
            <NavLink
              to={ROUTES?.HOME}
              className={`breadcrumb-item breadcrumb-item-${theme}`}
            >
              Home
            </NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <NavLink
              to={ROUTES?.MOVIE_CARD}
              className={`breadcrumb-item breadcrumb-item-${theme}`}
            >
              Movies Card
            </NavLink>
          </Breadcrumb.Item>
          {data ? (
            <>
              <Breadcrumb.Item>
                <NavLink
                  to={`${ROUTES?.MOVIE_CARD}/${movieId}`}
                  className={`breadcrumb-item breadcrumb-item-${theme}`}
                >
                  {movieTitle}
                </NavLink>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <NavLink
                  to={`${ROUTES?.MOVIE_CARD}/${movieId}/edit`}
                  className={`breadcrumb-item-active breadcrumb-item-${theme}`}
                >
                  Edit
                </NavLink>
              </Breadcrumb.Item>
            </>
          ) : (
            <Breadcrumb.Item>
              <NavLink
                to={ROUTES?.MOVIE_CREATE}
                className={`breadcrumb-item-active breadcrumb-item-${theme}`}
              >
                Create Movie
              </NavLink>
            </Breadcrumb.Item>
          )}
        </Breadcrumb>
      </Portal>
      <Layout className={`movie-form-layout-${theme}`}>
        <Divider className={`movie-form-divider movie-form-divider-${theme}`}>
          {movieId ? 'Update' : 'Add New'} Movie Form
        </Divider>
        <Form
          className={`movie-form movie-form-${theme}`}
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={[8, 8]}>
            <Col xs={24} sm={12} md={12} lg={12}>
              <Card className={`movie-form-card movie-form-card-${theme}`}>
                <Form.Item
                  label="Title"
                  name="title"
                  rules={[
                    { required: true, message: 'Please input the title!' },
                  ]}
                >
                  <Input
                    className={`movie-input-field movie-input-field-${theme}`}
                  />
                </Form.Item>
                <Form.Item
                  name="overview"
                  label="Overview"
                  rules={[
                    { required: true, message: 'Please input the overview!' },
                  ]}
                >
                  <Input.TextArea
                    rows={4}
                    className={`movie-input-field movie-input-field-${theme}`}
                  />
                </Form.Item>
                <Form.Item
                  label="Adult"
                  name="adult"
                  rules={[
                    {
                      required: true,
                      message: 'Please select the adult option!',
                    },
                  ]}
                >
                  <Radio.Group>
                    <Radio
                      className={`movie-radio movie-radio-${theme}`}
                      value={true}
                    >
                      Yes
                    </Radio>
                    <Radio
                      className={`movie-radio movie-radio-${theme}`}
                      value={false}
                    >
                      No
                    </Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item
                  name="budget"
                  label="Budget"
                  rules={[
                    { required: true, message: 'Please input the budget!' },
                  ]}
                >
                  <Input
                    type="number"
                    min={0}
                    className={`movie-input-field movie-input-field-${theme}`}
                  />
                </Form.Item>
                <Form.Item
                  name="originalTitle"
                  label="Image URL"
                  rules={[
                    {
                      required: true,
                      message: 'Please input the image url!',
                    },
                    {
                      validator: validateImageUrl,
                    },
                  ]}
                >
                  <Input
                    className={`movie-input-field movie-input-field-${theme}`}
                  />
                </Form.Item>
                <Form.Item
                  name="originalLanguage"
                  label="Original Language"
                  rules={[
                    {
                      required: true,
                      message: 'Please input the original language!',
                    },
                  ]}
                >
                  <Input
                    className={`movie-input-field movie-input-field-${theme}`}
                  />
                </Form.Item>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12}>
              <Card className={`movie-form-card movie-form-card-${theme}`}>
                {movieId && (
                  <Form.Item
                    name="imageUrl"
                    label="Upload Image"
                    rules={[
                      { required: true, message: 'Please upload the image' },
                    ]}
                  >
                    <Upload
                      name="imageUrl"
                      listType="picture-card"
                      beforeUpload={() => false}
                      accept=".jpg, .png, .jpeg"
                      onChange={(file) => handleImageUpload(file)}
                      showUploadList={{
                        showPreviewIcon: true,
                        showRemoveIcon: true,
                      }}
                      className={`upload-movie-image upload-movie-image-${theme}`}
                    >
                      <div>
                        {imageUrl ? (
                          <img
                            className={`upload-image`}
                            src={imageUrl}
                            alt={imageUrl && movieTitle}
                          />
                        ) : (
                          uploadButton
                        )}
                      </div>
                    </Upload>
                  </Form.Item>
                )}
                <Form.Item
                  name="releaseDate"
                  label="Release Date"
                  rules={[
                    {
                      required: true,
                      message: 'Please input the release date!',
                    },
                  ]}
                >
                  <DatePicker
                    className={`movie-date-field movie-date-field-${theme}`}
                    popupClassName={`movie-date-picker movie-date-picker-${theme}`}
                    format={DEFAULTDATETIMEFORMATFORREPORTS}
                    needConfirm
                  />
                </Form.Item>
                <Form.Item
                  name="revenue"
                  label="Revenue"
                  rules={[
                    { required: true, message: 'Please input the revenue!' },
                  ]}
                >
                  <Input
                    type="number"
                    min={0}
                    className={`movie-input-field movie-input-field-${theme}`}
                  />
                </Form.Item>
                <Form.Item
                  name="runtime"
                  label="Runtime"
                  rules={[
                    { required: true, message: 'Please input the runtime!' },
                  ]}
                >
                  <Input
                    type="number"
                    min={0}
                    className={`movie-input-field movie-input-field-${theme}`}
                  />
                </Form.Item>
                <Form.Item
                  name="status"
                  label="Status"
                  rules={[
                    { required: true, message: 'Please input the status!' },
                  ]}
                >
                  <Input
                    className={`movie-input-field movie-input-field-${theme}`}
                  />
                </Form.Item>
                <Form.Item
                  name="tagline"
                  label="Tagline"
                  rules={[
                    { required: true, message: 'Please input the tagline!' },
                  ]}
                >
                  <Input
                    className={`movie-input-field movie-input-field-${theme}`}
                  />
                </Form.Item>
              </Card>
            </Col>

            <Col xs={24} sm={24}>
              <Form.Item>
                <Button
                  shape="round"
                  className={`movie-form-button movie-form-button-${theme}`}
                  type="primary"
                  htmlType="submit"
                >
                  {movieId ? 'Update Movie' : 'Add Movie'}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Layout>
    </>
  );
};

export default MovieForm;
