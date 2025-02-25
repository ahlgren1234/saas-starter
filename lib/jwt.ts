import * as jose from 'jose';
import { IUser } from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = '7d';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

// Convert secret to Uint8Array for jose
const secretKey = new TextEncoder().encode(JWT_SECRET);

export async function generateToken(user: IUser) {
  const token = await new jose.SignJWT({ 
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isEmailVerified: user.isEmailVerified,
    subscriptionStatus: user.subscriptionStatus,
    subscriptionPlan: user.subscriptionPlan,
    subscriptionCurrentPeriodEnd: user.subscriptionCurrentPeriodEnd
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(secretKey);
  
  return token;
}

export async function verifyToken(token: string) {
  try {
    console.log('Verifying token:', token.substring(0, 20) + '...');
    const { payload } = await jose.jwtVerify(token, secretKey);
    console.log('Token verified successfully:', payload);
    return payload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export async function generateEmailVerificationToken() {
  const token = await new jose.SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(secretKey);
  
  return token;
}

export async function generatePasswordResetToken() {
  const token = await new jose.SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1h')
    .sign(secretKey);
  
  return token;
} 