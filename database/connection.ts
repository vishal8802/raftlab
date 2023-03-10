import mongoose from 'mongoose';

const MONGO_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@test.ykqky.mongodb.net/playground?retryWrites=true&w=majority`;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error: any) {
    console.error(error.message);
    process.exit(1);
  }
};

export default connectDB;
