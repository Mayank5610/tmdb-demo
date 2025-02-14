import { useQuery } from '@apollo/client';
import React, { useContext } from 'react';
import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Breadcrumb,
  Button,
  Card,
  Descriptions,
  Spin,
  Typography,
  notification,
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { GET_MOVIE_DETAILS } from './graphql/Queries';
import { ROUTES } from '../../common/constants';
import Portal from '../../components/Portal';
import { ThemeContext } from '../../context/ThemeContext';
import '../../styles/pages/movieDetails.less';

const { Title } = Typography;

const MovieDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { movieId } = useParams();
  const { getTheme } = useContext(ThemeContext);
  const theme = getTheme();

  const { loading, error, data } = useQuery(GET_MOVIE_DETAILS, {
    variables: { id: movieId },
    fetchPolicy: 'cache-and-network',
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

  if (error) {
    notification.destroy();
    return notification.error({
      message: 'Error Occured!',
      description: `${error?.message}`,
      className: `notification-error notification-error-${theme}`,
    });
  }

  if (loading) {
    return (
      <div className="spinner">
        <Spin size="large" />
      </div>
    );
  }

  const movie = data?.movie?.data;

  const handleBack = () => {
    if (location?.pathname === `${ROUTES?.HOME}`) {
      navigate(-2);
    } else {
      navigate(-1);
    }
  };

  const handleEdit = (movieId) => {
    navigate(`${ROUTES.MOVIE_CARD}/${movieId}/edit`);
  };

  const movieTitle = data?.movie?.data?.title;

  return (
    <>
      {movie && (
        <Portal portalId="breadcrumbs-portal">
          <Breadcrumb className="breadcrumb">
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
            <Breadcrumb.Item>
              <NavLink
                to={`${ROUTES?.MOVIE_CARD}/${movieId}`}
                className={`breadcrumb-item-active breadcrumb-item-${theme}`}
              >
                {movieTitle}
              </NavLink>
            </Breadcrumb.Item>
          </Breadcrumb>
        </Portal>
      )}
      <Button
        shape="round"
        className={`back-button back-button-${theme}`}
        type="primary"
        onClick={handleBack}
      >
        <ArrowLeftOutlined /> Back
      </Button>
      <Title
        level={2}
        className={`movie-detail-title movie-detail-title-${theme}`}
      >
        {movie?.title}
      </Title>
      <Card className={`movie-detail-card movie-detail-card-${theme}`}>
        <Descriptions
          bordered
          column={1}
          className={`movie-detail movie-detail-${theme}`}
        >
          <Descriptions.Item label="Poster">
            <img
              className="details-image"
              src={movie?.originalTitle}
              alt={movie?.title}
            />
          </Descriptions.Item>
          <Descriptions.Item label="Image URL">
            <img
              className="movie-details-image-url"
              src={movie?.imageUrl || '-'}
              alt={movie?.imageUrl && movie?.title}
            />
          </Descriptions.Item>
          <Descriptions.Item label="ID">{movie?.id}</Descriptions.Item>
          <Descriptions.Item label="Overview">
            {movie?.overview}
          </Descriptions.Item>
          <Descriptions.Item label="Adult">
            {movie?.adult ? 'Yes' : 'No'}
          </Descriptions.Item>
          <Descriptions.Item label="Original Language">
            {movie?.originalLanguage}
          </Descriptions.Item>
          <Descriptions.Item label="Budget">{movie?.budget}</Descriptions.Item>
          <Descriptions.Item label="Revenue">
            {movie?.revenue}
          </Descriptions.Item>
          <Descriptions.Item label="Release Date">
            {movie?.releaseDate}
          </Descriptions.Item>
          <Descriptions.Item label="Runtime">
            {movie?.runtime} minutes
          </Descriptions.Item>
          <Descriptions.Item label="Status">{movie?.status}</Descriptions.Item>
          <Descriptions.Item label="Tagline">
            {movie?.tagline}
          </Descriptions.Item>
          <Descriptions.Item label="Do you want to edit movie?">
            <Button
              shape="round"
              type="primary"
              className={`movie-edit-button movie-edit-button-${theme}`}
              onClick={() => handleEdit(movie?.id)}
            >
              Edit
            </Button>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </>
  );
};

export default MovieDetail;
