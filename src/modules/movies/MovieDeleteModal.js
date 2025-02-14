import { Button, Modal, Space } from 'antd';
import React from 'react';

const MovieDeleteModal = ({
  className,
  isModalVisible,
  handleDelete,
  handleDeleteModalClose,
  buttonDeleteClassName,
  deleteLoading,
  buttonCancelClassName,
  selectedMovieName,
}) => {
  return (
    <>
      <Modal
        className={className}
        title="Confirm Delete"
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
        Are you sure you want to delete movie with name "{selectedMovieName}"?
      </Modal>
    </>
  );
};

export default MovieDeleteModal;
