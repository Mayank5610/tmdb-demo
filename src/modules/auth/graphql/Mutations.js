// Login Graphql Mutation
import { gql } from '@apollo/client';

export const LOGIN_EMAIL_PASSWORD = gql`
  mutation LOGIN($data: EmailPasswordLogInData!) {
    emailPasswordLogIn(data: $data) {
      message
      data {
        token
      }
    }
  }
`;
