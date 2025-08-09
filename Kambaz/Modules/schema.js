import mongoose from 'mongoose';
const schema = new mongoose.Schema(
  {
    _id: String,
    name: String,
    description: String,
    course: { type: String, ref: 'CourseModel' },
  },
  { collection: 'modules' }
);
export default schema;

// The ref property establishes that the primary key stored in course refers to a document stored in the courses collection, effectively implementing a one to many relation.
