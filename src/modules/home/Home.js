import { useQuery } from '@apollo/client';
import React, { useContext, useState } from 'react';
import { TOP_RATED_MOVIES } from './graphql/Queries';
import { Breadcrumb, Col, Divider, Row, Skeleton, notification } from 'antd';
import MovieCard from '../movies/MovieCard';
import Portal from '../../components/Portal';
import { NavLink } from 'react-router-dom';
import { FIELD_OPTIONS, ROUTES, SORT_OPTIONS } from '../../common/constants';
import { ThemeContext } from '../../context/ThemeContext';
import '../../styles/pages/home.less';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [timeOutId, setTimeOutId] = useState(null);
  const { getTheme } = useContext(ThemeContext);
  const theme = getTheme();

  const { error, data } = useQuery(TOP_RATED_MOVIES, {
    fetchPolicy: 'cache-and-network',
    variables: {
      filter: {
        skip: 0,
        limit: 5,
      },
      sort: {
        field: FIELD_OPTIONS?.RELEASE_DATE,
        order: SORT_OPTIONS?.ASCENDING,
      },
    },
    onCompleted: () => {
      clearInterval(timeOutId);
      setTimeOutId(
        setTimeout(() => {
          setLoading(false);
        }, 2000),
      );
    },
    onError: ({ graphQLErrors, clientErrors }) => {
      if (graphQLErrors) {
        graphQLErrors?.forEach((error) => {
          notification.destroy();
          notification.error({
            message: 'Error',
            description: `${error?.message}`,
            className: `notification-error notification-error-${theme}`,
          });
        });
      } else {
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
    notification.error({
      message: 'Error Occured!',
      description: `${error?.message}`,
      className: `notification-error notification-error-${theme}`,
    });
  }

  return (
    <>
      <Portal portalId="breadcrumbs-portal">
        <Breadcrumb className={`breadcrumb breadcrumb-${theme}`}>
          <Breadcrumb.Item>
            <NavLink
              to={ROUTES?.HOME}
              className={`breadcrumb-item-active breadcrumb-item-${theme}`}
            >
              Home
            </NavLink>
          </Breadcrumb.Item>
        </Breadcrumb>
      </Portal>
      <Divider className={`home-divider home-divider-${theme}`}>
        Top Rated Movies
      </Divider>
      <Row gutter={[8, 8]} className="home-movie-row">
        {data?.movies?.data?.map((movie) => (
          <Col key={movie?.id} xs={24} sm={12} md={12} lg={8} xl={6} xxl={4}>
            <Skeleton
              active
              loading={loading}
              className={`home-skeleton home-skeleton-${theme}`}
            >
              <MovieCard movie={movie} />
            </Skeleton>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default Home;
