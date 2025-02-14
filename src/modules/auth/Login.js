import { useMutation } from '@apollo/client';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Layout,
  Row,
  Spin,
  notification,
} from 'antd';
import { LOGIN_EMAIL_PASSWORD } from './graphql/Mutations';
import { TOKEN } from '../../common/constants';
import { ThemeContext } from '../../context/ThemeContext';
import '../../styles/pages/home.less';

const Login = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { getTheme } = useContext(ThemeContext);
  const theme = getTheme();

  const [login, { loading, error }] = useMutation(LOGIN_EMAIL_PASSWORD, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      const token = data?.emailPasswordLogIn?.data?.token;
      if (token) {
        localStorage.setItem(TOKEN, token);
        notification.destroy();
        notification.success({
          message: 'Login Successful!',
          description: 'You are logged in!',
          className: `notification-success notification-success-${theme}`,
        });
        navigate(-1);
      } else {
        notification.destroy();
        notification.error({
          message: 'Login Failed!',
          description: 'Please enter valid email and password',
          className: `notification-error notification-error-${theme}`,
        });
      }
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

  if (loading)
    return (
      <div className="spinner">
        <Spin size="large" />
      </div>
    );

  if (error) {
    notification.destroy();
    notification.error({
      message: 'Error occured',
      description: `${error?.message}`,
      className: `notification-error notification-error-${theme}`,
    });
  }

  const onFinish = async (values) => {
    try {
      const variables = {
        data: {
          ...values,
        },
      };
      await login({ variables });
    } catch (error) {
      notification.destroy();
      notification.error({
        message: 'An Error Occured!',
        description: `${error?.message}`,
        className: `notification-error notification-error-${theme}`,
      });
    }
  };

  return (
    <>
      <Layout className={`login-layout login-layout-${theme}`}>
        <Row justify="center">
          <Col span={24}>
            <Card className={`login-card login-card-${theme}`} title="Login">
              <Form
                id={`form-${theme}`}
                form={form}
                className={`login-form login-form-${theme}`}
                name="login"
                layout="vertical"
                onFinish={onFinish}
              >
                <Row gutter={8}>
                  <Col span={24}>
                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[
                        { required: true, message: 'Please enter your email!' },
                      ]}
                    >
                      <Input className={`form-input form-input-${theme}`} />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      name="password"
                      label="Password"
                      rules={[
                        {
                          required: true,
                          message: 'Please enter your password',
                        },
                      ]}
                    >
                      <Input.Password
                        className={`form-input form-input-${theme}`}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item>
                      <Button
                        type="primary"
                        shape="round"
                        className={`login-button login-button-${theme}`}
                        htmlType="submit"
                        loading={loading}
                      >
                        Login
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>
          </Col>
        </Row>
      </Layout>
    </>
  );
};

export default Login;
