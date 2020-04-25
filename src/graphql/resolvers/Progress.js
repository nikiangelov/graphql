import Progress from "../../models/Progress";
import Game from "../../models/Game";
import User from "../../models/User";

export default {
  Query: {
    usersProgress: async () => {
      const response = await Progress.find().populate().exec();
      if (!response) {
        throw new Error("Възникна проблем, опитайте по-късно");
      }
      return response;
    },
  },
  Mutation: {
    saveProgress: async (root, { progress }) => {
      const { userId, gameId, level, points } = progress;
      const game = await Game.findById(gameId);
      if (!game) {
        throw new Error(`Не е намерена игра с id: ${gameId}`);
      }
      const user = await User.findById(userId);
      if (!user) {
        throw new Error(`Не е намерен потребител с id: ${userId}`);
      }
      let update = { user, game, level: level || 0, points: points || 0 },
        options = { upsert: true, new: true, setDefaultsOnInsert: true };

      const response = await Progress.findOneAndUpdate(
        {
          "user._id": user._id,
          "game._id": game._id,
        },
        update,
        options
      );
      if (!response) {
        throw new Error("Неуспешно запазен прогрес");
      }
      return response;
    },
  },
};
