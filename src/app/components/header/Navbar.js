import React, { useContext, useEffect, useState } from 'react';
import { Button, Drawer, Layout, Switch } from 'antd';
import { useLocation } from 'react-router-dom';
import { MenuOutlined, MoonOutlined, SunOutlined } from '@ant-design/icons';
import LeftMenu from '../sidebar/LeftMenu';
import RightMenu from '../sidebar/RightMenu';
import { ThemeContext } from '../../../context/ThemeContext';
import '../../../styles/navbar.less';

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { pathname } = useLocation();
  const { toggleTheme, getTheme } = useContext(ThemeContext);
  const theme = getTheme();

  const showDrawer = () => {
    setIsVisible(!isVisible);
  };

  useEffect(() => {
    setIsVisible(false);
  }, [pathname]);

  return (
    <>
      <nav className={`navbar navbar-${theme}`}>
        <Layout.Header className={`navbar-header navbar-header-${theme}`}>
          <div className={`logo logo-${theme}`}>
            <h3 className={`logo-name logo-name-${theme}`}>TMDB</h3>
          </div>
          <div className={`navbar-menu navbar-menu-${theme}`}>
            <div className={`leftMenu leftMenu-${theme}`}>
              <LeftMenu mode={'horizontal'} />
            </div>
            <div className={`rightMenu rightMenu-${theme}`}>
              <RightMenu mode={'horizontal'} />
            </div>

            <Drawer
              title="IMDB"
              placement="right"
              className={`sidebar-drawer sidebar-drawer-${theme}`}
              extra={[
                <Switch
                  className={`toggle-switch toggle-switch-${theme}`}
                  onChange={toggleTheme}
                  checked={theme === 'dark'}
                  checkedChildren={<SunOutlined />}
                  unCheckedChildren={<MoonOutlined />}
                />,
              ]}
              closable={true}
              onClose={showDrawer}
              open={isVisible}
            >
              <LeftMenu mode={'inline'} />
              <RightMenu mode={'inline'} />
            </Drawer>
          </div>
          <div className={`menuButton-wrapper menuButton-wrapper-${theme}`}>
            <Button
              className={`menuButton menuButton-${theme}`}
              type="text"
              onClick={showDrawer}
            >
              <MenuOutlined />
            </Button>
          </div>
        </Layout.Header>
      </nav>
    </>
  );
};

export default Navbar;
