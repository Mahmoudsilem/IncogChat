import mongoose from "mongoose";

function connection() {
  try {
    mongoose.connect(process.env.URI);
    mongoose.syncIndexes();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB");
  }
}
connection();
export default connection;
