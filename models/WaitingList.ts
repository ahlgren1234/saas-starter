import mongoose from 'mongoose';

export interface IWaitingList {
  _id: string;
  name: string;
  email: string;
  createdAt: Date;
}

const waitingListSchema = new mongoose.Schema<IWaitingList>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      maxlength: [60, 'Name cannot be more than 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.WaitingList || mongoose.model<IWaitingList>('WaitingList', waitingListSchema); 