export type NotificationType =
  | 'NEW_JOB'
  | 'INTERVIEW'
  | 'APPLICATION_UPDATE'
  | 'SHORTLISTED'
  | 'APPLICATION_STATUS_UPDATED'
  | 'INTERVIEWED'
  | 'AI_SUGGESTION'
  | 'OFFERED'
  | 'HIRED'
  | 'REJECTED'
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
