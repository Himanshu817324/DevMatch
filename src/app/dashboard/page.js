'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [recommendedProjects, setRecommendedProjects] = useState([]);
  const [potentialMatches, setPotentialMatches] = useState([]);
  const [matchingError, setMatchingError] = useState('');

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin');
    }
  }, [status, router]);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (status === 'authenticated' && session?.user?.id) {
        try {
          const response = await fetch(`/api/users/${session.user.id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch profile');
          }
          const data = await response.json();
          setProfile(data.user);

          // If user hasn't completed profile (no bio or skills), redirect to onboarding
          if (!data.user.bio || !data.user.skills || data.user.skills.length === 0) {
            router.push('/profile/onboarding');
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchProfile();
  }, [status, session, router]);

  // Fetch recommended projects and potential matches based on user skills
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (profile && profile.skills && profile.skills.length > 0) {
        try {
          // Fetch all projects to find matches
          const projectsResponse = await fetch('/api/projects');
          if (!projectsResponse.ok) {
            throw new Error('Failed to fetch projects');
          }
          const projectsData = await projectsResponse.json();

          // Filter projects that match user skills
          // Don't include projects the user is already a member of
          const userProjects = profile.projects || [];
          const userProjectIds = userProjects.map(p => p._id || p);

          // Calculate match score for each project
          const matchedProjects = projectsData.projects
            .filter(project => !userProjectIds.includes(project._id))
            .map(project => {
              // Find matching skills
              const matchingSkills = project.requiredSkills.filter(
                skill => profile.skills.includes(skill)
              );

              // Calculate match score as percentage of required skills matched
              const matchScore = project.requiredSkills.length > 0
                ? Math.round((matchingSkills.length / project.requiredSkills.length) * 100)
                : 0;

              return { project, matchScore, matchingSkills };
            })
            .filter(({ matchScore }) => matchScore > 0) // Only include projects with some skill match
            .sort((a, b) => b.matchScore - a.matchScore); // Sort by match score (highest first)

          // Take top 5 for recommendations
          setRecommendedProjects(matchedProjects.slice(0, 5));

          // ... similar logic for potential developer matches could be implemented here

        } catch (err) {
          setMatchingError(err.message);
        }
      }
    };

    fetchRecommendations();
  }, [profile]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back, {profile.name}! Here&apos;s what&apos;s happening with your account.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Projects section */}
          <div className="bg-white shadow sm:rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Your Projects</h2>
                <p className="mt-1 text-sm text-gray-500">Projects you&apos;re working on or own</p>
              </div>
              <Link
                href="/project/create"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create Project
              </Link>
            </div>
            {profile.projects && profile.projects.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {profile.projects.map((project) => (
                  <li key={project._id || project.id} className="px-4 py-4 sm:px-6">
                    <Link href={`/project/${project._id || project.id}`} className="block hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-indigo-600 truncate">{project.title}</p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {project.status}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 flex justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            {project.members?.length || 0} members
                          </p>
                          <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            Created on {new Date(project.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) :
              <div className="px-4 py-5 sm:p-6 text-center">
                <h3 className="text-sm font-medium text-gray-900">No projects yet</h3>
                <div className="mt-2 text-sm text-gray-500">
                  <p>Create a project or join one to collaborate with other developers.</p>
                </div>
                <div className="mt-5">
                  <Link
                    href="/project/create"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Create a project
                  </Link>
                </div>
              </div>
            }
          </div>

          {/* Recommended Projects */}
          <div className="bg-white shadow sm:rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">Recommended Projects</h2>
              <p className="mt-1 text-sm text-gray-500">Projects that match your skills and interests</p>
            </div>
            {matchingError ? (
              <div className="px-4 py-5 sm:p-6 text-center">
                <p className="text-sm text-red-600">{matchingError}</p>
              </div>
            ) : recommendedProjects.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {recommendedProjects.map(({ project, matchScore, matchingSkills }) => (
                  <li key={project._id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <Link href={`/project/${project._id}`} className="text-sm font-medium text-indigo-600 truncate hover:underline">
                        {project.title}
                      </Link>
                      <div className="ml-2 flex-shrink-0 flex">
                        <span className="text-sm text-gray-500">Match: {matchScore}%</span>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      by {project.owner?.name || 'Unknown'}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {project.requiredSkills.map((skill) => (
                        <span
                          key={skill}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${matchingSkills.includes(skill)
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                            }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className="mt-3">
                      <Link
                        href={`/project/${project._id}`}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        View Project
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-5 sm:p-6 text-center">
                <p className="text-sm text-gray-500">No recommended projects found. Try updating your skills to get better matches.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile card */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">Profile</h2>
              <p className="mt-1 text-sm text-gray-500">Your account information</p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Full name</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profile.name}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Email address</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profile.email}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Title</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profile.title || '-'}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Skills</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <div className="flex flex-wrap gap-2">
                      {profile.skills && profile.skills.length > 0 ? profile.skills.map((skill) => (
                        <span key={skill} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {skill}
                        </span>
                      )) : '-'}
                    </div>
                  </dd>
                </div>
              </dl>
            </div>
            <div className="border-t border-gray-200 px-4 py-4">
              <Link
                href="/profile"
                className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
              >
                View full profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 