export default `
    type Game {
        _id: String!
        name: String!
        description: String!
        imageUrl: String!
        price: Float!
    }

    input GameInput {
        name: String!
        description: String!
        imageUrl: String!
        price: Float!
    }
    input GameEditInput {
        name: String
        description: String
        imageUrl: String
        price: Float
    }

    type Query {
        game(_id: String!): Game
        games: [Game]
    }

    type Mutation {
        addGame(game: GameInput!): Game
        deleteGame(_id: String!): Game
        editGame(_id: String!, game: GameEditInput!): Game
    }
`;
