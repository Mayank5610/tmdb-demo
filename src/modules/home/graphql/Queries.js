// Home Graphql Queries
import { gql } from '@apollo/client';

export const TOP_RATED_MOVIES = gql`
  query Movies($filter: MoviesFilter!, $sort: ListMoviesSort!) {
    movies(filter: $filter, sort: $sort) {
      data {
        id
        title
        overview
        originalTitle
        originalLanguage
        releaseDate
        adult
      }
    }
  }
`;
