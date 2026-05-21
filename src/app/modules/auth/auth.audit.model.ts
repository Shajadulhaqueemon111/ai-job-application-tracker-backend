import { Schema, model } from 'mongoose';

export interface IAuditLog {
  userId?: string;
  email?: string;
  action: string;
  ip?: string | string[] | null;
  browser?: string;
  device?: string;
  os?: string;
  location?: string;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    userId: { type: String },
    action: { type: String, required: true },
    email: { type: String },
    ip: { type: String },
    browser: { type: String },
    device: { type: String },
    os: { type: String },
    location: { type: String },
  },
  {
    timestamps: true,
  },
);

const AuditLogModel = model<IAuditLog>('AuditLog', auditLogSchema);

export default AuditLogModel;
