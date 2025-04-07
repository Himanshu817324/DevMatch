'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

export default function Home() {
  // Get authentication status
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';

  return (
    <div className="bg-gray-50 dark:bg-gray-800">
      {/* Hero section */}
      <div className="relative">
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gray-100 dark:bg-gray-700" />
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="relative shadow-xl sm:overflow-hidden sm:rounded-2xl">
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 mix-blend-multiply" />
            </div>
            <div className="relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8">
              <h1 className="text-center text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                <span className="block text-white">Find your perfect</span>
                <span className="block text-indigo-200">developer match in India</span>
              </h1>
              <p className="mx-auto mt-6 max-w-lg text-center text-xl text-indigo-100 sm:max-w-3xl">
                Connect with talented Indian developers who share your passion and complement your skills.
                Build innovative solutions together and contribute to India&apos;s digital transformation.
              </p>
              <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
                <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
                  {isAuthenticated ? (
                    <>
                      <Link
                        href="/dashboard"
                        className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-gray-100 shadow-sm hover:bg-indigo-50 sm:px-8"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/project/create"
                        className="flex items-center justify-center rounded-md border border-transparent bg-indigo-500 bg-opacity-60 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-opacity-70 sm:px-8"
                      >
                        Start a project
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/signup"
                        className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-indigo-700 shadow-sm hover:bg-indigo-50 sm:px-8"
                      >
                        Sign up
                      </Link>
                      <Link
                        href="/explore"
                        className="flex items-center justify-center rounded-md border border-transparent bg-indigo-500 bg-opacity-60 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-opacity-70 sm:px-8"
                      >
                        Explore projects
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logo cloud */}
      <div className="bg-gray-50 dark:bg-gray-800 pt-12 sm:pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Trusted by developers across India
            </h2>
            <p className="mt-3 text-xl text-gray-600 dark:text-gray-300 sm:mt-4">
              Join our growing community of passionate Indian developers building innovative solutions together
            </p>
          </div>
        </div>
        <div className="mt-10 pb-12 sm:pb-16">
          <div className="relative">
            <div className="absolute inset-0 h-1/2 bg-gray-50 dark:bg-gray-800" />
            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-4xl">
                <div className="rounded-lg bg-white dark:bg-gray-700 shadow-lg sm:grid sm:grid-cols-3">
                  <div className="flex flex-col border-b border-gray-100 dark:border-gray-600 p-6 text-center sm:border-0 sm:border-r">
                    <p className="order-2 mt-2 text-lg font-medium leading-6 text-gray-500 dark:text-gray-300">Active Developers</p>
                    <p className="order-1 text-5xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">25,000+</p>
                  </div>
                  <div className="flex flex-col border-t border-b border-gray-100 dark:border-gray-600 p-6 text-center sm:border-0 sm:border-l sm:border-r">
                    <p className="order-2 mt-2 text-lg font-medium leading-6 text-gray-500 dark:text-gray-300">Projects Completed</p>
                    <p className="order-1 text-5xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">3,500+</p>
                  </div>
                  <div className="flex flex-col border-t border-gray-100 dark:border-gray-600 p-6 text-center sm:border-0 sm:border-l">
                    <p className="order-2 mt-2 text-lg font-medium leading-6 text-gray-500 dark:text-gray-300">Indian Cities</p>
                    <p className="order-1 text-5xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">50+</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature section */}
      <div className="bg-gray-50 dark:bg-gray-800 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">DevMatch</h2>
            <p className="mt-2 text-3xl font-bold leading-8 tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Connecting India&apos;s tech talent
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300 lg:mx-auto">
              From Bangalore to Delhi, Mumbai to Hyderabad - connect with developers across India, find exciting projects, and build your portfolio with real-world experience.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="pt-6">
                <div className="flow-root rounded-lg bg-white dark:bg-gray-700 px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center rounded-md bg-indigo-500 p-3 shadow-lg">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-5 text-lg font-medium text-gray-900 dark:text-white">Find the perfect team</h3>
                    <p className="mt-2 text-base text-gray-600 dark:text-gray-300">
                      Connect with Indian developers who have complementary skills and share your passion for building innovative solutions.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root rounded-lg bg-white dark:bg-gray-700 px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center rounded-md bg-indigo-500 p-3 shadow-lg">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 dark:text-white">Manage projects</h3>
                    <p className="mt-5 text-base text-gray-500 dark:text-gray-300">
                      Create and manage projects with task boards, member assignments, and real-time collaboration tools - perfect for distributed teams across India.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root rounded-lg bg-white dark:bg-gray-700 px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center rounded-md bg-indigo-500 p-3 shadow-lg">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 dark:text-white">Real-time chat</h3>
                    <p className="mt-5 text-base text-gray-500 dark:text-gray-300">
                      Communicate with team members in real-time, share ideas, and collaborate effectively even with teams across different cities in India.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How it works section */}
      <div className="bg-gray-50 py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold uppercase tracking-wide text-gray-100">How it works</h2>
            <p className="mt-2 text-3xl font-extrabold text-indigo-600 sm:text-4xl">
              From sign-up to successful collaboration
            </p>
            <p className="mt-4 text-lg text-gray-500">
              DevMatch simplifies the process of finding collaborators and building projects together for Indian developers.
            </p>
          </div>
          <div className="mt-16">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <div className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-indigo-500 text-white">
                  <span className="text-xl font-bold">1</span>
                </div>
                <p className="ml-16 text-lg font-medium leading-6 text-gray-200">Create your profile</p>
                <div className="mt-2 ml-16 text-base text-gray-500">
                  Sign up and complete your profile by adding your skills, experience, and highlighting your educational background from top Indian institutions.
                </div>
              </div>

              <div className="relative">
                <div className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-indigo-500 text-white">
                  <span className="text-xl font-bold">2</span>
                </div>
                <p className="ml-16 text-lg font-medium leading-6 text-gray-200">Discover opportunities</p>
                <div className="mt-2 ml-16 text-base text-gray-500">
                  Browse existing projects from Indian startups or create your own and invite other developers to join.
                </div>
              </div>

              <div className="relative">
                <div className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-indigo-500 text-white">
                  <span className="text-xl font-bold">3</span>
                </div>
                <p className="ml-16 text-lg font-medium leading-6 text-gray-200">Connect with developers</p>
                <div className="mt-2 ml-16 text-base text-gray-500">
                  Our matching algorithm will suggest Indian developers with complementary skills and interests for your project.
                </div>
              </div>

              <div className="relative">
                <div className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-indigo-500 text-white">
                  <span className="text-xl font-bold">4</span>
                </div>
                <p className="ml-16 text-lg font-medium leading-6 text-gray-200">Collaborate effectively</p>
                <div className="mt-2 ml-16 text-base text-gray-500">
                  Use our built-in tools to manage tasks, communicate, and track progress on your projects - designed for the Indian work style.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonial section */}
      <div className="bg-gray-50 dark:bg-gray-800 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Trusted by developers across India
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              See what our users have to say about their experience with DevMatch India
            </p>
          </div>
          <div className="mt-12 space-y-10 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 sm:space-y-0 lg:grid-cols-3 lg:gap-x-8">
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm">
              <p className="text-lg text-gray-600 dark:text-gray-300">
                &ldquo;DevMatch helped me connect with talented developers from across India for my fintech startup. Within days, I assembled a skilled team from Bangalore, Pune, and Delhi!&rdquo;
              </p>
              <div className="mt-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center">
                      <span className="text-white font-bold">HC</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Samiksha Agarwal
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Frontend Developer, Bangalore
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm">
              <p className="text-lg text-gray-600 dark:text-gray-300">
                &ldquo;The skills-based matching algorithm is spot on! I was matched with developers who perfectly complemented my technical skills for our AI-based education project for clients.&rdquo;
              </p>
              <div className="mt-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center">
                      <span className="text-white font-bold">AM</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Aditi Mishra
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Backend Engineer, Mumbai
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm">
              <p className="text-lg text-gray-600 dark:text-gray-300">
                &ldquo;As a developer in Hyderabad, I was able to collaborate with team members in Kolkata and Chennai. The project management tools made working across different cities seamless.&rdquo;
              </p>
              <div className="mt-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center">
                      <span className="text-white font-bold">MP</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Muskan Pandey
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Full Stack Developer, Hyderabad
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional testimonials */}
      <div className="bg-gray-100 dark:bg-gray-900 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Success stories from our community
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Indian developers are building amazing projects on DevMatch
            </p>
          </div>
          <div className="mt-12 space-y-10 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 sm:space-y-0 lg:grid-cols-4 lg:gap-x-8">
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-pink-600 flex items-center justify-center">
                  <span className="text-white font-bold">SS</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Sandhya D&apos;Souza</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">UI/UX Designer, Chennai</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                &ldquo;Found amazing developers for my educational app that teaches kids coding through games.&rdquo;
              </p>
            </div>

            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center">
                  <span className="text-white font-bold">AJ</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Janvi Tiwari</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Backend Developer, Pune</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                &ldquo;DevMatch connected me with a team that built a sustainable farming solution for rural India.&rdquo;
              </p>
            </div>

            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-orange-600 flex items-center justify-center">
                  <span className="text-white font-bold">PM</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Priya Verma</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Mobile Developer, Kolkata</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                &ldquo;Built a payment app that helps local businesses accept digital payments with low transaction fees.&rdquo;
              </p>
            </div>

            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold">CA</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Chaitanya Sharma</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">AI Engineer, Delhi</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                &ldquo;Our team created an AI model that predicts crop yields to help farmers plan better harvests.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-indigo-100 dark:bg-indigo-900">
        <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:flex lg:items-center lg:justify-between lg:py-16 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            <span className="block">
              {isAuthenticated ? "Ready to build India's next big innovation?" : "Ready to join India's tech revolution?"}
            </span>
            <span className="block text-indigo-600 dark:text-indigo-400">
              {isAuthenticated ? 'Create or join a project today.' : 'Join DevMatch India today.'}
            </span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            {isAuthenticated ? (
              <>
                <div className="inline-flex rounded-md shadow">
                  <Link
                    href="/project/create"
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-base font-medium text-white hover:bg-indigo-700"
                  >
                    Create project
                  </Link>
                </div>
                <div className="ml-3 inline-flex rounded-md shadow">
                  <Link
                    href="/explore"
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-white dark:bg-gray-800 px-5 py-3 text-base font-medium text-indigo-600 dark:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Explore projects
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="inline-flex rounded-md shadow">
                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-base font-medium text-white hover:bg-indigo-700"
                  >
                    Sign up
                  </Link>
                </div>
                <div className="ml-3 inline-flex rounded-md shadow">
                  <Link
                    href="/signin"
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-white dark:bg-gray-800 px-5 py-3 text-base font-medium text-indigo-600 dark:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Sign in
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
