import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRouter from './src/routes/authRoutes.js';
import communityRouter from './src/routes/communityRoutes.js';
import memberRouter from './src/routes/memberRoutes.js';
import {roleRouter} from './src/routes/roleRoutes.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
const MONGO_URL=process.env.MONGO_URL


mongoose.connect(MONGO_URL, {
    
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});


app.use(express.json());

app.use('/v1/auth', authRouter);
app.use('/v1/community', communityRouter);
app.use('/v1/member', memberRouter);
app.use('/v1/role', roleRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
