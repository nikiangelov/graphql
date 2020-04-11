export default `
    type User {
        _id: String!
        username: String!
        email: String!
        password: String!
        gameIds: [String] 
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
        addUser(user: UserInput!): User
        deleteUser(_id: String!): User
        editUser(_id: String!, user: UserInput! ): User
        addUserGame(_id: String!, gameId: String!): User
        removeUserGame(_id: String!, gameId: String!): User
    }
`;