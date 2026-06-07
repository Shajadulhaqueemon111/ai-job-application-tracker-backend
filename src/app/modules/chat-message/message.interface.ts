import { Types } from 'mongoose';

export interface IMessage {
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;

  applicationId: Types.ObjectId;

  message?: string;

  attachment?: string;

  attachmentType?: 'image' | 'pdf' | 'doc';

  isRead: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}
