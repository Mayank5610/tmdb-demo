import { Button, Layout, Result } from 'antd';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import '../../styles/pages/pagenotFound.less';

const PageNotFound = () => {
  const navigate = useNavigate();
  const { getTheme } = useContext(ThemeContext);
  const theme = getTheme();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <Layout className={`not-found-layout not-found-layout-${theme}`}>
        <Result
          className={`page-not-found`}
          status="404"
          title="404"
          subTitle="Sorry, the page you visited does not exist."
          extra={
            <Button
              type="primary"
              shape="round"
              className={`page-not-found-button page-not-found-button-${theme}`}
              onClick={handleBack}
            >
              Go Back
            </Button>
          }
        />
      </Layout>
    </>
  );
};

export default PageNotFound;
