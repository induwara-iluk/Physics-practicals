import mongoose, { Schema, Document } from 'mongoose';

export interface IPractical extends Document {
  title: string;
  slug: string;
  category: string;
  shortText: string;
  theory: string;
  apparatus: string[];
  method: string;
  importantPoints: string[];
  diagrams: string[];
  createdAt: Date;
  updatedAt: Date;
}

const PracticalSchema: Schema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, default: 'Uncategorized' },
  shortText: { type: String, default: 'A brief description of this practical experiment.' },
  theory: { type: String, default: '' },
  apparatus: [{ type: String }],
  method: { type: String, default: '' },
  importantPoints: [{ type: String }],
  diagrams: [{ type: String }], // URLs or paths to diagrams
}, { timestamps: true });

export default mongoose.models.Practical || mongoose.model<IPractical>('Practical', PracticalSchema);
