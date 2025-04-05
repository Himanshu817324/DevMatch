import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectToDatabase from '../../../../../../../lib/mongodb';
import Project from '../../../../../../../models/Project';
import { authOptions } from '../../../../../../../lib/auth';

// GET /api/projects/:id/tasks/:taskId - Get a specific task
export async function GET(request, { params }) {
  try {
    // Connect to database
    await connectToDatabase();

    // Get project ID and task ID from params
    const { id: projectId, taskId } = params;

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

    // Find task by ID
    const task = project.tasks.id(taskId);
    if (!task) {
      return NextResponse.json(
        { message: 'Task not found' },
        { status: 404 }
      );
    }

    // Return task data
    return NextResponse.json({ task });
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json(
      { message: 'Error fetching task', error: error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/projects/:id/tasks/:taskId - Update a specific task
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

    // Connect to database
    await connectToDatabase();

    // Get project ID and task ID from params
    const { id: projectId, taskId } = params;

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

    // Find task by ID
    const task = project.tasks.id(taskId);
    if (!task) {
      return NextResponse.json(
        { message: 'Task not found' },
        { status: 404 }
      );
    }

    // Get data from request body
    const data = await request.json();
    const { title, description, status, assignedTo } = data;

    // Update task fields
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (assignedTo !== undefined) task.assignedTo = assignedTo;

    // Save changes
    await project.save();

    // Populate user fields
    await project.populate('tasks.assignedTo', 'name image');
    await project.populate('tasks.createdBy', 'name image');

    // Return updated task
    return NextResponse.json({
      message: 'Task updated successfully',
      task: project.tasks.id(taskId),
    });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { message: 'Error updating task', error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/:id/tasks/:taskId - Delete a specific task
export async function DELETE(request, { params }) {
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

    // Get project ID and task ID from params
    const { id: projectId, taskId } = params;

    // Find project by ID
    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json(
        { message: 'Project not found' },
        { status: 404 }
      );
    }

    // Check if user is authorized to delete tasks
    const isOwner = project.owner.toString() === session.user.id;
    const isAdmin = project.members.some(
      member => member.user.toString() === session.user.id && member.role === 'admin'
    );
    const isTaskCreator = project.tasks.some(
      task => task._id.toString() === taskId && task.createdBy.toString() === session.user.id
    );

    if (!isOwner && !isAdmin && !isTaskCreator) {
      return NextResponse.json(
        { message: 'Not authorized to delete this task' },
        { status: 403 }
      );
    }

    // Find and remove task
    const taskIndex = project.tasks.findIndex(task => task._id.toString() === taskId);
    if (taskIndex === -1) {
      return NextResponse.json(
        { message: 'Task not found' },
        { status: 404 }
      );
    }

    // Remove task at index
    project.tasks.splice(taskIndex, 1);
    await project.save();

    // Return success message
    return NextResponse.json({
      message: 'Task deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { message: 'Error deleting task', error: error.message },
      { status: 500 }
    );
  }
} 