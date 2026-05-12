import mongoose, { Schema, Document } from 'mongoose';

export interface IAnswer extends Document {
  questionId: mongoose.Types.ObjectId;
  markingPoints: string[];
  fullAnswer: string;
  createdAt: Date;
  updatedAt: Date;
}

const AnswerSchema: Schema = new Schema({
  questionId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Question', 
    required: true 
  },
  markingPoints: [{ type: String }],
  fullAnswer: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Answer || mongoose.model<IAnswer>('Answer', AnswerSchema);
