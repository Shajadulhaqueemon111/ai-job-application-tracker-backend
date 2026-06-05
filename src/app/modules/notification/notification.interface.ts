export type NotificationType =
  | 'NEW_JOB'
  | 'INTERVIEW'
  | 'APPLICATION_UPDATE'
  | 'SHORTLISTED'
  | 'REJECTED'
  | 'AI_SUGGESTION'
  | 'SYSTEM';

export interface INotification {
  _id?: string;
  userId?: string | null; // null = global notification
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}
