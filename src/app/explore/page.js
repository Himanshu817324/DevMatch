'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState('developers'); // 'developers' or 'projects'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);

  // Sample data for developers
  const developers = [
    {
      id: 1,
      name: 'Alex Johnson',
      title: 'Full Stack Developer',
      skills: ['React', 'Node.js', 'MongoDB', 'AWS'],
      bio: 'Passionate developer with 5 years of experience building web applications.',
    },
    {
      id: 2,
      name: 'Sarah Parker',
      title: 'Frontend Developer',
      skills: ['React', 'JavaScript', 'CSS', 'Tailwind'],
      bio: 'UI/UX enthusiast focused on creating beautiful and functional interfaces.',
    },
    {
      id: 3,
      name: 'Michael Chen',
      title: 'Backend Engineer',
      skills: ['Python', 'Django', 'PostgreSQL', 'Docker'],
      bio: 'Backend specialist with a focus on scalable architecture and performance.',
    },
    {
      id: 4,
      name: 'Emily Davis',
      title: 'Mobile Developer',
      skills: ['React Native', 'JavaScript', 'Firebase'],
      bio: 'Mobile app developer passionate about creating cross-platform experiences.',
    },
    {
      id: 5,
      name: 'David Kim',
      title: 'DevOps Engineer',
      skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
      bio: 'DevOps professional focused on automating deployment pipelines and infrastructure.',
    },
  ];

  // Sample data for projects
  const projects = [
    {
      id: 1,
      title: 'E-commerce Platform',
      description: 'Building a modern e-commerce platform with React, Node.js, and MongoDB.',
      requiredSkills: ['React', 'Node.js', 'MongoDB', 'Redux'],
      owner: 'Alex Johnson',
      members: 3,
      status: 'In Progress',
    },
    {
      id: 2,
      title: 'Task Management App',
      description: 'A collaborative task management application with real-time updates.',
      requiredSkills: ['React', 'Firebase', 'Tailwind CSS'],
      owner: 'Sarah Parker',
      members: 2,
      status: 'Planning',
    },
    {
      id: 3,
      title: 'Recipe Sharing Platform',
      description: 'A social platform for sharing and discovering recipes with friends.',
      requiredSkills: ['Vue.js', 'Node.js', 'PostgreSQL'],
      owner: 'Michael Chen',
      members: 4,
      status: 'In Progress',
    },
    {
      id: 4,
      title: 'Fitness Tracking Mobile App',
      description: 'A mobile app to track workouts, nutrition, and fitness goals.',
      requiredSkills: ['React Native', 'Firebase', 'Redux'],
      owner: 'Emily Davis',
      members: 2,
      status: 'Planning',
    },
    {
      id: 5,
      title: 'Developer Portfolio Generator',
      description: 'A tool to automatically generate stunning developer portfolios from GitHub data.',
      requiredSkills: ['Next.js', 'GitHub API', 'Tailwind CSS'],
      owner: 'David Kim',
      members: 1,
      status: 'Looking for Contributors',
    },
  ];

  // Common skills for filtering
  const commonSkills = [
    'React', 'Vue.js', 'Angular', 'JavaScript', 'TypeScript',
    'Node.js', 'Python', 'Django', 'Flask',
    'MongoDB', 'PostgreSQL', 'MySQL', 'Firebase',
    'AWS', 'Docker', 'Kubernetes', 'CI/CD',
    'React Native', 'Next.js', 'Tailwind CSS',
  ];

  // Filter developers based on search and skills
  const filteredDevelopers = developers.filter((developer) => {
    const matchesSearch = searchQuery === '' ||
      developer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      developer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      developer.bio.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSkills = selectedSkills.length === 0 ||
      selectedSkills.every(skill => developer.skills.includes(skill));

    return matchesSearch && matchesSkills;
  });

  // Filter projects based on search and skills
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = searchQuery === '' ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.owner.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSkills = selectedSkills.length === 0 ||
      selectedSkills.some(skill => project.requiredSkills.includes(skill));

    return matchesSearch && matchesSkills;
  });

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Explore</h1>
        <p className="mt-2 text-lg text-gray-600">
          Find developers and projects to collaborate with
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar / Filters */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Filters</h3>

              {/* Search */}
              <div className="mt-4">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                  Search
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="search"
                    id="search"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Skills */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700">Skills</h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {commonSkills.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedSkills.includes(skill)
                        ? 'bg-indigo-100 text-indigo-800 border border-indigo-500'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear filters */}
              {(searchQuery || selectedSkills.length > 0) && (
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedSkills([]);
                    }}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('developers')}
                className={`${activeTab === 'developers'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Developers
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`${activeTab === 'projects'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Projects
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="mt-6">
            {activeTab === 'developers' ? (
              <div className="space-y-4">
                {filteredDevelopers.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No developers found matching your criteria.</p>
                  </div>
                ) : (
                  filteredDevelopers.map((developer) => (
                    <div key={developer.id} className="bg-white shadow overflow-hidden sm:rounded-lg">
                      <div className="px-4 py-5 sm:px-6 flex justify-between items-start">
                        <div>
                          <h3 className="text-lg leading-6 font-medium text-gray-900">{developer.name}</h3>
                          <p className="mt-1 max-w-2xl text-sm text-gray-500">{developer.title}</p>
                        </div>
                        <Link
                          href={`/profile/${developer.id}`}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          View Profile
                        </Link>
                      </div>
                      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <dl className="sm:divide-y sm:divide-gray-200">
                          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Bio</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{developer.bio}</dd>
                          </div>
                          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Skills</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              <div className="flex flex-wrap gap-2">
                                {developer.skills.map((skill) => (
                                  <span
                                    key={skill}
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProjects.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No projects found matching your criteria.</p>
                  </div>
                ) : (
                  filteredProjects.map((project) => (
                    <div key={project.id} className="bg-white shadow overflow-hidden sm:rounded-lg">
                      <div className="px-4 py-5 sm:px-6 flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">{project.title}</h3>
                            <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${project.status === 'Looking for Contributors'
                              ? 'bg-green-100 text-green-800'
                              : project.status === 'In Progress'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                              }`}>
                              {project.status}
                            </span>
                          </div>
                          <p className="mt-1 max-w-2xl text-sm text-gray-500">by {project.owner}</p>
                        </div>
                        <Link
                          href={`/project/${project.id}`}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          View Project
                        </Link>
                      </div>
                      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <dl className="sm:divide-y sm:divide-gray-200">
                          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Description</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{project.description}</dd>
                          </div>
                          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Required Skills</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              <div className="flex flex-wrap gap-2">
                                {project.requiredSkills.map((skill) => (
                                  <span
                                    key={skill}
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </dd>
                          </div>
                          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Team</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              {project.members} members
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 