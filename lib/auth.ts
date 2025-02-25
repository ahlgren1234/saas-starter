import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export async function verifyAuth() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return { isAuthenticated: false, user: null };
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token.value, secret);

    return {
      isAuthenticated: true,
      user: payload,
    };
  } catch {
    return { isAuthenticated: false, user: null };
  }
} 