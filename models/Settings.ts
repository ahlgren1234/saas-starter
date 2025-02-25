import mongoose from 'mongoose';

export interface ISettings {
  _id: string;
  isWaitingListMode: boolean;
  updatedAt: Date;
}

const settingsSchema = new mongoose.Schema<ISettings>(
  {
    isWaitingListMode: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Settings || mongoose.model<ISettings>('Settings', settingsSchema); 