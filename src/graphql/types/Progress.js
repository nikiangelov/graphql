export default `
    type Progress {
        _id: String!
        user: User!
        game: Game!
        level: Int
        points: Int 
    }
    
    input ProgressInput {
        userId: String!
        gameId: String!
        level: Int
        points: Int
    }

    type Query {
        usersProgress: [Progress]
    }

    type Mutation { 
        saveProgress(progress: ProgressInput): Progress
    }
`;
