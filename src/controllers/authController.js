
import { User } from '../models/models.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const signUp = async (req, res) => {
  const jwtSecret = process.env.JWT_SECRET;
  try {
    const { name, email, password } = req.body;
    

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        status: false,
        content: {
          message: 'User with this email already exists',
        },
      });
    }

    if (name.split(' ').length < 2) {
      return res.status(400).json({
        status: false,
        content: {
          message: 'Name should contain at least two words',
        },
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        status: false,
        content: {
          message: 'Password should be at least 6 characters long',
        },
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ userId: user._id }, jwtSecret)

    return res.status(200).json({
      status: true,
      content: {
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          created_at: user.created_at,
        },
        meta: {
          access_token: token,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      content: {
        message: 'Server error',
      },
    });
  }
};

export const signIn = async (req, res) => {
  const jwtSecret = process.env.JWT_SECRET;
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        status: false,
        content: {
          message: 'Invalid credentials',
        },
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: false,
        content: {
          message: 'Invalid credentials',
        },
      });
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret)

    return res.status(200).json({
      status: true,
      content: {
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          created_at: user.created_at,
        },
        meta: {
          access_token: token,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      content: {
        message: error.message,
      },
    });
  }
};

export const getMe = async (req, res) => {
  const jwtSecret = process.env.JWT_SECRET;
  try {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
      return res.status(401).json({ status: false, message: 'Access denied. Invalid or missing token' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ status: false, message: 'Invalid token format' });
    }

    try {
      const decoded = jwt.verify(token, jwtSecret);

      const userId = decoded.userId;

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ status: false, message: 'User not found' });
      }

      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
      };

      res.status(200).json({ status: true, content: { data: userData } });
    } catch (error) {
      res.status(401).json({ status: false, message: 'Invalid or expired token' });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: 'Server error' });
  }
};

