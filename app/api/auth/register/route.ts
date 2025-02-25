import User from '@/models/User';
import { generateEmailVerificationToken } from '@/lib/jwt';
import { sendVerificationEmail } from '@/lib/email';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    // Check if user already exists
    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      return new Response(
        JSON.stringify({ message: 'User already exists' }),
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt);

    // Create new user
    const verificationToken = await generateEmailVerificationToken();
    const user = await User.create({
      email: body.email,
      password: hashedPassword,
      verificationToken,
    });

    // Send verification email
    try {
      await sendVerificationEmail(body.email, verificationToken);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Continue with registration even if email fails
    }

    return new Response(
      JSON.stringify({
        message: 'Registration successful',
        userId: user._id,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return new Response(
      JSON.stringify({ message: 'Registration failed' }),
      { status: 500 }
    );
  }
} 