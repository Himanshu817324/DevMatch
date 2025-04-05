import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { v2 as cloudinary } from 'cloudinary';
import connectToDatabase from '../../../../lib/mongodb';
import User from '../../../../models/User';
import { authOptions } from '../../../../lib/auth';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse the form data
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { message: 'No image file provided' },
        { status: 400 }
      );
    }

    // Convert file to buffer for cloudinary upload
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileBase64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        fileBase64,
        {
          folder: 'devmatch/profile',
          public_id: `user_${session.user.id}`,
          overwrite: true,
          transformation: [
            { width: 400, height: 400, crop: 'fill', gravity: 'face' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
    });

    // Connect to database
    await connectToDatabase();

    // Update user profile with new image URL
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { image: result.secure_url },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Return the updated user
    return NextResponse.json({
      message: 'Profile image updated successfully',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        image: updatedUser.image
      }
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { message: 'Error uploading image', error: error.message },
      { status: 500 }
    );
  }
} 