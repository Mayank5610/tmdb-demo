import { Button, Modal, Space } from 'antd';
import React from 'react';

const CommonDeleteModal = ({
  className,
  isModalVisible,
  handleDelete,
  handleDeleteModalClose,
  buttonDeleteClassName,
  deleteLoading,
  buttonCancelClassName,
  selectedTypeName,
}) => {
  return (
    <>
      <Modal
        title="Confirm Delete"
        className={className}
        open={isModalVisible}
        onOk={handleDelete}
        onCancel={handleDeleteModalClose}
        footer={[
          <Space>
            <Button
              shape="round"
              className={buttonDeleteClassName}
              type="primary"
              danger
              onClick={handleDelete}
              loading={deleteLoading}
            >
              Delete
            </Button>
            <Button
              shape="round"
              className={buttonCancelClassName}
              onClick={handleDeleteModalClose}
            >
              Cancel
            </Button>
          </Space>,
        ]}
      >
        Are you sure you want to delete "{selectedTypeName}"?
      </Modal>
    </>
  );
};

export default CommonDeleteModal;
