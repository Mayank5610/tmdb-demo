import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LoginOutlined,
  LogoutOutlined,
  MoonOutlined,
  SunOutlined,
} from '@ant-design/icons';
import { Button, Menu, Space, Switch } from 'antd';
import { ThemeContext } from '../../../context/ThemeContext';
import { ROUTES, TOKEN } from '../../../common/constants';
import '../../../styles/RightMenu.less';

const RightMenu = ({ mode }) => {
  const navigate = useNavigate();
  const { toggleTheme, getTheme } = useContext(ThemeContext);

  const authToken = localStorage.getItem(TOKEN);

  const theme = getTheme();

  const handleLogin = () => {
    navigate(ROUTES?.LOGIN);
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN);
    navigate(ROUTES?.LOGIN);
  };

  return (
    <>
      <Space className={`right-menu right-menu-${theme}`}>
        {mode === 'horizontal' && (
          <Switch
            className={`toggle-switch toggle-switch-${theme}`}
            onChange={toggleTheme}
            checked={theme === 'dark'}
            checkedChildren={<SunOutlined />}
            unCheckedChildren={<MoonOutlined />}
          />
        )}
      </Space>

      {mode === 'horizontal' ? (
        authToken ? (
          <Button
            icon={<LogoutOutlined />}
            shape="round"
            className={`navbar-button navbar-button-${theme}`}
            type="primary"
            onClick={handleLogout}
          >
            Logout
          </Button>
        ) : (
          <Button
            icon={<LoginOutlined />}
            shape="round"
            className={`navbar-button navbar-button-${theme}`}
            type="primary"
            onClick={handleLogin}
          >
            Login
          </Button>
        )
      ) : (
        <Menu
          mode="vertical"
          className={`navbar-login-menu navbar-login-menu-${theme}`}
        >
          {authToken ? (
            <Menu.Item icon={<LogoutOutlined />} onClick={handleLogout}>
              Logout
            </Menu.Item>
          ) : (
            <Menu.Item icon={<LoginOutlined />} onClick={handleLogin}>
              Login
            </Menu.Item>
          )}
        </Menu>
      )}
    </>
  );
};

export default RightMenu;
