import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion extends Document {
  practicalId: mongoose.Types.ObjectId;
  questionNumber: string;
  title: string;
  source: {
    type: string;
    exam: string;
    subject: string;
    year: number;
    paper: number;
    variant: string;
    questionNumber: number;
  };
  tags: string[];
  difficulty: string;
  mainQuestionText: string;
  figures: { label: string; imageUrl: string }[];
  subQuestions: {
    id: string;
    part: string;
    text: string;
    imageUrl?: string;
  }[];
  markingScheme: { subQuestionId: string; answer: string }[];
  answers: { subQuestionId: string; latex: string }[];
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema: Schema = new Schema({
  practicalId: { type: Schema.Types.ObjectId, ref: 'Practical', required: true },
  questionNumber: { type: String, required: true },
  title: { type: String, required: true },
  source: {
    type: { type: String, default: 'past_paper' },
    exam: { type: String, default: 'GCE Advanced Level' },
    subject: { type: String, default: 'Physics' },
    year: { type: Number },
    paper: { type: Number },
    variant: { type: String, default: 'English' },
    questionNumber: { type: Number }
  },
  tags: [{ type: String }],
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  mainQuestionText: { type: String, required: true },
  figures: [{
    label: { type: String },
    imageUrl: { type: String }
  }],
  subQuestions: [{
    id: { type: String },
    part: { type: String },
    text: { type: String },
    imageUrl: { type: String }
  }],
  markingScheme: [{
    subQuestionId: { type: String },
    answer: { type: String }
  }],
  answers: [{
    subQuestionId: { type: String },
    latex: { type: String }
  }]
}, { timestamps: true });

export default mongoose.models.Question || mongoose.model<IQuestion>('Question', QuestionSchema);
