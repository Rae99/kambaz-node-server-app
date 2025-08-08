import { v4 as uuidv4 } from 'uuid';
import model from './model.js';

export const createUser = (user) => {}; // implemented later

export const findAllUsers = () => model.find();

export const findUserById = (userId) => model.findById(userId);

export const findUserByUsername = (username) =>
  model.findOne({ username: username });

export const findUserByCredentials = (username, password) =>
  model.findOne({ username, password });

// Since the key name and the variable name are the same, you can use the object property shorthand,

export const updateUser = (userId, user) =>
  model.updateOne({ _id: userId }, { $set: user });

//	user is a variable that holds an object containing the fields to update.
// const user = { username: "Alice", password: "1234" };

export const deleteUser = (userId) => model.deleteOne({ _id: userId });
