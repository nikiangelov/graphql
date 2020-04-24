export default `
    """
    A type that describes the user.
    """
    type User {
        _id: String!
        username: String!
        email: String!
        password: String!
        games: [Game] 
    }

    input UserInput {
        username: String
        email: String
        password: String
    }

    type Query {
        user(_id: String!): User
        users: [User]
    }

    type Mutation { 
        registerUser(user: UserInput!): User
        loginUser(username: String!, password: String!): String
        deleteUser(_id: String!): User
        editUser(_id: String!, user: UserInput! ): User
        addUserGame(_id: String!, gameId: String!): User
        removeUserGame(_id: String!, gameId: String!): User
    }
`;
