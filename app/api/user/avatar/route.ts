import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { verifyAuth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    // Verify authentication
    const auth = await verifyAuth();
    if (!auth?.isAuthenticated || !auth?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('avatar') as File;
    
    if (!file) {
      return NextResponse.json(
        { message: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { message: 'File must be an image' },
        { status: 400 }
      );
    }

    // Create unique filename
    const bytes = new Uint8Array(8);
    crypto.getRandomValues(bytes);
    const uniqueId = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    const fileName = `${uniqueId}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
    
    // Ensure public/avatars directory exists
    const publicDir = join(process.cwd(), 'public');
    const avatarsDir = join(publicDir, 'avatars');
    
    try {
      await writeFile(join(avatarsDir, fileName), Buffer.from(await file.arrayBuffer()));
    } catch (error) {
      console.error('Error saving file:', error);
      return NextResponse.json(
        { message: 'Error saving file' },
        { status: 500 }
      );
    }

    // Update user's avatar in database
    await connectDB();
    const avatarPath = `/avatars/${fileName}`;
    await User.findByIdAndUpdate(auth.user.id, { avatar: avatarPath });

    return NextResponse.json({ 
      message: 'Avatar updated successfully',
      avatar: avatarPath
    });
  } catch (error) {
    console.error('Avatar upload error:', error);
    return NextResponse.json(
      { message: 'Failed to update avatar' },
      { status: 500 }
    );
  }
} 