import User from "../../models/User";
import Game from "../../models/Game";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default {
  Query: {
    user: (root, args) => {
      return new Promise((resolve, reject) => {
        User.findOne(args).exec((error, response) => {
          error ? reject(error) : resolve(response);
        });
      });
    },
    users: () => {
      return new Promise((resolve, reject) => {
        User.find()
          .populate()
          .exec((error, response) => {
            error ? reject(error) : resolve(response);
          });
      });
    },
  },
  Mutation: {
    registerUser: async (root, { user }) => {
      const { username, email, password } = user;
      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = new User({ username, email, password: hashedPassword });
      const response = await newUser.save();
      if (!response) {
        throw new Error(
          `Не можем да регистрираме потребител с email:  ${email}`
        );
      }
      return response;
    },
    loginUser: async (root, { username, password }, { SECRET }) => {
      const user = await User.findOne({
        username,
      });
      if (!user) {
        throw new Error(`Този потребител не съществува.`);
      }
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        throw new Error(`Грешна парола.`);
      }
      const token = jwt.sign(
        {
          username: user.username,
          email: user.email,
        },
        SECRET,
        {
          expiresIn: "3min",
        }
      );

      return token;
    },
    deleteUser: (root, { _id }) => {
      return new Promise((resolve, reject) => {
        User.findByIdAndRemove({ _id }).exec((error, response) => {
          error ? reject(error) : resolve(response);
        });
      });
    },
    editUser: async (root, { _id, user }) => {
      const { username, email, password } = user;
      let newSet = {};
      if (username) {
        newSet.username = username;
      }
      if (email) {
        newSet.email = email;
      }
      if (password) {
        newSet.password = await bcrypt.hash(password, 12);
      }
      const response = await User.findByIdAndUpdate(
        { _id },
        { $set: newSet },
        { new: true }
      ).exec();
      if (!response) {
        throw new Error(`Проблем при редакцията`);
      }
      return response;
    },
    addUserGame: async (root, { _id, gameId }) => {
      const game = await Game.findById(gameId);
      if (!game) {
        throw new Error(`Не е намерена игра с id: ${gameId}`);
      }
      const response = await User.findByIdAndUpdate(
        { _id },
        { $addToSet: { games: game } },
        { new: true }
      ).exec();
      if (!response) {
        throw new Error("Възникна проблем");
      }
      return response;
    },
    removeUserGame: async (root, { _id, gameId }) => {
      const response = await User.findByIdAndUpdate(
        { _id },
        { $pull: { games: { _id: gameId } } },
        { new: true, safe: true, multi: true }
      ).exec();
      if (!response) {
        throw new Error("Възникна проблем");
      }
      return response;
    },
  },
};
