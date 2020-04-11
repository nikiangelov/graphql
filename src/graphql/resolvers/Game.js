import Game from "../../models/Game";

export default {
  Query: {
    game: (root, args) => {
      return new Promise((resolver, reject) => {
        Game.findOne(args).exec((error, response) => {
          error ? reject(error) : resolver(response);
        });
      });
    },
    games: () => {
      return new Promise((resolver, reject) => {
        Game.find()
          .populate()
          .exec((error, response) => {
            error ? reject(error) : resolver(response);
          });
      });
    },
  },
  Mutation: {
    addGame: (root, { name, description, imageUrl, price }) => {
      const newGame = new Game({ name, description, imageUrl, price });
      return new Promise((resolver, reject) => {
        newGame.save((error, response) => {
          error ? reject(error) : resolver(response);
        });
      });
    },
    deleteGame: (root, { _id }) => {
      return new Promise((resolver, reject) => {
        Game.findByIdAndRemove({ _id }).exec((error, response) => {
          error ? reject(error) : resolver(response);
        });
      });
    },
    editGame: (root, { _id, name, description, imageUrl, price }) => {
      return new Promise((resolver, reject) => {
        Game.findByIdAndUpdate(
          { _id },
          { $set: { name, description, imageUrl, price } },
          { new: true }
        ).exec((error, response) => {
          error ? reject(error) : resolver(response);
        });
      });
    },
  },
};
