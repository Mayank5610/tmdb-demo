// Movies Graphql Mutations
import { gql } from '@apollo/client';

export const CREATE_MOVIE = gql`
  mutation CreateMovie($data: MovieInput) {
    createMovie(data: $data) {
      message
      data {
        movie {
          id
          title
          overview
          adult
          releaseDate
          originalTitle
          imageUrl
          originalLanguage
        }
      }
    }
  }
`;

export const UPDATE_MOVIE = gql`
  mutation UpdateMovie($id: ID!, $data: UpdateMovieInput) {
    updateMovie(id: $id, data: $data) {
      message
      data {
        movie {
          id
          title
          overview
          adult
          originalTitle
          imageUrl
          originalLanguage
          budget
          revenue
          releaseDate
          runtime
          status
          tagline
        }
      }
    }
  }
`;

export const DELETE_MOVIE = gql`
  mutation DeleteMovie($id: ID!) {
    deleteMovie(id: $id) {
      message
    }
  }
`;
