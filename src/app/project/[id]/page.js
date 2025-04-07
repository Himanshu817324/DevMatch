'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ProjectChat from '../../../../components/project/ProjectChat';


export default function ProjectPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskStatus, setTaskStatus] = useState('todo');
  const [taskAssignee, setTaskAssignee] = useState('');
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);
  const [taskError, setTaskError] = useState('');

  const projectId = params.id;

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin');
    }
  }, [status, router]);

  // Fetch project data
  useEffect(() => {
    const fetchProject = async () => {
      if (status === 'authenticated') {
        try {
          // Try to fetch project data from API
          const response = await fetch(`/api/projects/${projectId}`);

          if (response.ok) {
            const data = await response.json();
            setProject(data.project);
          } else {
            // If API call fails, use mock data based on the project ID
            const mockProject = {
              _id: projectId,
              title: `Project ${projectId}`,
              description: "This is a sample project description. In a real app, this would be loaded from the database.",
              status: "In Progress",
              createdAt: new Date().toISOString(),
              createdBy: {
                _id: "user1",
                name: "John Doe",
                email: "john@example.com"
              },
              members: [
                {
                  _id: "user1",
                  name: "John Doe",
                  role: "Owner"
                },
                {
                  _id: "user2",
                  name: "Jane Smith",
                  role: "Developer"
                }
              ],
              requiredSkills: ["React", "Next.js", "JavaScript", "Tailwind CSS"],
              tasks: [
                {
                  _id: "task1",
                  title: "Design UI Components",
                  description: "Create reusable UI components for the application",
                  status: "completed",
                  assignedTo: {
                    _id: "user2",
                    name: "Jane Smith"
                  },
                  createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                  _id: "task2",
                  title: "Implement Authentication",
                  description: "Set up user authentication and authorization",
                  status: "in-progress",
                  assignedTo: {
                    _id: "user1",
                    name: "John Doe"
                  },
                  createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                  _id: "task3",
                  title: "Create API Endpoints",
                  description: "Develop backend API endpoints for data fetching",
                  status: "todo",
                  assignedTo: null,
                  createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
                }
              ]
            };

            setProject(mockProject);
          }
        } catch (err) {
          // Use mock data if there's an error
          const mockProject = {
            _id: projectId,
            title: `Project ${projectId}`,
            description: "This is a sample project description. In a real app, this would be loaded from the database.",
            status: "In Progress",
            createdAt: new Date().toISOString(),
            createdBy: {
              _id: "user1",
              name: "John Doe",
              email: "john@example.com"
            },
            members: [
              {
                _id: "user1",
                name: "John Doe",
                role: "Owner"
              },
              {
                _id: "user2",
                name: "Jane Smith",
                role: "Developer"
              }
            ],
            requiredSkills: ["React", "Next.js", "JavaScript", "Tailwind CSS"],
            tasks: [
              {
                _id: "task1",
                title: "Design UI Components",
                description: "Create reusable UI components for the application",
                status: "completed",
                assignedTo: {
                  _id: "user2",
                  name: "Jane Smith"
                },
                createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
              },
              {
                _id: "task2",
                title: "Implement Authentication",
                description: "Set up user authentication and authorization",
                status: "in-progress",
                assignedTo: {
                  _id: "user1",
                  name: "John Doe"
                },
                createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
              },
              {
                _id: "task3",
                title: "Create API Endpoints",
                description: "Develop backend API endpoints for data fetching",
                status: "todo",
                assignedTo: null,
                createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
              }
            ]
          };

          setProject(mockProject);
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (status !== 'loading') {
      fetchProject();
    }
  }, [status, projectId]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setTaskError('');
    setIsSubmittingTask(true);

    try {
      // Validate task title
      if (!taskTitle.trim()) {
        throw new Error('Task title is required');
      }

      // Create task
      const response = await fetch(`/api/projects/${projectId}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: taskTitle,
          description: taskDescription,
          status: taskStatus,
          assignedTo: taskAssignee || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create task');
      }

      // Refresh project data
      const projectResponse = await fetch(`/api/projects/${projectId}`);
      if (!projectResponse.ok) {
        throw new Error('Failed to refresh project data');
      }
      const projectData = await projectResponse.json();
      setProject(projectData.project);

      // Reset form and close modal
      setTaskTitle('');
      setTaskDescription('');
      setTaskStatus('todo');
      setTaskAssignee('');
      setIsTaskModalOpen(false);
    } catch (err) {
      setTaskError(err.message);
    } finally {
      setIsSubmittingTask(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                Dashboard
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                <span className="text-gray-500 ml-1 md:ml-2 font-medium" aria-current="page">{project.title}</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{project.title}</h1>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              Created on {new Date(project.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex space-x-3">
            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-200">
              {project.status}
            </span>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Edit Project
            </button>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:px-6">
          <p className="text-gray-700 dark:text-gray-300 mb-6">{project.description}</p>

          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Required Skills</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {project.requiredSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Tasks</h3>
                  <button
                    type="button"
                    onClick={() => setIsTaskModalOpen(true)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add Task
                  </button>
                </div>
                <div className="mt-3 bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
                  {project.tasks && project.tasks.length > 0 ? (
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                      {project.tasks.map((task) => {
                        const statusColors = {
                          'todo': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
                          'in-progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-200',
                          'review': 'bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-200',
                          'completed': 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-200'
                        };

                        const statusDisplay = {
                          'todo': 'To Do',
                          'in-progress': 'In Progress',
                          'review': 'In Review',
                          'completed': 'Completed'
                        };

                        return (
                          <li key={task._id}>
                            <div className="px-4 py-4 sm:px-6">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 truncate">{task.title}</p>
                                <div className="ml-2 flex-shrink-0 flex">
                                  <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[task.status]}`}>
                                    {statusDisplay[task.status] || task.status}
                                  </p>
                                </div>
                              </div>
                              <div className="mt-2 sm:flex sm:justify-between">
                                <div className="sm:flex">
                                  <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                    {task.assignedTo ? (
                                      <>Assigned to {task.assignedTo.name}</>
                                    ) : (
                                      <>Unassigned</>
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <div className="px-4 py-5 text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">No tasks created yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg overflow-hidden mb-6">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Team</h3>
                </div>
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {project.members.map((member) => {
                    // Handle different data structures - either direct member object or nested user object
                    const memberId = member._id || member.id || (member.user && (member.user._id || member.user.id));
                    const memberName = member.name || (member.user && member.user.name) || 'Team Member';
                    const memberRole = member.role || 'Member';

                    return (
                      <li key={memberId} className="px-4 py-4 flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{memberName}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{memberRole}</p>
                        </div>
                        <Link
                          href={`/profile/${memberId}`}
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 text-sm font-medium"
                        >
                          View Profile
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div>
                <ProjectChat projectId={projectId} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setIsTaskModalOpen(false)}></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      Create New Task
                    </h3>

                    {taskError && (
                      <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-200">
                        {taskError}
                      </div>
                    )}

                    <form onSubmit={handleCreateTask} className="mt-4">
                      <div className="mb-4">
                        <label htmlFor="task-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Title *
                        </label>
                        <input
                          type="text"
                          id="task-title"
                          value={taskTitle}
                          onChange={(e) => setTaskTitle(e.target.value)}
                          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                          required
                        />
                      </div>

                      <div className="mb-4">
                        <label htmlFor="task-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Description
                        </label>
                        <textarea
                          id="task-description"
                          value={taskDescription}
                          onChange={(e) => setTaskDescription(e.target.value)}
                          rows={3}
                          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                        />
                      </div>

                      <div className="mb-4">
                        <label htmlFor="task-status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Status
                        </label>
                        <select
                          id="task-status"
                          value={taskStatus}
                          onChange={(e) => setTaskStatus(e.target.value)}
                          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                        >
                          <option value="todo">To Do</option>
                          <option value="in-progress">In Progress</option>
                          <option value="review">In Review</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>

                      <div className="mb-4">
                        <label htmlFor="task-assignee" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Assignee
                        </label>
                        <select
                          id="task-assignee"
                          value={taskAssignee}
                          onChange={(e) => setTaskAssignee(e.target.value)}
                          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                        >
                          <option value="">Unassigned</option>
                          {project?.members.map((member) => {
                            const memberId = member._id || member.id || (member.user && (member.user._id || member.user.id));
                            const memberName = member.name || (member.user && member.user.name) || 'Team Member';
                            return (
                              <option key={memberId} value={memberId}>
                                {memberName}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          disabled={isSubmittingTask}
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                        >
                          {isSubmittingTask ? 'Creating...' : 'Create Task'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsTaskModalOpen(false)}
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 