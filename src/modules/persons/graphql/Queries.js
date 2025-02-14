// Persons Graphql Queries
import { gql } from '@apollo/client';

export const GET_LIST_PERSONS = gql`
  query ListPersons($filter: ListPersonsFilter!, $sort: ListPersonsSort!) {
    listPersons(filter: $filter, sort: $sort) {
      data {
        id
        name
        gender
        biography
        birthday
        adult
        placeOfBirth
        alsoKnownAs
      }
      count
    }
  }
`;

export const GET_PERSON = gql`
  query GetPerson($id: ID!) {
    person(id: $id) {
      data {
        id
        name
        gender
        biography
        birthday
        adult
        placeOfBirth
        alsoKnownAs
      }
    }
  }
`;
