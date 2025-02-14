import { useMutation, useQuery } from '@apollo/client';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Breadcrumb,
  Button,
  Col,
  Divider,
  Input,
  Row,
  Select,
  Skeleton,
  Tooltip,
  notification,
} from 'antd';
import { debounce } from 'lodash';
import { PlusCircleOutlined } from '@ant-design/icons';
import { GET_LIST_MOVIES } from './graphql/Queries';
import { DELETE_MOVIE } from './graphql/Mutations';
import {
  CATEGORIES,
  FIELD_OPTIONS,
  ROUTES,
  SORT_OPTIONS,
  TOKEN,
} from '../../common/constants';
import Portal from '../../components/Portal';
import { ThemeContext } from '../../context/ThemeContext';
import MovieCard from './MovieCard';
import '../../styles/pages/movies.less';
import CommonDeleteModal from '../../components/CommonDeleteModal';

const { Option } = Select;

const Movies = () => {
  const [moreMovies, setMoreMovies] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [order, setOrder] = useState(SORT_OPTIONS?.DESCENDING);
  const [category, setCategory] = useState(CATEGORIES?.LATEST);
  const [search, setSearch] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedMovieName, setSelectedMovieName] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [skip, setSkip] = useState(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [timeOutId, setTimeOutId] = useState(null);
  const field = FIELD_OPTIONS?.RELEASE_DATE;
  const SearchMovieRef = useRef(null);
  const previousSort = useRef(order);
  const { getTheme } = useContext(ThemeContext);

  const navigate = useNavigate();
  const authToken = localStorage?.getItem(TOKEN);

  const theme = getTheme();

  const {
    error: queryError,
    data,
    fetchMore,
  } = useQuery(GET_LIST_MOVIES, {
    fetchPolicy: 'cache-and-network',
    variables: {
      filter: {
        limit: 10,
        skip: 0,
        category: category,
        searchTerm: searchTerm,
      },
      sort: {
        field: field,
        order: order,
      },
    },
    onCompleted: (data) => {
      clearTimeout(timeOutId);
      setCount(data?.listMovies?.count);
      setSkip(data?.listMovies?.data?.length);
      setTimeOutId(
        setTimeout(() => {
          setLoading(false);
        }, 2000),
      );
    },
    onError: ({ graphQLErrors, clientErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors?.forEach((error) => {
          notification.destroy();
          notification.error({
            message: 'Error',
            description: `${error?.message}`,
            className: `notification-error notification-error-${theme}`,
          });
        });
      } else if (networkError) {
        notification.destroy();
        notification.error({
          messsage: 'Error',
          description: networkError?.message,
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

  const [deleteMovieData, { error: deleteError, loading: deleteLoading }] =
    useMutation(DELETE_MOVIE, {
      variables: { id: selectedMovie },
      onCompleted: () => {
        notification.destroy();
        notification.success({
          message: 'Movie Deletion Completed!',
          description: 'Movie Deleted Successfully!',
          className: `notification-success notification-success-${theme}`,
        });
        fetchMore({
          variables: {
            filter: {
              limit: 10,
              skip: 0,
              category: category,
              searchTerm: searchTerm,
            },
            sort: {
              field: field,
              order: order,
            },
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              return previousResult;
            }
            setSkip(fetchMoreResult?.listMovies?.data?.length);
            setCount(fetchMoreResult?.listMovies?.count);
            return fetchMoreResult;
          },
        });
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

  useEffect(() => {
    if (search !== '' && SearchMovieRef?.current !== null) {
      SearchMovieRef?.current.focus();
    }
  }, [authToken, searchTerm, search]);

  const handleSearch = useMemo(
    () =>
      debounce((value) => {
        setLoading(true);
        setSearchTerm(value);
      }, 500),
    [],
  );

  if (queryError) {
    notification.destroy();
    return notification.error({
      message: 'Error Occured!',
      description: `${queryError?.message}`,
      className: `notification-error notification-error-${theme}`,
    });
  }

  if (deleteError) {
    notification.destroy();
    return notification.error({
      message: 'Error Occured!',
      description: `${deleteError?.message}`,
      className: `notification-error notification-error-${theme}`,
    });
  }

  const fetchMoreMovies = () => {
    if (skip < count) {
      fetchMore({
        variables: {
          filter: {
            limit: 10,
            skip: skip,
            category: category,
            searchTerm: searchTerm,
          },
          sort: {
            field: field,
            order: order,
          },
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            setMoreMovies(false);
            return previousResult;
          }
          const newData = [
            ...previousResult?.listMovies?.data,
            ...fetchMoreResult?.listMovies?.data,
          ];
          setSkip(newData?.length);
          setIsFetching(false);

          return {
            ...previousResult,
            listMovies: {
              ...previousResult?.listMovies,
              data: newData,
            },
          };
        },
      });
    }
  };

  const handleScroll = (e) => {
    const { target } = e;
    const { scrollTop, clientHeight, scrollHeight } = target || {};
    const scrolledToBottom = scrollTop + clientHeight >= scrollHeight - 5;

    if (scrolledToBottom && moreMovies && !isFetching) {
      setIsFetching(true);
      fetchMoreMovies();
    }
  };

  const filteredMovies = data?.listMovies?.data;

  const handleSortChange = (value) => {
    if (previousSort?.current !== value) {
      previousSort.current = value;
      setOrder(value);
      fetchMore({
        variables: {
          filter: {
            limit: 10,
            skip: 0,
            category: category,
            searchTerm: searchTerm,
          },
          sort: {
            field: field,
            order: value,
          },
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return previousResult;
          return fetchMoreResult;
        },
      });
    }
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
    fetchMore({
      variables: {
        filter: {
          limit: 10,
          skip: 0,
          category: value,
          searchTerm: searchTerm,
        },
        sort: {
          field: field,
          order: order,
        },
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) return previousResult;
        return fetchMoreResult;
      },
    });
  };

  const handleChange = (e) => {
    const value = e?.target?.value;
    setSearch(value);
    handleSearch(value);
  };

  const handleDeleteModalVisible = (movie) => {
    setSelectedMovie(movie?.id);
    setSelectedMovieName(movie?.title);
    setIsModalVisible(true);
  };

  const handleDelete = () => {
    deleteMovieData();
    setIsModalVisible(false);
  };

  const handleDeleteModalClose = () => setIsModalVisible(false);

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
              className={`breadcrumb-item-active breadcrumb-item-${theme}`}
            >
              Movies Card
            </NavLink>
          </Breadcrumb.Item>
        </Breadcrumb>
      </Portal>
      <Divider className={`movies-divider movies-divider-${theme}`}>
        Movies List
      </Divider>
      <div className="movie-filter-wrapper">
        <Row gutter={[8, 8]} className="filter-row" wrap={false}>
          <Col className="filter-col" flex="auto">
            <Input
              placeholder="Search Movies"
              value={search}
              className={`movies-search-field movies-search-field-${theme}`}
              onChange={handleChange}
              ref={SearchMovieRef}
            />
          </Col>
          <Col flex="none" className="filter-col">
            <Tooltip title="Add New Movie" placement="topRight">
              <Button
                shape="round"
                icon={<PlusCircleOutlined />}
                className={`add-movie-button add-movie-button-${theme}`}
                type="primary"
                onClick={() => navigate(ROUTES?.MOVIE_CREATE)}
              >
                Add
              </Button>
            </Tooltip>
          </Col>
        </Row>
        <Row gutter={[8, 8]} className="filter-row">
          <Col className="filter-col" xs={12} sm={12} md={12} lg={12}>
            <Select
              className={`sort-select sort-select-${theme}`}
              defaultValue={order}
              onChange={handleSortChange}
              popupClassName={`sort-dropdown sort-dropdown-${theme}`}
            >
              <Option
                value={SORT_OPTIONS?.ASCENDING}
                className={`sort-option sort-option-${theme}`}
              >
                Ascending
              </Option>
              <Option
                value={SORT_OPTIONS?.DESCENDING}
                className={`sort-option sort-option-${theme}`}
              >
                Descending
              </Option>
            </Select>
          </Col>
          <Col className="filter-col" xs={12} sm={12} md={12} lg={12}>
            <Select
              className={`category-select category-select-${theme}`}
              defaultValue={category}
              onChange={handleCategoryChange}
              popupClassName={`category-dropdown category-dropdown-${theme}`}
            >
              <Option
                value={CATEGORIES?.LATEST}
                className={`category-option category-option-${theme}`}
              >
                Latest
              </Option>
              <Option
                value={CATEGORIES?.PLAYING_IN_THEATERS}
                className={`category-option category-option-${theme}`}
              >
                Playing in Theaters
              </Option>
              <Option
                value={CATEGORIES?.POPULAR}
                className={`category-option category-option-${theme}`}
              >
                Popular
              </Option>
              <Option
                value={CATEGORIES?.TOP_RATED}
                className={`category-option category-option-${theme}`}
              >
                Top Rated
              </Option>
              <Option
                value={CATEGORIES?.UPCOMING}
                className={`category-option category-option-${theme}`}
              >
                Upcoming
              </Option>
            </Select>
          </Col>
        </Row>
      </div>
      <Row gutter={[8, 8]} className="movie-row" onScroll={handleScroll}>
        {filteredMovies?.map((movie, index) => (
          <Col
            className="movie-column"
            key={index}
            xs={24}
            sm={12}
            md={12}
            lg={8}
            xl={6}
            xxl={4}
          >
            <Skeleton
              active
              loading={loading}
              className={`movies-skeleton movies-skeleton-${theme}`}
            >
              <MovieCard
                movie={movie}
                onDelete={() => handleDeleteModalVisible(movie)}
              />
            </Skeleton>
          </Col>
        ))}
      </Row>

      <CommonDeleteModal
        className={`movie-delete-modal movie-delete-modal-${theme}`}
        isModalVisible={isModalVisible}
        handleDelete={handleDelete}
        handleDeleteModalClose={handleDeleteModalClose}
        buttonDeleteClassName={`movie-modal-delete-button movie-modal-delete-button-${theme}`}
        deleteLoading={deleteLoading}
        buttonCancelClassName={`movie-modal-cancel-button movie-modal-cancel-button-${theme}`}
        selectedTypeName={selectedMovieName}
      />
    </>
  );
};

export default Movies;
