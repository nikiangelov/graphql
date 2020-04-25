export default `
    type User {
        _id: String!
        firstName: String!
        lastName: String!
        email: String!
        password: String!
        userType: String!
        games: [Game] 
    }

    input UserInput {
        firstName: String!
        lastName: String!
        email: String!
        password: String!
    }
    input UserEditInput {
        firstName: String
        lastName: String
        password: String
        userType: String
    }

    type Query {
        user(_id: String!): User
        users: [User]
        currentUser: User
    }

    type Mutation { 
        registerUser(user: UserInput!): String
        loginUser(email: String!, password: String!): String
        deleteUser(_id: String!): User
        editUser(_id: String!, user: UserEditInput! ): User
        addUserGame(_id: String!, gameId: String!): User
        removeUserGame(_id: String!, gameId: String!): User
    }
`;
