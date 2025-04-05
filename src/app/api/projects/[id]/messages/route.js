import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectToDatabase from '../../../../../../lib/mongodb';
import Project from '../../../../../../models/Project';
import Message from '../../../../../../models/Message';
import { authOptions } from '../../../../../../lib/auth';

// GET /api/projects/:id/messages - Get project messages
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

    // Check if user is a member of the project
    const isMember = project.members.some(
      member => member.user.toString() === session.user.id
    );

    if (!isMember) {
      return NextResponse.json(
        { message: 'You are not a member of this project' },
        { status: 403 }
      );
    }

    // Get query parameters for pagination
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const before = searchParams.get('before'); // Message ID to get messages before

    // Build query
    const query = { projectId };
    if (before) {
      const beforeMessage = await Message.findById(before);
      if (beforeMessage) {
        query.createdAt = { $lt: beforeMessage.createdAt };
      }
    }

    // Fetch messages
    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('sender', 'name image')
      .lean();

    // Mark messages as read
    const unreadMessageIds = messages
      .filter(msg => !msg.readBy.includes(session.user.id))
      .map(msg => msg._id);

    if (unreadMessageIds.length > 0) {
      await Message.updateMany(
        { _id: { $in: unreadMessageIds } },
        { $addToSet: { readBy: session.user.id } }
      );
    }

    // Return messages in chronological order
    return NextResponse.json({
      messages: messages.reverse(), // Reverse to get chronological order
      hasMore: messages.length === limit,
    });
  } catch (error) {
    console.error('Error fetching project messages:', error);
    return NextResponse.json(
      { message: 'Error fetching project messages', error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/projects/:id/messages - Send a new message
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

    // Check if user is a member of the project
    const isMember = project.members.some(
      member => member.user.toString() === session.user.id
    );

    if (!isMember) {
      return NextResponse.json(
        { message: 'You are not a member of this project' },
        { status: 403 }
      );
    }

    // Get data from request body
    const data = await request.json();
    const { content } = data;

    // Validate content
    if (!content || content.trim() === '') {
      return NextResponse.json(
        { message: 'Message content is required' },
        { status: 400 }
      );
    }

    // Create new message
    const message = await Message.create({
      sender: session.user.id,
      content,
      projectId,
      readBy: [session.user.id], // Mark as read by sender
    });

    // Populate sender
    await message.populate('sender', 'name image');

    // Return created message
    return NextResponse.json({
      message: 'Message sent successfully',
      data: message
    }, { status: 201 });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { message: 'Error sending message', error: error.message },
      { status: 500 }
    );
  }
} 