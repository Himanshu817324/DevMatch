'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [recommendedProjects, setRecommendedProjects] = useState([]);
  const [potentialMatches, setPotentialMatches] = useState([]);
  const [matchingError, setMatchingError] = useState('');

  // New states for enhanced dashboard
  const [activityStats, setActivityStats] = useState({
    completedTasks: 0,
    inProgressTasks: 0,
    projectContributions: 0,
    skillsUsed: 0
  });
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);

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

          // Mock data for activity stats and upcoming deadlines
          setActivityStats({
            completedTasks: 12,
            inProgressTasks: 5,
            projectContributions: 7,
            skillsUsed: data.user.skills?.length || 0
          });

          setUpcomingDeadlines([
            {
              id: '1',
              projectId: '101',
              projectTitle: 'AI Image Generator',
              taskTitle: 'Implement user authentication',
              dueDate: '2023-04-15T00:00:00Z'
            },
            {
              id: '2',
              projectId: '102',
              projectTitle: 'E-Commerce Platform',
              taskTitle: 'Create product listing page',
              dueDate: '2023-04-18T00:00:00Z'
            },
            {
              id: '3',
              projectId: '103',
              projectTitle: 'Mobile App Development',
              taskTitle: 'Design user profile screen',
              dueDate: '2023-04-25T00:00:00Z'
            }
          ]);
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getDaysUntil = (dateString) => {
    const today = new Date();
    const dueDate = new Date(dateString);
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Welcome back, {profile.name}! Here&apos;s what&apos;s happening with your projects.
        </p>
      </div>

      {/* Activity Stats */}
      <div className="mt-6 mb-8">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Activity Overview</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Completed Tasks</dt>
                <dd className="mt-1 text-3xl font-semibold text-indigo-600 dark:text-indigo-400">{activityStats.completedTasks}</dd>
              </dl>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">In Progress Tasks</dt>
                <dd className="mt-1 text-3xl font-semibold text-yellow-500 dark:text-yellow-400">{activityStats.inProgressTasks}</dd>
              </dl>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Project Contributions</dt>
                <dd className="mt-1 text-3xl font-semibold text-green-600 dark:text-green-400">{activityStats.projectContributions}</dd>
              </dl>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Skills Used</dt>
                <dd className="mt-1 text-3xl font-semibold text-purple-600 dark:text-purple-400">{activityStats.skillsUsed}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content - Left and middle columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Projects section */}
          <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Your Projects</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Projects you&apos;re working on or own</p>
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

          {/* Upcoming Deadlines */}
          <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Upcoming Deadlines</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Tasks that need your attention soon</p>
            </div>
            {upcomingDeadlines.length > 0 ? (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {upcomingDeadlines.map((deadline) => {
                  const daysUntil = getDaysUntil(deadline.dueDate);
                  let urgencyClass = "text-green-600 dark:text-green-400";
                  if (daysUntil <= 3) urgencyClass = "text-red-600 dark:text-red-400";
                  else if (daysUntil <= 7) urgencyClass = "text-yellow-600 dark:text-yellow-400";

                  return (
                    <li key={deadline.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <Link href={`/project/${deadline.projectId}?task=${deadline.id}`} className="block">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{deadline.taskTitle}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Project: {deadline.projectTitle}
                            </p>
                          </div>
                          <div className="ml-2 flex-shrink-0 flex flex-col items-end">
                            <p className={`text-sm font-medium ${urgencyClass}`}>
                              {daysUntil === 0 ? "Due today" :
                                daysUntil < 0 ? `Overdue by ${Math.abs(daysUntil)} days` :
                                  `Due in ${daysUntil} days`}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDate(deadline.dueDate)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="px-4 py-5 sm:p-6 text-center">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">No upcoming deadlines</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  You don&apos;t have any tasks due soon.
                </p>
              </div>
            )}
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

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* User Profile Card */}
          <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Your Profile</h2>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {profile.image ? (
                    <Image
                      className="h-16 w-16 rounded-full object-cover"
                      src={profile.image}
                      alt={profile.name}
                      width={64}
                      height={64}
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                      <span className="text-2xl font-medium text-indigo-800 dark:text-indigo-200">
                        {profile.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{profile.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{profile.title || 'Developer'}</p>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Skills</h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {profile.skills?.map((skill) => (
                    <span key={skill} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <Link
                  href="/profile"
                  className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  View Full Profile
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h2>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <ul className="space-y-4">
                <li className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <span className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Completed task <span className="font-medium text-gray-900 dark:text-white">Implement authentication</span></p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                  </div>
                </li>
                <li className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <span className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Commented on <span className="font-medium text-gray-900 dark:text-white">UI redesign task</span></p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Yesterday</p>
                  </div>
                </li>
                <li className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <span className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Joined project <span className="font-medium text-gray-900 dark:text-white">E-Commerce Platform</span></p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">3 days ago</p>
                  </div>
                </li>
              </ul>
              <div className="mt-6">
                <Link
                  href="/notifications"
                  className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
                >
                  View all activity →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 