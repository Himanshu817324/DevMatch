import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectToDatabase from '../../../../../lib/mongodb';
import User from '../../../../../models/User';
import { authOptions } from '../../../../../lib/auth';

// GET /api/users/:id - Get user profile
export async function GET(request, { params }) {
  try {
    // Get current session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Get user ID from params
    const userId = params.id;

    // Find user by ID
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Return user data
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { message: 'Error fetching user', error: error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/users/:id - Update user profile
export async function PATCH(request, { params }) {
  try {
    // Get current session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Make sure user is updating their own profile
    if (session.user.id !== params.id) {
      return NextResponse.json(
        { message: 'Not authorized to update this profile' },
        { status: 403 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Get user ID from params
    const userId = params.id;

    // Get data from request body
    const data = await request.json();
    const { name, bio, title, skills, links } = data;

    // Validate data
    const updates = {};
    if (name) updates.name = name;
    if (bio !== undefined) updates.bio = bio;
    if (title !== undefined) updates.title = title;
    if (skills) updates.skills = skills;
    if (links) updates.links = links;

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Return updated user data
    return NextResponse.json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { message: 'Error updating user', error: error.message },
      { status: 500 }
    );
  }
} 