// src/models/User.model.ts
import mongoose, { HydratedDocument } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  avatar?: string;
  lastLogin?: Date;
  cart: Array<{
    product: mongoose.Types.ObjectId;
    size: number;
    quantity: number;
  }>;
}

export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

type UserDocument = HydratedDocument<IUser, IUserMethods>;

const userSchema = new mongoose.Schema<IUser, unknown, IUserMethods>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    avatar: String,
    lastLogin: Date,
    cart: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        size: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1, default: 1 },
      }
    ],
  },
  { timestamps: true }
);

// Hash password
userSchema.pre<UserDocument>('save', async function () {
  if (!this.isModified('password')) return;
  const saltRounds = 12;
  this.password = await bcrypt.hash(this.password, saltRounds);
});

// Compare password
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<
  IUser,
  mongoose.Model<IUser, unknown, IUserMethods>
>('User', userSchema);