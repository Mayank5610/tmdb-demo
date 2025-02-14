import React, { useContext } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Layout, notification } from 'antd';
import Navbar from './app/components/header/Navbar';
import { ROUTES, TOKEN } from './common/constants';
import Home from './modules/home/Home';
import Login from './modules/auth/Login';
import Movies from './modules/movies/Movies';
import MovieDetail from './modules/movies/MovieDetail';
import MovieForm from './modules/movies/MovieForm';
import Persons from './modules/persons/Persons';
import PersonForm from './modules/persons/PersonForm';
import PageNotFound from './modules/pageNotFound/PageNotFound';
import { ThemeContext } from './context/ThemeContext';
import './styles/app.less';

const { Content } = Layout;

const RequireAuth = ({ children }) => {
  const { getTheme } = useContext(ThemeContext);
  const theme = getTheme();
  const authToken = localStorage?.getItem(TOKEN);

  if (!authToken) {
    notification.info({
      message: 'Please Login!',
      description: 'Login Required.',
      className: `notification-info notification-info-${theme}`,
    });

    return <Navigate to={ROUTES?.LOGIN} replace />;
  }

  return children;
};

const App = () => {
  const { getTheme } = useContext(ThemeContext);
  const location = useLocation();

  const theme = getTheme();

  return (
    <>
      {location?.pathname !== ROUTES?.LOGIN && (
        <Layout className={`background-navbar background-navbar-${theme}`}>
          <Navbar />
        </Layout>
      )}
      <Layout className={`background background-${theme}`}>
        <div id="breadcrumbs-portal" className={`portal portal-${theme}`}></div>
        <Content className="content">
          <Routes>
            <Route exact path={ROUTES?.LOGIN} element={<Login />} />
            <Route exact path={ROUTES?.HOME} element={<Home />} />
            <Route
              exact
              path={ROUTES?.MOVIE_CARD}
              element={
                <RequireAuth>
                  <Movies />
                </RequireAuth>
              }
            />
            <Route
              exact
              path={`${ROUTES?.MOVIE_CARD}/:movieId`}
              Component={MovieDetail}
            />
            <Route exact path={ROUTES?.MOVIE_CREATE} Component={MovieForm} />
            <Route
              exact
              path={`${ROUTES?.MOVIE_CARD}/:movieId/edit`}
              Component={MovieForm}
            />
            <Route exact path={ROUTES?.PERSON_LIST} Component={Persons} />
            <Route exact path={ROUTES?.PERSON_CREATE} Component={PersonForm} />
            <Route
              exact
              path={`${ROUTES?.PERSON_LIST}/:personId/edit`}
              Component={PersonForm}
            />
            <Route path="*" Component={PageNotFound} />
          </Routes>
        </Content>
      </Layout>
    </>
  );
};

export default App;
