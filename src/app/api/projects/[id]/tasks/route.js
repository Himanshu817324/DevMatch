import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectToDatabase from '../../../../../../lib/mongodb';
import Project from '../../../../../../models/Project';
import { authOptions } from '../../../../../../lib/auth';

// GET /api/projects/:id/tasks - Get all tasks for a project
export async function GET(request, { params }) {
  try {
    // Connect to database
    await connectToDatabase();

    // Get project ID from params
    const projectId = params.id;

    // Find project by ID
    const project = await Project.findById(projectId)
      .populate('tasks.assignedTo', 'name image')
      .populate('tasks.createdBy', 'name image');

    if (!project) {
      return NextResponse.json(
        { message: 'Project not found' },
        { status: 404 }
      );
    }

    // Return tasks
    return NextResponse.json({ tasks: project.tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { message: 'Error fetching tasks', error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/projects/:id/tasks - Create a new task for a project
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
    const { title, description, status, assignedTo } = data;

    // Validate required fields
    if (!title) {
      return NextResponse.json(
        { message: 'Task title is required' },
        { status: 400 }
      );
    }

    // Create new task
    const newTask = {
      title,
      description: description || '',
      status: status || 'todo',
      assignedTo: assignedTo || null,
      createdBy: session.user.id,
    };

    // Add task to project
    project.tasks.push(newTask);
    await project.save();

    // Get the newly created task (last one in the array)
    const createdTask = project.tasks[project.tasks.length - 1];

    // Populate user fields
    await project.populate('tasks.assignedTo', 'name image');
    await project.populate('tasks.createdBy', 'name image');

    // Return created task
    return NextResponse.json({
      message: 'Task created successfully',
      task: project.tasks.id(createdTask._id),
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { message: 'Error creating task', error: error.message },
      { status: 500 }
    );
  }
} 