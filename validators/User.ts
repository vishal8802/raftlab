import Joi, { ObjectSchema } from 'joi';

export interface User {
  name: string;
  email: string;
  password: string;
}

export const userSchema: ObjectSchema<User> = Joi.object<User>({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(30).required(),
});

export const updateUserSchema: ObjectSchema<User> = Joi.object<User>({
  name: Joi.string().min(3).max(30),
  password: Joi.string().min(8).max(30),
});
