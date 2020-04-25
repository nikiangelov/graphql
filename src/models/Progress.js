import mongoose from "mongoose";
import User from "./User";
import Game from "./Game";

const Schema = mongoose.Schema;

const ProgressSchema = new Schema({
  user: {
    type: User.schema,
    required: true,
  },
  game: {
    type: Game.schema,
    required: true,
  },
  level: {
    type: Number,
  },
  points: {
    type: Number,
  },
});
ProgressSchema.index({ user: 1, game: 1 }, { unique: true });

const Progress = mongoose.model("Progress", ProgressSchema);
export default Progress;
