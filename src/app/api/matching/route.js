import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectToDatabase from '../../../../lib/mongodb';
import User from '../../../../models/User';
import Project from '../../../../models/Project';
import { authOptions } from '../../../../lib/auth';

// GET /api/matching - Get recommended matches for the current user
export async function GET(request) {
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

    // Get current user
    const currentUser = await User.findById(session.user.id);
    if (!currentUser) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Get user's skills
    const userSkills = currentUser.skills || [];

    // If user has no skills, return empty results
    if (userSkills.length === 0) {
      return NextResponse.json({
        projects: [],
        developers: [],
        message: 'To get better recommendations, please add skills to your profile.'
      });
    }

    // Find projects that match user's skills
    // Algorithm logic:
    // 1. Find projects requiring skills the user has
    // 2. Calculate a match score based on the overlap of skills
    // 3. Sort by match score

    const projects = await Project.find({
      requiredSkills: { $in: userSkills },
      // Exclude projects where user is already a member
      members: {
        $not: {
          $elemMatch: {
            user: session.user.id
          }
        }
      }
    })
      .populate('owner', 'name image')
      .populate('members.user', 'name image')
      .limit(10);

    // Calculate match score for each project
    const projectMatches = projects.map(project => {
      const requiredSkills = project.requiredSkills || [];
      const matchingSkills = requiredSkills.filter(skill => userSkills.includes(skill));
      const matchScore = matchingSkills.length / requiredSkills.length;

      return {
        project,
        matchingSkills,
        matchScore: parseFloat((matchScore * 100).toFixed(1))
      };
    }).sort((a, b) => b.matchScore - a.matchScore);

    // Find developers with complementary skills
    // Algorithm logic:
    // 1. Find users with some skills overlap with current user
    // 2. Calculate a compatibility score based on both skill overlap and complementary skills
    // 3. Sort by compatibility score

    const developers = await User.find({
      _id: { $ne: session.user.id }, // Exclude current user
      skills: { $in: userSkills }    // Has some overlap with current user's skills
    })
      .select('name email image title skills bio')
      .limit(20);

    // Calculate compatibility score for each developer
    const developerMatches = developers.map(developer => {
      const devSkills = developer.skills || [];
      const commonSkills = devSkills.filter(skill => userSkills.includes(skill));
      const uniqueSkills = devSkills.filter(skill => !userSkills.includes(skill));

      // Compatibility formula: combination of common skills and unique skills
      // This rewards both similarity and complementary skills
      const commonScore = commonSkills.length / Math.max(userSkills.length, 1);
      const uniqueScore = uniqueSkills.length / Math.max(devSkills.length, 1);
      const compatibilityScore = (commonScore * 0.4 + uniqueScore * 0.6) * 100;

      return {
        developer,
        commonSkills,
        uniqueSkills,
        compatibilityScore: parseFloat(compatibilityScore.toFixed(1))
      };
    }).sort((a, b) => b.compatibilityScore - a.compatibilityScore)
      .slice(0, 10); // Limit to top 10

    // Return matches
    return NextResponse.json({
      projects: projectMatches,
      developers: developerMatches
    });
  } catch (error) {
    console.error('Error in matching algorithm:', error);
    return NextResponse.json(
      { message: 'Error finding matches', error: error.message },
      { status: 500 }
    );
  }
} 