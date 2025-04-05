import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectToDatabase from '../../../../../../../lib/mongodb';
import Project from '../../../../../../../models/Project';
import { authOptions } from '../../../../../../../lib/auth';

// PATCH /api/projects/:id/members/:userId - Update a member's role
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

    // Get project ID and user ID from params
    const { id: projectId, userId } = params;

    // Find project by ID
    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json(
        { message: 'Project not found' },
        { status: 404 }
      );
    }

    // Check if user is authorized to update members
    const isOwner = project.owner.toString() === session.user.id;
    const isAdmin = project.members.some(
      member => member.user.toString() === session.user.id && member.role === 'admin'
    );

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { message: 'Not authorized to update member roles in this project' },
        { status: 403 }
      );
    }

    // Cannot change the role of the project owner
    if (project.owner.toString() === userId) {
      return NextResponse.json(
        { message: 'Cannot change the role of the project owner' },
        { status: 400 }
      );
    }

    // Get data from request body
    const data = await request.json();
    const { role } = data;

    // Validate role
    if (!role || !['admin', 'member'].includes(role)) {
      return NextResponse.json(
        { message: 'Invalid role. Role must be "admin" or "member"' },
        { status: 400 }
      );
    }

    // Find member in project
    const memberIndex = project.members.findIndex(
      member => member.user.toString() === userId
    );

    if (memberIndex === -1) {
      return NextResponse.json(
        { message: 'Member not found in this project' },
        { status: 404 }
      );
    }

    // Update member role
    project.members[memberIndex].role = role;
    await project.save();

    // Populate user fields
    await project.populate('members.user', 'name email image title skills');

    // Return updated member
    return NextResponse.json({
      message: 'Member role updated successfully',
      member: project.members[memberIndex],
    });
  } catch (error) {
    console.error('Error updating member role:', error);
    return NextResponse.json(
      { message: 'Error updating member role', error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/:id/members/:userId - Remove a member from a project
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

    // Get project ID and user ID from params
    const { id: projectId, userId } = params;

    // Find project by ID
    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json(
        { message: 'Project not found' },
        { status: 404 }
      );
    }

    // Check if the user is trying to leave the project themselves
    const isSelfRemoval = userId === session.user.id;

    // If not self-removal, check if user is authorized to remove members
    if (!isSelfRemoval) {
      const isOwner = project.owner.toString() === session.user.id;
      const isAdmin = project.members.some(
        member => member.user.toString() === session.user.id && member.role === 'admin'
      );

      if (!isOwner && !isAdmin) {
        return NextResponse.json(
          { message: 'Not authorized to remove members from this project' },
          { status: 403 }
        );
      }
    }

    // Cannot remove the project owner
    if (project.owner.toString() === userId) {
      return NextResponse.json(
        { message: 'Cannot remove the project owner. Transfer ownership first or delete the project.' },
        { status: 400 }
      );
    }

    // Find member in project
    const memberIndex = project.members.findIndex(
      member => member.user.toString() === userId
    );

    if (memberIndex === -1) {
      return NextResponse.json(
        { message: 'Member not found in this project' },
        { status: 404 }
      );
    }

    // Remove member from project
    project.members.splice(memberIndex, 1);
    await project.save();

    // Return success message
    return NextResponse.json({
      message: isSelfRemoval ? 'You have left the project' : 'Member removed successfully',
    });
  } catch (error) {
    console.error('Error removing project member:', error);
    return NextResponse.json(
      { message: 'Error removing project member', error: error.message },
      { status: 500 }
    );
  }
} 