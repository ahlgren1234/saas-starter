import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { generateEmailVerificationToken } from '@/lib/jwt';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    console.log('Starting registration process...');
    
    await connectDB();
    const body = await request.json();
    console.log('Registration request for email:', body.email);
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      console.log('User already exists:', body.email);
      return NextResponse.json({ 
        message: 'User with this email already exists'
      }, { status: 400 });
    }

    // Generate verification token
    const verificationToken = await generateEmailVerificationToken();
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    console.log('Creating new user...');
    // Create user
    const user = await User.create({
      ...body,
      verificationToken,
      verificationTokenExpiry,
      isEmailVerified: false
    });
    console.log('User created successfully:', user._id);

    // Send verification email
    console.log('Attempting to send verification email...');
    try {
      const emailResult = await sendVerificationEmail(user.email, verificationToken);
      console.log('Verification email sent successfully:', emailResult);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't block registration if email fails, but let the user know
      return NextResponse.json({
        message: 'Registration successful, but we could not send the verification email. Please try requesting a new verification email later.',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          createdAt: user.createdAt
        },
        needsUpgrade: true,
        emailError: emailError instanceof Error ? emailError.message : 'Unknown email error'
      }, { status: 201 });
    }

    // Remove sensitive data before sending response
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt
    };

    console.log('Registration completed successfully');
    return NextResponse.json({
      message: 'Registration successful. Please check your email to verify your account.',
      user: userResponse,
      needsUpgrade: true
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ 
      message: 'Failed to register user',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 