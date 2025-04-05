'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProjectsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [projects, setProjects] = useState([]);

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin');
    }
  }, [status, router]);

  // Fetch user profile and projects
  useEffect(() => {
    const fetchData = async () => {
      if (status === 'authenticated' && session?.user?.id) {
        try {
          // Fetch user profile
          const profileResponse = await fetch(`/api/users/${session.user.id}`);
          if (!profileResponse.ok) {
            throw new Error('Failed to fetch profile');
          }
          const profileData = await profileResponse.json();
          setProfile(profileData.user);

          // Fetch all projects
          const projectsResponse = await fetch('/api/projects');
          if (!projectsResponse.ok) {
            throw new Error('Failed to fetch projects');
          }
          const projectsData = await projectsResponse.json();
          setProjects(projectsData.projects);

        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [status, session]);

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

  // Filter projects the user is a member of or owns
  const userProjects = projects.filter(project =>
    project.owner._id === session.user.id ||
    project.members.some(member => member._id === session.user.id)
  );

  // Other available projects the user is not a part of
  const otherProjects = projects.filter(project =>
    project.owner._id !== session.user.id &&
    !project.members.some(member => member._id === session.user.id)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your projects and discover new ones to join
        </p>
      </div>

      {/* User's Projects */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Your Projects</h2>
            <p className="mt-1 text-sm text-gray-500">Projects you own or are a member of</p>
          </div>
          <Link
            href="/project/create"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Project
          </Link>
        </div>
        {userProjects.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {userProjects.map((project) => (
              <li key={project._id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <Link href={`/project/${project._id}`} className="block">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-indigo-600 truncate">{project.title}</p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {project.status}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        {project.members.length + 1} members
                      </p>
                      <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                        <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        Created on {new Date(project.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      {project.owner._id === session.user.id ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Owner
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Member
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
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
        )}
      </div>

      {/* Discover Projects */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Discover Projects</h2>
          <p className="mt-1 text-sm text-gray-500">Projects you can join or contribute to</p>
        </div>
        {otherProjects.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {otherProjects.map((project) => (
              <li key={project._id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <Link href={`/project/${project._id}`} className="text-sm font-medium text-indigo-600 truncate hover:underline">
                    {project.title}
                  </Link>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {project.status}
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      Owner: {project.owner.name}
                    </p>
                    <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                      <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      {project.members.length + 1} members
                    </p>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 line-clamp-2">{project.description}</p>
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {project.requiredSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
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
            <h3 className="text-sm font-medium text-gray-900">No projects available</h3>
            <div className="mt-2 text-sm text-gray-500">
              <p>Check back later or create your own project.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 