
const mongoose = require('mongoose');
const { PrismaClient } = require('../../generated/prisma');


const prisma = new PrismaClient();


const connectMongo = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};


const testPrismaConnection = async () => {
  try {
    await prisma.$connect();
    console.log('PostgreSQL Connected via Prisma');
  } catch (error) {
    console.error(`Error connecting to PostgreSQL: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { 
  connectMongo, 
  testPrismaConnection,
  prisma 
};