// db/dbconnect.js
const mongoose = require('mongoose');

const mongoDB = 'mongodb://localhost:27017/Portfolio'; 

const connectDB = async () => {
  try {
    await mongoose.connect(mongoDB);
    console.log('Database Connected..');
  } catch (error) {
    console.error('Connection error:', error);
  }
};

module.exports = connectDB;
