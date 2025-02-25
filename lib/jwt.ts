import * as jose from 'jose';
import { IUser } from '@/models/User';
import { jwtVerify } from 'jose';
import { JWTPayload } from 'jose';

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
    avatar: user.avatar,
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

export async function verifyToken(token: string): Promise<JWTPayload> {
  try {
    const payload = await jwtVerify(token, secretKey);
    return payload.payload as JWTPayload;
  } catch (error) {
    console.error('Token verification failed:', error);
    throw error;
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