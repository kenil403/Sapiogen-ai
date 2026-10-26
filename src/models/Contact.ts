import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const contactSchema = new Schema(
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
    company: { type: String, trim: true, maxlength: 160, default: '' },
    interest: {
      type: String,
      enum: [
        '', 'product', 'strategy', 'systems', 'automation',
        'voice', 'integration', 'infrastructure', 'data', 'other'
      ],
      default: ''
    },
    budget: {
      type: String,
      enum: ['', 'under-25k', '25-75k', '75-200k', '200k-plus'],
      default: ''
    },
    message: { type: String, required: true, trim: true, minlength: 10, maxlength: 4000 },
    source: { type: String, default: 'website' },
    ip: { type: String, default: '' },
    userAgent: { type: String, default: '' },
    status: {
      type: String,
      enum: ['new', 'contacted', 'qualified', 'closed'],
      default: 'new',
      index: true
    }
  },
  { timestamps: true }
);

contactSchema.index({ createdAt: -1 });
contactSchema.index({ email: 1, createdAt: -1 });

export type ContactDoc = InferSchemaType<typeof contactSchema>;
export default (mongoose.models.Contact as mongoose.Model<ContactDoc>) ||
  mongoose.model<ContactDoc>('Contact', contactSchema);
