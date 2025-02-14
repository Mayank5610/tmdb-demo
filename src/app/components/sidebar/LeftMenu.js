import React, { useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu } from 'antd';
import { HomeOutlined, UserOutlined, YoutubeOutlined } from '@ant-design/icons';
import { ThemeContext } from '../../../context/ThemeContext';
import { ROUTES } from '../../../common/constants';
import '../../../styles/LeftMenu.less';

const LeftMenu = ({ mode }) => {
  const location = useLocation();
  const { getTheme } = useContext(ThemeContext);
  const theme = getTheme();

  const menuItems = [
    {
      key: ROUTES?.HOME,
      label: <NavLink to={ROUTES?.HOME}>Home</NavLink>,
      icon: <HomeOutlined />,
    },
    {
      key: ROUTES?.MOVIE_CARD,
      label: <NavLink to={ROUTES?.MOVIE_CARD}>Movies</NavLink>,
      icon: <YoutubeOutlined />,
    },
    {
      key: ROUTES?.PERSON_LIST,
      label: <NavLink to={ROUTES?.PERSON_LIST}>Persons</NavLink>,
      icon: <UserOutlined />,
    },
  ];

  return (
    <>
      <Menu
        className={`left-menu-horizontal left-menu-horizontal-${theme}`}
        selectedKeys={[location?.pathname]}
        items={menuItems}
        mode={mode}
      />
    </>
  );
};

export default LeftMenu;
