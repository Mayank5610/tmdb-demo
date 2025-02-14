import { useMutation, useQuery } from '@apollo/client';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Divider,
  Input,
  Row,
  Space,
  Spin,
  Tooltip,
  notification,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { debounce } from 'lodash';
import { GET_LIST_PERSONS } from './graphql/Queries';
import { DELETE_PERSON } from './graphql/Mutations';
import { ROUTES, SORT_OPTIONS } from '../../common/constants';
import PersonDetailsModal from './PersonDetailsModal';
import Portal from '../../components/Portal';
import CommonTable from '../../components/CommonTable';
import { ThemeContext } from '../../context/ThemeContext';
import '../../styles/pages/persons.less';
import CommonDeleteModal from '../../components/CommonDeleteModal';

const Persons = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const field = 'name';
  const [sortOrder, setSortOrder] = useState(SORT_OPTIONS?.ASCENDING);
  const [search, setSearch] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deletePerson, setDeletePerson] = useState('');
  const [deletePersonName, setDeletePersonName] = useState('');
  const [loading, setLoading] = useState(true);
  const [timeOutId, setTimeOutId] = useState(null);
  const SearchPersonRef = useRef(null);
  const { getTheme } = useContext(ThemeContext);
  const theme = getTheme();

  const navigate = useNavigate();

  const {
    loading: queryLoading,
    error: queryError,
    data,
    fetchMore,
  } = useQuery(GET_LIST_PERSONS, {
    fetchPolicy: 'cache-and-network',
    variables: {
      filter: {
        limit: pageSize,
        skip: (currentPage - 1) * pageSize,
        searchTerm: searchTerm,
      },
      sort: {
        field: field,
        order: sortOrder,
      },
    },
    onCompleted: () => {
      clearTimeout(timeOutId);
      setTimeOutId(
        setTimeout(() => {
          setLoading(false);
        }, 2000),
      );
    },
  });

  const [deletePersonData, { loading: deleteLoading, error: deleteError }] =
    useMutation(DELETE_PERSON, {
      variables: { id: deletePerson },
      onCompleted: () => {
        notification.destroy();
        notification.success({
          message: 'Person Deletion Completed!',
          description: 'Person Data Deleted!',
          className: `notification-success notification-success-${theme}`,
        });
        fetchMore({
          variables: {
            filter: {
              limit: pageSize,
              skip: (currentPage - 1) * pageSize,
              searchTerm: searchTerm,
            },
            sort: {
              field: field,
              order: sortOrder,
            },
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult) return previousResult;

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
    if (search !== '' && SearchPersonRef.current !== null) {
      SearchPersonRef.current.focus();
    }
  }, [searchTerm, data, search]);

  const handleSearch = useMemo(
    () =>
      debounce((value) => {
        setSearchTerm(value);
      }, 500),
    [],
  );

  useEffect(() => {
    return () => {
      handleSearch.cancel();
    };
  }, [handleSearch]);

  if (queryLoading && !data)
    return (
      <div className="spinner">
        <Spin size="large" />
      </div>
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

  const { listPersons } = data;

  const columns = [
    {
      title: 'Index',
      key: 'index',
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      render: (name) => name || '-',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender) => gender || '-',
    },
    {
      title: 'Biography',
      dataIndex: 'biography',
      key: 'biography',
      render: (biography) => biography || '-',
    },
    {
      title: 'Birthday',
      dataIndex: 'birthday',
      key: 'birthday',
      render: (birthday) => birthday || '-',
    },
    {
      title: 'Adult',
      dataIndex: 'adult',
      key: 'adult',
      render: (adult) => (adult ? 'Yes' : 'No'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            shape="round"
            className={`view-button view-button-${theme}`}
            onClick={() => handleViewModal(record)}
          >
            <EyeOutlined />
          </Button>
          <Button
            shape="round"
            className={`edit-button edit-button-${theme}`}
            onClick={() => {
              handleEditClick(record);
            }}
          >
            <EditOutlined />
          </Button>
          <Button
            shape="round"
            className={`person-delete-button person-delete-button-${theme}`}
            onClick={() => handleDeleteModalVisible(record)}
          >
            <DeleteOutlined />
          </Button>
        </Space>
      ),
    },
  ];

  const handleTableChange = () => {
    const newSortOrder =
      sortOrder === SORT_OPTIONS?.ASCENDING
        ? SORT_OPTIONS?.DESCENDING
        : SORT_OPTIONS?.ASCENDING;
    setSortOrder(newSortOrder);

    fetchMore({
      variables: {
        filter: {
          limit: pageSize,
          skip: (currentPage - 1) * pageSize,
          searchTerm: searchTerm,
        },
        sort: {
          field: field,
          order: newSortOrder,
        },
      },
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleChange = (e) => {
    const value = e?.target?.value;
    setSearch(value);
    handleSearch(value);
  };

  const handleAddPerson = () => {
    navigate(ROUTES?.PERSON_CREATE);
  };

  const handleViewModal = (record) => {
    setSelectedPerson(record);
    setViewModalVisible(true);
  };

  const handleViewModalClose = () => {
    setViewModalVisible(false);
  };

  const handleEditClick = (person) => {
    const personId = person?.id;
    navigate(`${ROUTES?.PERSON_LIST}/${personId}/edit`);
  };

  const handleDeleteModalVisible = (record) => {
    setDeletePerson(record?.id);
    setDeletePersonName(record?.name);
    setDeleteModalVisible(true);
  };

  const handleDelete = () => {
    deletePersonData();
    setDeleteModalVisible(false);
  };

  const handleDeleteModalClose = () => {
    setDeleteModalVisible(false);
  };

  const personData = data?.listPersons?.data;

  const personDataList =
    personData?.map((person) => ({ ...person, key: person?.id })) || [];

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
              className={`breadcrumb-item-active breadcrumb-item-${theme}`}
            >
              Person List
            </NavLink>
          </Breadcrumb.Item>
        </Breadcrumb>
      </Portal>
      <Divider className={`persons-divider persons-divider-${theme}`}>
        Persons List
      </Divider>
      <Card className={`person-table-card person-table-card-${theme}`}>
        <Row gutter={[8, 8]} className="person-filter-row">
          <Col xs={16} sm={12} md={8} lg={6} className="person-filter-col">
            <Input
              className={`search-person-field search-person-field-${theme}`}
              value={search}
              placeholder="Search By Name"
              onChange={handleChange}
              ref={SearchPersonRef}
            />
          </Col>
          <Col className="person-add-col">
            <Tooltip title="Add New Person" placement="topRight">
              <Button
                icon={<PlusCircleOutlined />}
                shape="round"
                className={`add-person-button add-person-button-${theme}`}
                type="primary"
                onClick={handleAddPerson}
              >
                Add
              </Button>
            </Tooltip>
          </Col>
        </Row>
        <CommonTable
          className={`person-table person-table-${theme}`}
          dataSource={personDataList}
          columns={columns}
          listPersons={listPersons}
          currentPage={currentPage}
          rowKey={(obj) => obj?.id}
          handlePageChange={handlePageChange}
          handleTableChange={handleTableChange}
        />

        <PersonDetailsModal
          visible={viewModalVisible}
          onClose={handleViewModalClose}
          person={selectedPerson}
        />
      </Card>

      <CommonDeleteModal
        className={`person-delete-modal person-delete-modal-${theme}`}
        isModalVisible={deleteModalVisible}
        handleDelete={handleDelete}
        handleDeleteModalClose={handleDeleteModalClose}
        buttonDeleteClassName={`person-modal-delete-button person-modal-delete-button-${theme}`}
        deleteLoading={deleteLoading}
        buttonCancelClassName={`person-modal-cancel-button person-modal-cancel-button-${theme}`}
        selectedTypeName={deletePersonName}
      />
    </>
  );
};

export default Persons;
