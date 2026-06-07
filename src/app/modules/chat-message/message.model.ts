import { Schema, model } from 'mongoose';

const MessageSchema = new Schema(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    receiverId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    applicationId: {
      type: Schema.Types.ObjectId,
      ref: 'JobApplication',
      required: true,
    },

    message: String,

    attachment: String,

    attachmentType: {
      type: String,
      enum: ['image', 'pdf', 'doc'],
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Message = model('Message', MessageSchema);
