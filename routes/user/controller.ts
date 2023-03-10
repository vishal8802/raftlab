import { User } from '../../database/models';
import bcrypt from 'bcrypt';
import { cacheFlush, cacheGet, cacheSet } from '../../util';
import { userSchema } from '../../validators';
import { Request, Response } from 'express';
import { updateUserSchema } from '../../validators/User';

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const sort = req.query.sort || 'createdAt';
    const key = `users?page=${page}&limit=${limit}&sort=${sort}`;
    const cachedResult = cacheGet(key);
    if (cachedResult) {
      console.log('Serving from cache...');
      return res.json(cachedResult);
    }

    const count = await User.countDocuments();
    const totalPages = Math.ceil(count / limit);

    const offset = limit * (page - 1);

    const users = await User.find()
      // .sort(sort)
      .skip(offset)
      .limit(limit)
      .select('-password');

    const result = {
      users,
      totalPages,
      currentPage: page,
      totalCount: count,
    };

    cacheSet(key, result);

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get a user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Update a user by ID
export const updateUserById = async (req: Request, res: Response) => {
  try {
    const { name, password } = await updateUserSchema.validateAsync(req.body);

    const updateObj: Record<string, any> = {};

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateObj.password = hashedPassword;
    }

    if (name) {
      updateObj.name = name;
    }
    console.log(req.params);
    const user = await User.findByIdAndUpdate(req.params.id, updateObj, {
      new: true,
    }).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    cacheFlush();

    res.json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a user by ID
export const deleteUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id).select(
      '-password',
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    cacheFlush();

    res.json({ message: `User: ${user.email} deleted` });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
