import mongoose from 'mongoose';
import type { Document } from 'mongoose';

interface AdminUser extends Document {
  role: string;
  subscriptionStatus: string | null;
  subscriptionPlan: string | null;
  subscriptionCurrentPeriodEnd: Date | null;
  save(): Promise<AdminUser>;
}

export async function setupAdminSubscription(user: AdminUser) {
  if (user.role === 'admin') {
    // Set admin users to have pro subscription by default
    user.subscriptionStatus = 'active';
    user.subscriptionPlan = 'pro';
    // Set subscription end date to far future for admins
    user.subscriptionCurrentPeriodEnd = new Date(Date.now() + 1000 * 365 * 24 * 60 * 60 * 1000); // 1000 years
    await user.save();
    
    return true;
  }
  return false;
} 