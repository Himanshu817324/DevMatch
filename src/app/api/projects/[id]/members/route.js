import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectToDatabase from '../../../../../../lib/mongodb';
import Project from '../../../../../../models/Project';
import User from '../../../../../../models/User';
import { authOptions } from '../../../../../../lib/auth';

// GET /api/projects/:id/members - Get all members of a project
export async function GET(request, { params }) {
  try {
    // Connect to database
    await connectToDatabase();

    // Get project ID from params
    const projectId = params.id;

    // Find project by ID
    const project = await Project.findById(projectId)
      .populate('members.user', 'name email image title skills');

    if (!project) {
      return NextResponse.json(
        { message: 'Project not found' },
        { status: 404 }
      );
    }

    // Return members
    return NextResponse.json({ members: project.members });
  } catch (error) {
    console.error('Error fetching project members:', error);
    return NextResponse.json(
      { message: 'Error fetching project members', error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/projects/:id/members - Add a new member to a project
export async function POST(request, { params }) {
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

    // Get project ID from params
    const projectId = params.id;

    // Find project by ID
    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json(
        { message: 'Project not found' },
        { status: 404 }
      );
    }

    // Check if user is authorized to add members
    const isOwner = project.owner.toString() === session.user.id;
    const isAdmin = project.members.some(
      member => member.user.toString() === session.user.id && member.role === 'admin'
    );

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { message: 'Not authorized to add members to this project' },
        { status: 403 }
      );
    }

    // Get data from request body
    const data = await request.json();
    const { userId, role } = data;

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user is already a member
    const isAlreadyMember = project.members.some(
      member => member.user.toString() === userId
    );

    if (isAlreadyMember) {
      return NextResponse.json(
        { message: 'User is already a member of this project' },
        { status: 400 }
      );
    }

    // Add user to project members
    project.members.push({
      user: userId,
      role: role || 'member',
      joinedAt: new Date(),
    });

    await project.save();

    // Populate user fields
    await project.populate('members.user', 'name email image title skills');

    // Get the newly added member (last one in the array)
    const newMember = project.members[project.members.length - 1];

    // Return created member
    return NextResponse.json({
      message: 'Member added successfully',
      member: newMember,
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding project member:', error);
    return NextResponse.json(
      { message: 'Error adding project member', error: error.message },
      { status: 500 }
    );
  }
} 