import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectToDatabase from '../../../../../lib/mongodb';
import Project from '../../../../../models/Project';
import { authOptions } from '../../../../../lib/auth';

// GET /api/projects/:id - Get a specific project
export async function GET(request, { params }) {
  try {
    // Connect to database
    await connectToDatabase();

    // Get project ID from params
    const projectId = params.id;

    // Find project by ID
    const project = await Project.findById(projectId)
      .populate('owner', 'name image')
      .populate('members.user', 'name image')
      .populate('tasks.assignedTo', 'name image')
      .populate('tasks.createdBy', 'name image');

    if (!project) {
      return NextResponse.json(
        { message: 'Project not found' },
        { status: 404 }
      );
    }

    // Return project data
    return NextResponse.json({ project });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { message: 'Error fetching project', error: error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/projects/:id - Update a project
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

    // Check if user is authorized to update this project
    const isOwner = project.owner.toString() === session.user.id;
    const isAdmin = project.members.some(
      member => member.user.toString() === session.user.id && member.role === 'admin'
    );

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { message: 'Not authorized to update this project' },
        { status: 403 }
      );
    }

    // Get data from request body
    const data = await request.json();
    const { title, description, requiredSkills, status, repoLink, demoLink } = data;

    // Build update object
    const updates = {};
    if (title) updates.title = title;
    if (description) updates.description = description;
    if (requiredSkills) updates.requiredSkills = requiredSkills;
    if (status) updates.status = status;
    if (repoLink !== undefined) updates.repoLink = repoLink;
    if (demoLink !== undefined) updates.demoLink = demoLink;

    // Update project
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { $set: updates },
      { new: true, runValidators: true }
    )
      .populate('owner', 'name image')
      .populate('members.user', 'name image')
      .populate('tasks.assignedTo', 'name image')
      .populate('tasks.createdBy', 'name image');

    // Return updated project
    return NextResponse.json({
      message: 'Project updated successfully',
      project: updatedProject,
    });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { message: 'Error updating project', error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/:id - Delete a project
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

    // Check if user is the owner
    if (project.owner.toString() !== session.user.id) {
      return NextResponse.json(
        { message: 'Only the project owner can delete a project' },
        { status: 403 }
      );
    }

    // Delete project
    await Project.findByIdAndDelete(projectId);

    // Return success message
    return NextResponse.json({
      message: 'Project deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { message: 'Error deleting project', error: error.message },
      { status: 500 }
    );
  }
} 