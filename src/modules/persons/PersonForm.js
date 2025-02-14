import React, { useContext, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
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
  Select,
  notification,
} from 'antd';
import moment from 'moment/moment';
import Portal from '../../components/Portal';
import { GET_PERSON } from './graphql/Queries';
import { CREATE_PERSON, UPDATE_PERSON } from './graphql/Mutations';
import {
  DEFAULTDATETIMEFORMATFORREPORTS,
  ROUTES,
} from '../../common/constants';
import { ThemeContext } from '../../context/ThemeContext';
import '../../styles/pages/personForm.less';

const PersonForm = () => {
  const navigate = useNavigate();
  const { getTheme } = useContext(ThemeContext);
  const theme = getTheme();

  const [form] = Form.useForm();
  const { personId } = useParams();

  const { data, error: queryError } = useQuery(GET_PERSON, {
    variables: { id: personId },
    fetchPolicy: 'cache-and-network',
    skip: !personId,
    onError: ({ graphQLErrors, clientErrors }) => {
      if (graphQLErrors) {
        navigate(-2);
        graphQLErrors?.forEach((error) => {
          notification.destroy();
          notification.error({
            message: 'Error',
            description: `${error?.message}`,
            className: `notification-error notification-error-${theme}`,
          });
        });
      } else {
        navigate(-2);
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
      description: queryError,
      className: `notification-error notification-error-${theme}`,
    });
  }

  const [personMutation, { loading, error }] = useMutation(
    personId ? UPDATE_PERSON : CREATE_PERSON,
    {
      fetchPolicy: 'network-only',
      onCompleted: () => {
        const action = personId ? 'Updated' : 'Added';
        notification.destroy();
        notification.success({
          message: `Person ${action} Successfully!`,
          description: `Person ${action} Successfully!`,
          className: `notification-success notification-success-${theme}`,
        });
        navigate(ROUTES?.PERSON_LIST);
      },
      onError: ({ graphQLErrors, clientErrors }) => {
        if (graphQLErrors) {
          navigate(-2);
          graphQLErrors?.forEach((error) => {
            notification.destroy();
            notification.error({
              message: 'Error',
              description: `${error?.message}`,
              className: `notification-error notification-error-${theme}`,
            });
          });
        } else {
          navigate(-2);
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
      const person = data?.person?.data;
      const initialValues = {
        ...person,
        birthday: moment(person?.birthday)?.isValid()
          ? moment(person?.birthday)
          : null,
      };
      form.setFieldsValue(initialValues);
    }
  }, [form, data]);

  const handleSubmit = (values) => {
    const formattedBirthDay = values?.birthday
      ? moment(values?.birthday)?.toISOString()
      : null;

    const formattedAlsoKnownAs = values?.alsoKnownAs?.length
      ? values?.alsoKnownAs
      : [];

    const variables = {
      ...values,
      birthday: formattedBirthDay,
      alsoKnownAs: formattedAlsoKnownAs,
    };

    try {
      form.validateFields();
      if (personId) {
        personMutation({
          variables: { data: { ...variables }, id: personId },
        });
      } else {
        personMutation({ variables: { data: variables } });
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

  const disabledDate = (current) => {
    return current && current > moment().endOf('day');
  };

  if (error) {
    navigate(ROUTES?.PERSON_LIST);
    notification.destroy();
    notification.error({
      message: 'Error Occured!',
      description: `${error?.message}`,
      className: `notification-error notification-error-${theme}`,
    });
  }

  const personName = data?.person?.data?.name;

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
              to={ROUTES?.PERSON_LIST}
              className={`breadcrumb-item breadcrumb-item-${theme}`}
            >
              Person List
            </NavLink>
          </Breadcrumb.Item>
          {data ? (
            <>
              <Breadcrumb.Item>
                <span
                  to={`${ROUTES?.PERSON_LIST}/${personId}`}
                  className={`breadcrumb-item breadcrumb-item-${theme}`}
                >
                  {personName}
                </span>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <NavLink
                  to={`${ROUTES?.PERSON_LIST}/${personId}/edit`}
                  className={`breadcrumb-item-active breadcrumb-item-${theme}`}
                >
                  Edit
                </NavLink>
              </Breadcrumb.Item>
            </>
          ) : (
            <Breadcrumb.Item>
              <NavLink
                to={`${ROUTES?.PERSON_CREATE}`}
                className={`breadcrumb-item-active breadcrumb-item-${theme}`}
              >
                Create Person
              </NavLink>
            </Breadcrumb.Item>
          )}
        </Breadcrumb>
      </Portal>
      <Layout className={`person-form-layout-${theme}`}>
        <Divider className={`person-form-divider person-form-divider-${theme}`}>
          {personId ? 'Update' : 'Add New'} Person Form
        </Divider>
        <Form
          className={`person-form person-form-${theme}`}
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={[8, 8]}>
            <Col xs={24} sm={12} md={12} lg={12}>
              <Card className={`person-form-card person-form-card-${theme}`}>
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[
                    { required: true, message: 'Please input the name!' },
                  ]}
                >
                  <Input
                    className={`person-input-field person-input-field-${theme}`}
                  />
                </Form.Item>
                <Form.Item
                  label="Gender"
                  name="gender"
                  rules={[
                    { required: true, message: 'Please select the gender!' },
                  ]}
                >
                  <Radio.Group>
                    <Radio
                      className={`person-radio person-radio-${theme}`}
                      value="MALE"
                    >
                      Male
                    </Radio>
                    <Radio
                      className={`person-radio person-radio-${theme}`}
                      value="FEMALE"
                    >
                      Female
                    </Radio>
                    <Radio
                      className={`person-radio person-radio-${theme}`}
                      value="OTHER"
                    >
                      Others
                    </Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item
                  label="Biography"
                  name="biography"
                  rules={[
                    { required: true, message: 'Please enter the biography!' },
                  ]}
                >
                  <Input
                    className={`person-input-field person-input-field-${theme}`}
                  />
                </Form.Item>
                <Form.Item
                  label="Birthday"
                  name="birthday"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter the birthday!',
                    },
                  ]}
                >
                  <DatePicker
                    format={DEFAULTDATETIMEFORMATFORREPORTS}
                    className={`person-date-field person-date-field-${theme}`}
                    popupClassName={`person-date-picker person-date-picker-${theme}`}
                    disabledDate={disabledDate}
                  />
                </Form.Item>
              </Card>
            </Col>

            <Col xs={24} sm={12} md={12} lg={12}>
              <Card className={`person-form-card person-form-card-${theme}`}>
                <Form.Item
                  label="Adult"
                  name="adult"
                  rules={[
                    {
                      required: true,
                      message: 'Please select the adult!',
                    },
                  ]}
                >
                  <Radio.Group>
                    <Radio
                      className={`person-radio person-radio-${theme}`}
                      value={true}
                    >
                      Yes
                    </Radio>
                    <Radio
                      className={`person-radio person-radio-${theme}`}
                      value={false}
                    >
                      No
                    </Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item
                  label="Place Of Birth"
                  name="placeOfBirth"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter the place of birth!',
                    },
                  ]}
                >
                  <Input
                    className={`person-input-field person-input-field-${theme}`}
                  />
                </Form.Item>
                <Form.Item
                  label="Also Known As"
                  name="alsoKnownAs"
                  rules={[
                    { required: true, message: 'Please enter the aliases!' },
                  ]}
                >
                  <Select
                    mode="tags"
                    className={`select-aliases select-aliases-${theme}`}
                    placeholder="Enter aliases"
                    popupClassName={`select-aliases-dropdown select-aliases-dropdown-${theme}`}
                  />
                </Form.Item>
              </Card>
            </Col>
            <Col xs={24} sm={24}>
              <Form.Item>
                <Button
                  shape="round"
                  className={`person-form-button person-form-button-${theme}`}
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                >
                  {personId ? 'Update Person' : 'Add Person'}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Layout>
    </>
  );
};

export default PersonForm;
