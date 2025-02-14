import React from 'react';
import { Table } from 'antd';
import '../styles/commonTable.less';

const CommonTable = (props) => {
  const {
    dataSource,
    columns,
    handlePageChange,
    handleTableChange,
    listPersons,
    currentPage,
    className,
  } = props;

  const pagination = {
    current: currentPage,
    total: listPersons?.count,
    onChange: handlePageChange,
    showSizeChanger: false,
    className: 'table-pagination',
    position: ['bottomCenter'],
    responsive: true,
  };

  return (
    <>
      <Table
        className={className}
        dataSource={dataSource}
        columns={columns}
        rowKey={(obj) => obj?.id}
        pagination={pagination}
        onChange={handleTableChange}
        scroll={{ x: '100%' }}
      />
    </>
  );
};

export default CommonTable;
