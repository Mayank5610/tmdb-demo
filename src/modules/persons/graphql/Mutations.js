// Persons Graphql Mutations
import { gql } from '@apollo/client';

export const CREATE_PERSON = gql`
  mutation CreatePerson($data: PersonInput!) {
    createPerson(data: $data) {
      message
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

export const UPDATE_PERSON = gql`
  mutation UpdatePerson($id: ID!, $data: UpdatePersonInput!) {
    updatePerson(id: $id, data: $data) {
      message
      data {
        id
        name
        gender
        birthday
      }
    }
  }
`;

export const DELETE_PERSON = gql`
  mutation DeletePerson($id: ID!) {
    deletePerson(id: $id) {
      message
    }
  }
`;
