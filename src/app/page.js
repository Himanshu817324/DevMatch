import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative">
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gray-100" />
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="relative shadow-xl sm:overflow-hidden sm:rounded-2xl">
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 mix-blend-multiply" />
            </div>
            <div className="relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8">
              <h1 className="text-center text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                <span className="block text-white">Find your perfect</span>
                <span className="block text-indigo-200">developer match</span>
              </h1>
              <p className="mx-auto mt-6 max-w-lg text-center text-xl text-indigo-100 sm:max-w-3xl">
                Connect with developers who share your passion and complement your skills.
                Build amazing projects together and grow your network.
              </p>
              <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
                <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
                  <Link
                    href="/signup"
                    className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-indigo-700 shadow-sm hover:bg-indigo-50 sm:px-8"
                  >
                    Get started
                  </Link>
                  <Link
                    href="/explore"
                    className="flex items-center justify-center rounded-md border border-transparent bg-indigo-500 bg-opacity-60 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-opacity-70 sm:px-8"
                  >
                    Explore projects
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats section */}
      <div className="bg-gray-50 pt-12 sm:pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Trusted by developers worldwide
            </h2>
            <p className="mt-3 text-xl text-gray-500 sm:mt-4">
              Join our growing community of passionate developers building amazing projects together
            </p>
          </div>
        </div>
        <div className="mt-10 pb-12 sm:pb-16">
          <div className="relative">
            <div className="absolute inset-0 h-1/2 bg-gray-50" />
            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-4xl">
                <dl className="rounded-lg bg-white shadow-lg sm:grid sm:grid-cols-3">
                  <div className="flex flex-col border-b border-gray-100 p-6 text-center sm:border-0 sm:border-r">
                    <dt className="order-2 mt-2 text-lg font-medium leading-6 text-gray-500">Developers</dt>
                    <dd className="order-1 text-5xl font-bold tracking-tight text-indigo-600">2,500+</dd>
                  </div>
                  <div className="flex flex-col border-t border-b border-gray-100 p-6 text-center sm:border-0 sm:border-l sm:border-r">
                    <dt className="order-2 mt-2 text-lg font-medium leading-6 text-gray-500">Projects</dt>
                    <dd className="order-1 text-5xl font-bold tracking-tight text-indigo-600">1,000+</dd>
                  </div>
                  <div className="flex flex-col border-t border-gray-100 p-6 text-center sm:border-0 sm:border-l">
                    <dt className="order-2 mt-2 text-lg font-medium leading-6 text-gray-500">Successful Matches</dt>
                    <dd className="order-1 text-5xl font-bold tracking-tight text-indigo-600">5,000+</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base font-semibold uppercase tracking-wide text-indigo-600">DevMatch</h2>
            <p className="mt-2 text-3xl font-bold leading-8 tracking-tight text-gray-900 sm:text-4xl">
              A better way to collaborate on projects
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Connect with developers, find exciting projects, and build your portfolio with real-world experience.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="pt-6">
                <div className="flow-root rounded-lg bg-gray-50 px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center rounded-md bg-indigo-500 p-3 shadow-lg">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900">Match with developers</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Find developers with complementary skills who are interested in similar projects and collaborate with them.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root rounded-lg bg-gray-50 px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center rounded-md bg-indigo-500 p-3 shadow-lg">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900">Manage projects</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Create and manage projects with task boards, member assignments, and real-time collaboration tools.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root rounded-lg bg-gray-50 px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center rounded-md bg-indigo-500 p-3 shadow-lg">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900">Real-time chat</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Communicate with team members in real-time, share ideas, and stay in sync with your project collaborators.
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
            <h2 className="text-base font-semibold uppercase tracking-wide text-indigo-600">How it works</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              From sign-up to successful collaboration
            </p>
            <p className="mt-4 text-lg text-gray-500">
              DevMatch simplifies the process of finding collaborators and building projects together.
            </p>
          </div>
          <div className="mt-16">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <div className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-indigo-500 text-white">
                  <span className="text-xl font-bold">1</span>
                </div>
                <p className="ml-16 text-lg font-medium leading-6 text-gray-900">Create your profile</p>
                <div className="mt-2 ml-16 text-base text-gray-500">
                  Sign up and complete your profile by adding your skills, experience, and interests.
                </div>
              </div>

              <div className="relative">
                <div className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-indigo-500 text-white">
                  <span className="text-xl font-bold">2</span>
                </div>
                <p className="ml-16 text-lg font-medium leading-6 text-gray-900">Discover opportunities</p>
                <div className="mt-2 ml-16 text-base text-gray-500">
                  Browse existing projects or create your own and invite other developers to join.
                </div>
              </div>

              <div className="relative">
                <div className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-indigo-500 text-white">
                  <span className="text-xl font-bold">3</span>
                </div>
                <p className="ml-16 text-lg font-medium leading-6 text-gray-900">Connect with developers</p>
                <div className="mt-2 ml-16 text-base text-gray-500">
                  Our matching algorithm will suggest developers with complementary skills and interests.
                </div>
              </div>

              <div className="relative">
                <div className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-indigo-500 text-white">
                  <span className="text-xl font-bold">4</span>
                </div>
                <p className="ml-16 text-lg font-medium leading-6 text-gray-900">Collaborate effectively</p>
                <div className="mt-2 ml-16 text-base text-gray-500">
                  Use our built-in tools to manage tasks, communicate, and track progress on your projects.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials section */}
      <div className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Trusted by developers worldwide
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              See what our users have to say about their experience with DevMatch
            </p>
          </div>
          <div className="mt-12 space-y-10 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 sm:space-y-0 lg:grid-cols-3 lg:gap-x-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <p className="text-lg text-gray-500">
                &ldquo;DevMatch made it easy for me to find collaborators for my open-source project. Within days, I had a team of talented developers working together!&rdquo;
              </p>
              <div className="mt-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center">
                      <span className="text-white font-bold">MK</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      Michael Klein
                    </p>
                    <p className="text-sm text-gray-500">
                      Frontend Developer
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <p className="text-lg text-gray-500">
                &ldquo;The skills-based matching algorithm is spot on! I found developers who perfectly complemented my technical abilities.&rdquo;
              </p>
              <div className="mt-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center">
                      <span className="text-white font-bold">SJ</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      Sarah Johnson
                    </p>
                    <p className="text-sm text-gray-500">
                      Backend Engineer
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <p className="text-lg text-gray-500">
                &ldquo;The project management tools and real-time chat make collaboration seamless, even with team members across different time zones.&rdquo;
              </p>
              <div className="mt-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center">
                      <span className="text-white font-bold">DP</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      David Park
                    </p>
                    <p className="text-sm text-gray-500">
                      Full Stack Developer
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-indigo-50">
        <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:flex lg:items-center lg:justify-between lg:py-16 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">Ready to start collaborating?</span>
            <span className="block text-indigo-600">Join DevMatch today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
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
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-indigo-600 hover:bg-gray-50"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
