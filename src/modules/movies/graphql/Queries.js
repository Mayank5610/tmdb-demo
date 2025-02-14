// Movies Graphql Queries
import { gql } from '@apollo/client';

export const GET_LIST_MOVIES = gql`
  query GetListMovies($filter: ListMoviesFilter, $sort: ListMoviesSort) {
    listMovies(filter: $filter, sort: $sort) {
      data {
        id
        title
        overview
        releaseDate
        originalTitle
        originalLanguage
        releaseDate
      }
      count
    }
  }
`;

export const GET_MOVIE_DETAILS = gql`
  query GetMovie($id: ID!) {
    movie(id: $id) {
      data {
        id
        title
        overview
        adult
        imageUrl
        originalLanguage
        originalTitle
        budget
        revenue
        releaseDate
        runtime
        status
        tagline
      }
    }
  }
`;

export const GET_SIGNED_URL = gql`
  query GetSignedUrl($data: MoviesSignedPutUrlDataInput!) {
    getMoviesSignedPutUrl(data: $data) {
      signedUrl
      key
    }
  }
`;
