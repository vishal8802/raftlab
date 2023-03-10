import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../../database/models';
import { userSchema } from '../../validators';
import { cacheFlush } from '../../util';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = await userSchema.validateAsync(req.body);

    const userCount = await User.countDocuments({
      email: email.toLowerCase().trim(),
    });

    if (userCount) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user: IUser = new User({
      name,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    await user.save();
    cacheFlush();

    res.status(201).json({ message: 'User created successfully' });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || '',
      { expiresIn: '1h' },
    );

    res.json({ accessToken: `Bearer ${accessToken}` });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
