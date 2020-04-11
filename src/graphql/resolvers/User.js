import User from "../../models/User";

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
    addUser: (root, { user }) => {
      const { username, email, password } = user;
      const newUser = new User({ username, email, password });
      return new Promise((resolve, reject) => {
        newUser.save((error, response) => {
          error ? reject(error) : resolve(response);
        });
      });
    },
    deleteUser: (root, { _id }) => {
      return new Promise((resolve, reject) => {
        User.findByIdAndRemove({ _id }).exec((error, response) => {
          error ? reject(error) : resolve(response);
        });
      });
    },
    editUser: (root, { _id, user }) => {
      return new Promise((resolve, reject) => {
        const { username, email, password } = user;
        let newSet = {};
        if (username) {
          newSet.username = username;
        }
        if (email) {
          newSet.email = email;
        }
        if (password) {
          newSet.password = password;
        }
        User.findByIdAndUpdate(
          { _id },
          { $set: newSet },
          { new: true, useFindAndModify: false }
        ).exec((error, response) => {
          error ? reject(error) : resolve(response);
        });
      });
    },
    addUserGame: (root, { _id, gameId }) => {
      return new Promise((resolve, reject) => {
        User.findById(_id, function (err, user) {
          if (err) {
            return reject(err);
          }
          user.gameIds = user.gameIds ? [...user.gameIds, gameId] : [gameId];
          user.save((error, response) => {
            error ? reject(error) : resolve(response);
          });
        });
      });
    },
  },
};
