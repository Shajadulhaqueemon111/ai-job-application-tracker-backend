/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { model, Schema } from 'mongoose';
import { IUser } from './user.interface';
import { Query } from 'mongoose';
import bycript from 'bcryptjs';
import config from '../../config';
export const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
    },
    status: {
      type: String,
      enum: ['active', 'block'],
      default: 'active',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

UserSchema.pre(/^find/, function (this: Query<any, any>, next: () => void) {
  this.where({ isDeleted: false });
  next();
});
UserSchema.pre('save', async function (next) {
  const user = this;
  user.password = await bycript.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});
UserSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

const UserModel = model<IUser>('User', UserSchema);

export default UserModel;
