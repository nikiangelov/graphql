import User from "../../models/User";
import Game from "../../models/Game";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import ValidationError from "../ValidationError";

const JWT_EXPIRATION = "5min";

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
    currentUser: async (root, args, { authenticatedUser }) => {
      if (!authenticatedUser) {
        throw new ValidationError([
          {
            key: "user",
            message: "user_not_authenticated",
          },
        ]);
      }
      return await User.findById(authenticatedUser._id);
    },
  },
  Mutation: {
    registerUser: async (root, { user }, { JWT_SECRET }) => {
      const { firstName, lastName, email, password } = user;
      let errors = [];
      if (validator.isEmpty(firstName)) {
        errors.push({
          key: "firstName",
          message: "is_empty",
        });
      }
      if (validator.isEmpty(lastName)) {
        errors.push({
          key: "lastName",
          message: "is_empty",
        });
      }
      if (!validator.isEmail(email)) {
        errors.push({
          key: "email",
          message: "email_not_valid",
        });
      }
      if (!validator.isLength(password, { min: 6, max: 20 })) {
        errors.push({
          key: "password",
          message: "password_length",
        });
      }
      if (errors.length) {
        throw new ValidationError(errors);
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        userType: "regular",
      });
      let loginToken = null;
      try {
        const savedUser = await newUser.save();
        if (!savedUser) {
          throw new Error(
            `Не можем да регистрираме потребител с email:  ${email}`
          );
        }
        loginToken = jwt.sign(
          {
            _id: savedUser._id,
            email: savedUser.email,
          },
          JWT_SECRET,
          {
            expiresIn: JWT_EXPIRATION,
          }
        );
      } catch (error) {
        console.log(`Възникна проблем: ${error}`);
      }
      return loginToken;
    },
    loginUser: async (root, { email, password }, { JWT_SECRET }) => {
      const user = await User.findOne({
        email,
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
          _id: user._id,
          email: user.email,
        },
        JWT_SECRET,
        {
          expiresIn: JWT_EXPIRATION,
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
    editUser: async (root, { _id, user }, { authenticatedUser }) => {
      if (!authenticatedUser) {
        throw new Error("Не сте влезли в профила си");
      }
      const { firstName, lastName, password, userType } = user;
      let newSet = {};
      if (firstName) {
        newSet.firstName = firstName;
      }
      if (lastName) {
        newSet.lastName = lastName;
      }
      if (password) {
        newSet.password = await bcrypt.hash(password, 12);
      }
      if (userType) {
        newSet.userType = userType;
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
