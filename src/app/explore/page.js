'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function ExplorePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [error, setError] = useState('');

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [sortBy, setSortBy] = useState('newest');

  const statusOptions = ['all', 'planning', 'in-progress', 'on-hold', 'completed'];
  const skillOptions = [
    'JavaScript', 'TypeScript', 'React', 'Next.js', 'Vue.js',
    'Angular', 'Node.js', 'Python', 'Django', 'Flask',
    'Java', 'Spring', 'PHP', 'Laravel', 'Ruby',
    'Rails', 'C#', '.NET', 'Go', 'Rust',
    'HTML', 'CSS', 'Tailwind CSS', 'UI/UX Design'
  ];

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // In a real app, you would fetch from an API
        // For demo, use mock data
        const mockProjects = [
          {
            id: '1',
            title: 'AI Image Generator',
            description: 'A web application that uses AI to generate images from text descriptions.',
            status: 'in-progress',
            requiredSkills: ['JavaScript', 'React', 'Node.js', 'Python', 'TensorFlow'],
            owner: {
              id: '101',
              name: 'Pallavi Sharma',
              image: null
            },
            members: Array(3),
            createdAt: '2023-03-15T12:00:00Z',
            updatedAt: '2023-04-02T10:30:00Z'
          },
          {
            id: '2',
            title: 'Task Management System',
            description: 'A collaborative task management system for remote teams with real-time updates.',
            status: 'planning',
            requiredSkills: ['TypeScript', 'React', 'Node.js', 'MongoDB', 'Socket.io'],
            owner: {
              id: '102',
              name: 'Aditya Verma',
              image: null
            },
            members: Array(2),
            createdAt: '2023-03-28T09:15:00Z',
            updatedAt: '2023-04-05T14:20:00Z'
          },
          {
            id: '3',
            title: 'E-Commerce Platform',
            description: 'A modern e-commerce platform with product management, cart, and checkout functionality.',
            status: 'in-progress',
            requiredSkills: ['JavaScript', 'Vue.js', 'Node.js', 'Express', 'PostgreSQL'],
            owner: {
              id: '103',
              name: 'Sandhya Patel',
              image: null
            },
            members: Array(4),
            createdAt: '2023-02-10T16:45:00Z',
            updatedAt: '2023-04-01T11:10:00Z'
          },
          {
            id: '4',
            title: 'Mobile App Development',
            description: 'Cross-platform mobile app for fitness tracking with social features.',
            status: 'planning',
            requiredSkills: ['React Native', 'JavaScript', 'Firebase', 'UI/UX Design'],
            owner: {
              id: '104',
              name: 'Shivam Gupta',
              image: null
            },
            members: Array(2),
            createdAt: '2023-04-01T08:30:00Z',
            updatedAt: '2023-04-06T17:40:00Z'
          },
          {
            id: '5',
            title: 'Blog Platform',
            description: 'A modern blogging platform with markdown support, comments, and user profiles.',
            status: 'completed',
            requiredSkills: ['React', 'Next.js', 'Node.js', 'MongoDB', 'Tailwind CSS'],
            owner: {
              id: '105',
              name: 'Himanshu Pandey',
              image: null
            },
            members: Array(3),
            createdAt: '2023-01-20T14:15:00Z',
            updatedAt: '2023-03-15T09:50:00Z'
          },
          {
            id: '6',
            title: 'Music Streaming Service',
            description: 'A web application for streaming music with playlist creation and social sharing.',
            status: 'on-hold',
            requiredSkills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'AWS'],
            owner: {
              id: '106',
              name: 'Ananya Desai',
              image: null
            },
            members: Array(5),
            createdAt: '2023-02-05T11:20:00Z',
            updatedAt: '2023-03-10T16:30:00Z'
          },
          {
            id: '7',
            title: 'Community Forum',
            description: 'A discussion forum with categories, upvoting, and moderation tools.',
            status: 'in-progress',
            requiredSkills: ['TypeScript', 'Angular', 'Node.js', 'PostgreSQL'],
            owner: {
              id: '107',
              name: 'Shreya Mehta',
              image: null
            },
            members: Array(3),
            createdAt: '2023-03-05T15:40:00Z',
            updatedAt: '2023-04-07T13:15:00Z'
          },
          {
            id: '8',
            title: 'Weather Dashboard',
            description: 'A weather dashboard with forecast data, maps, and location-based alerts.',
            status: 'planning',
            requiredSkills: ['JavaScript', 'React', 'APIs', 'CSS', 'Mapbox'],
            owner: {
              id: '108',
              name: 'Palak Singhania',
              image: null
            },
            members: Array(2),
            createdAt: '2023-03-25T10:10:00Z',
            updatedAt: '2023-04-04T09:25:00Z'
          }
        ];

        setProjects(mockProjects);
        setFilteredProjects(mockProjects);
        setIsLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch projects');
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...projects];

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(project =>
        project.title.toLowerCase().includes(search) ||
        project.description.toLowerCase().includes(search)
      );
    }

    // Apply status filter
    if (selectedStatus !== 'all') {
      result = result.filter(project => project.status === selectedStatus);
    }

    // Apply skills filter
    if (selectedSkills.length > 0) {
      result = result.filter(project =>
        selectedSkills.some(skill => project.requiredSkills.includes(skill))
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        result = result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'updated':
        result = result.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        break;
      case 'alphabetical':
        result = result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'members':
        result = result.sort((a, b) => b.members.length - a.members.length);
        break;
      default:
        break;
    }

    setFilteredProjects(result);
  }, [projects, searchTerm, selectedStatus, selectedSkills, sortBy]);

  const toggleSkill = (skill) => {
    setSelectedSkills(prevSkills =>
      prevSkills.includes(skill)
        ? prevSkills.filter(s => s !== skill)
        : [...prevSkills, skill]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('all');
    setSelectedSkills([]);
    setSortBy('newest');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'planning':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'on-hold':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Explore Projects</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Discover projects and connect with developers</p>
        </div>

        {/* Filters Section */}
        <div className="px-4 py-5 sm:p-6 border-b border-gray-200 dark:border-gray-700 space-y-4">
          <div className="sm:flex sm:items-start sm:justify-between">
            <div className="max-w-lg w-full">
              <label htmlFor="search" className="sr-only">Search projects</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Search for projects..."
                />
              </div>
            </div>
            <div className="mt-3 flex sm:mt-0 sm:ml-4">
              <div className="flex items-center">
                <label htmlFor="sort" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
                  Sort by
                </label>
                <select
                  id="sort"
                  name="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="newest">Newest</option>
                  <option value="updated">Recently Updated</option>
                  <option value="alphabetical">Alphabetical</option>
                  <option value="members">Most Members</option>
                </select>
              </div>
              <button
                type="button"
                onClick={clearFilters}
                className="ml-3 inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Clear Filters
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</h3>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setSelectedStatus(status)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${selectedStatus === status
                    ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 ring-2 ring-indigo-500'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {skillOptions.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${selectedSkills.includes(skill)
                    ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 ring-2 ring-indigo-500'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="px-4 py-5 sm:p-6">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No projects found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Try adjusting your search or filter to find what you&apos;re looking for.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <div key={project.id} className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                        <Link href={`/project/${project.id}`} className="hover:underline">
                          {project.title}
                        </Link>
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
                      {project.description}
                    </p>
                    <div className="mt-4">
                      <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Skills Needed</h4>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {project.requiredSkills.slice(0, 3).map((skill) => (
                          <span key={skill} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                            {skill}
                          </span>
                        ))}
                        {project.requiredSkills.length > 3 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                            +{project.requiredSkills.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {project.owner.image ? (
                            <Image
                              className="h-8 w-8 rounded-full object-cover"
                              src={project.owner.image}
                              alt={project.owner.name}
                              width={32}
                              height={32}
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-indigo-800">
                                {project.owner.name.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {project.owner.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {project.members.length + 1} members
                          </p>
                        </div>
                      </div>
                      <Link
                        href={`/project/${project.id}`}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        View details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 