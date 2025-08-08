import { v4 as uuidv4 } from 'uuid';
import model from './model.js';

export const findUsersByPartialName = (partialName) => {
  const regex = new RegExp(partialName, "i"); // 'i' makes it case-insensitive
  return model.find({
    $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }],
  });
};


export const findUsersByRole = (role) => model.find({ role: role }); // or just model.find({ role })

export const createUser = (user) => {
  const newUser = { ...user, _id: uuidv4() };
  return model.create(newUser);
};

export const findAllUsers = () => model.find();

export const findUserById = (userId) => model.findById(userId);

export const findUserByUsername = (username) =>
  model.findOne({ username: username });

export const findUserByCredentials = (username, password) =>
  model.findOne({ username, password });

// Since the key name and the variable name are the same, you can use the object property shorthand,

export const updateUser = (userId, user) =>
  model.findByIdAndUpdate(userId, { $set: user }, { new: true });

// Notice that updateOne() does not return the updated document.
// { new: true }  This option returns the updated document

//	user is a variable that holds an object containing the fields to update.
// const user = { username: "Alice", password: "1234" };

export const deleteUser = (userId) => model.deleteOne({ _id: userId });
