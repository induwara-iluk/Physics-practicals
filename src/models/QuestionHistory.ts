import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestionHistory extends Document {
  year: number;
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionHistorySchema: Schema = new Schema({
  year: { type: Number, required: true, unique: true },
  q1: { type: String, default: '' },
  q2: { type: String, default: '' },
  q3: { type: String, default: '' },
  q4: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.models.QuestionHistory || mongoose.model<IQuestionHistory>('QuestionHistory', QuestionHistorySchema);
