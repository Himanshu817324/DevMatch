import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectToDatabase from '../../../../lib/mongodb';
import Project from '../../../../models/Project';
import { authOptions } from '../../../../lib/auth';

// GET /api/projects - Get all projects
export async function GET(request) {
  try {
    // Connect to database
    await connectToDatabase();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const skills = searchParams.get('skills')?.split(',') || [];
    const status = searchParams.get('status');
    const query = searchParams.get('q') || '';

    // Build filter object based on query params
    const filter = {};

    if (skills.length > 0) {
      filter.requiredSkills = { $in: skills };
    }

    if (status) {
      filter.status = status;
    }

    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ];
    }

    // Count total documents for pagination
    const total = await Project.countDocuments(filter);

    // Fetch projects with pagination
    const projects = await Project.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('owner', 'name image')
      .populate('members.user', 'name image');

    // Return projects
    return NextResponse.json({
      projects,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { message: 'Error fetching projects', error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create a new project
export async function POST(request) {
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

    // Get data from request body
    const data = await request.json();
    const { title, description, requiredSkills, status, repoLink, demoLink } = data;

    // Validate required fields
    if (!title || !description) {
      return NextResponse.json(
        { message: 'Title and description are required' },
        { status: 400 }
      );
    }

    // Create new project
    const project = await Project.create({
      title,
      description,
      requiredSkills: requiredSkills || [],
      status: status || 'planning',
      repoLink: repoLink || '',
      demoLink: demoLink || '',
      owner: session.user.id,
      members: [{ user: session.user.id, role: 'owner' }],
    });

    // Populate owner and members
    await project.populate('owner', 'name image');
    await project.populate('members.user', 'name image');

    // Return created project
    return NextResponse.json({
      message: 'Project created successfully',
      project
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { message: 'Error creating project', error: error.message },
      { status: 500 }
    );
  }
} 