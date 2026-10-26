import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const applicationSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 160,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    phone: { type: String, trim: true, maxlength: 40, default: '' },
    role: { type: String, required: true, trim: true, maxlength: 80 },
    portfolio: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
      validate: {
        validator: (v: string) => !v || /^https?:\/\/[^\s]+$/i.test(v),
        message: 'Portfolio must be a valid URL'
      }
    },
    linkedin: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
      validate: {
        validator: (v: string) => !v || /^https?:\/\/[^\s]+$/i.test(v),
        message: 'LinkedIn must be a valid URL'
      }
    },
    experience: { type: Number, min: 0, max: 60, default: 0 },
    message: { type: String, required: true, trim: true, minlength: 10, maxlength: 4000 },
    ip: { type: String, default: '' },
    userAgent: { type: String, default: '' },
    status: {
      type: String,
      enum: ['new', 'reviewing', 'interviewing', 'offer', 'rejected', 'hired'],
      default: 'new',
      index: true
    }
  },
  { timestamps: true }
);

applicationSchema.index({ createdAt: -1 });
applicationSchema.index({ email: 1, role: 1, createdAt: -1 });

export type ApplicationDoc = InferSchemaType<typeof applicationSchema>;
export default (mongoose.models.Application as mongoose.Model<ApplicationDoc>) ||
  mongoose.model<ApplicationDoc>('Application', applicationSchema);
