import React, { useContext } from 'react';
import { Button, Descriptions, Modal } from 'antd';
import { ThemeContext } from '../../context/ThemeContext';
import '../../styles/pages/personDetailsModal.less';

const PersonDetailsModal = ({ visible, onClose, person }) => {
  const { getTheme } = useContext(ThemeContext);
  const theme = getTheme();

  return (
    <div>
      <Modal
        className={`view-modal view-modal-${theme}`}
        title="Person Details"
        open={visible}
        onCancel={onClose}
        footer={[
          <Button
            shape="round"
            className={`view-cancel-button view-cancel-button-${theme}`}
            type="primary"
            key="close"
            onClick={onClose}
          >
            Close
          </Button>,
        ]}
      >
        {person && (
          <Descriptions
            bordered
            column={1}
            className={`person-description person-description-${theme}`}
          >
            <Descriptions.Item label="Name">
              {person?.name || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Gender">
              {person?.gender || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Adult">
              {person?.adult ? 'Yes' : 'No'}
            </Descriptions.Item>
            <Descriptions.Item label="Biography">
              {person?.biography || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Birthday">
              {person?.birthday || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Place of Birth">
              {person?.placeOfBirth || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Also Known As">
              {Array.isArray(person?.alsoKnownAs)
                ? person?.alsoKnownAs.join(', ')
                : '-'}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default PersonDetailsModal;
