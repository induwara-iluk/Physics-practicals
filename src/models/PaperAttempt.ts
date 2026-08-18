import mongoose, { Schema, Document } from 'mongoose';

export interface IPaperAttempt extends Document {
  userId: string;       // Supabase user ID
  paperId: string;      // e.g. "past-2024-English" or "model-2023-Sinhala"
  paperType: 'past' | 'model';
  year: number;
  medium: 'English' | 'Sinhala';
  score: number;
  maxScore: number;
  answers: any;         // Map of question ID to answers
  createdAt: Date;
  updatedAt: Date;
}

const PaperAttemptSchema: Schema = new Schema({
  userId: { type: String, required: true },
  paperId: { type: String, required: true },
  paperType: { type: String, enum: ['past', 'model'], required: true },
  year: { type: Number, required: true },
  medium: { type: String, enum: ['English', 'Sinhala'], required: true },
  score: { type: Number, required: true },
  maxScore: { type: Number, required: true },
  answers: { type: Schema.Types.Mixed },
}, { timestamps: true });

// Index for fast lookups by user and paper
PaperAttemptSchema.index({ userId: 1, paperId: 1 });
PaperAttemptSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.PaperAttempt || mongoose.model<IPaperAttempt>('PaperAttempt', PaperAttemptSchema);
