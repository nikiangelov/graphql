import { mergeResolvers } from "merge-graphql-schemas";
import User from "./User";
import Game from "./Game";
import Progress from "./Progress";

const resolvers = [User, Game, Progress];

export default mergeResolvers(resolvers);
