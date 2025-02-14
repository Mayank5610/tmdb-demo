import { Button, Card, Typography } from 'antd';
import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../common/constants';
import { ThemeContext } from '../../context/ThemeContext';
import '../../styles/pages/movieCard.less';

const { Text } = Typography;

const MovieCard = ({ movie, onDelete }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getTheme } = useContext(ThemeContext);
  const theme = getTheme();

  const handleCardClick = (movieId) => {
    navigate(`${ROUTES?.MOVIE_CARD}/${movieId}`);
  };

  return (
    <>
      <Card
        className={`movie-card movie-card-${theme}`}
        hoverable
        cover={
          <img
            className="image"
            alt={movie?.title}
            src={movie?.originalTitle}
          />
        }
        actions={
          location?.pathname === ROUTES?.MOVIE_CARD && [
            <Button
              shape="round"
              className={`delete-button delete-button-${theme}`}
              type="primary"
              danger
              onClick={(e) => {
                e?.stopPropagation();
                onDelete();
              }}
            >
              Delete
            </Button>,
          ]
        }
        onClick={() => handleCardClick(movie?.id)}
      >
        <Card.Meta
          title="Movie Name"
          className={`card-item card-item-${theme}`}
          description={<Text ellipsis>{movie?.title}</Text>}
        />
        <Card.Meta
          title="Overview"
          className={`card-item card-item-${theme}`}
          description={<Text ellipsis>{movie?.overview}</Text>}
        />
        <Card.Meta
          title="Languages"
          className={`card-item card-item-${theme}`}
          description={<Text ellipsis>{movie?.originalLanguage}</Text>}
        />
        <Card.Meta
          title="Release Date"
          className={`card-item card-item-${theme}`}
          description={<Text ellipsis>{movie?.releaseDate}</Text>}
        />
      </Card>
    </>
  );
};

export default MovieCard;
