import { mergeTypes } from "merge-graphql-schemas";
import User from "./User";
import Game from "./Game";
import Progress from "./Progress";

const typeDefs = [User, Game, Progress];

export default mergeTypes(typeDefs, { all: true });
