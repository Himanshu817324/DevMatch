'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// List of skills to choose from
const COMMON_SKILLS = [
  'JavaScript', 'TypeScript', 'React', 'Next.js', 'Vue.js', 'Angular',
  'Node.js', 'Express', 'Python', 'Django', 'Flask', 'Java', 'Spring',
  'PHP', 'Laravel', 'Ruby', 'Rails', 'C#', '.NET', 'Go', 'Rust',
  'HTML', 'CSS', 'Tailwind CSS', 'Bootstrap', 'SASS', 'MongoDB',
  'PostgreSQL', 'MySQL', 'Redis', 'GraphQL', 'REST API', 'Docker',
  'Kubernetes', 'AWS', 'Azure', 'Google Cloud', 'Firebase', 'Git',
  'CI/CD', 'TDD', 'UI/UX Design', 'Mobile Development', 'React Native'
];

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form fields
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [twitter, setTwitter] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  // Check if user already has a profile with skills and bio
  useEffect(() => {
    const checkProfile = async () => {
      if (status === 'authenticated' && session?.user?.id) {
        try {
          const response = await fetch(`/api/users/${session.user.id}`);
          if (response.ok) {
            const data = await response.json();
            const user = data.user;

            // If user already has completed profile, redirect to dashboard
            if ((user.skills && user.skills.length > 0) && user.bio) {
              router.push('/dashboard');
            } else {
              // Pre-fill form fields if they exist
              setTitle(user.title || '');
              setBio(user.bio || '');
              setGithub(user.links?.github || '');
              setLinkedin(user.links?.linkedin || '');
              setPortfolio(user.links?.portfolio || '');
              setTwitter(user.links?.twitter || '');
              setSelectedSkills(user.skills || []);
            }
          }
        } catch (err) {
          console.error('Error checking profile:', err);
        }
      }
    };

    checkProfile();
  }, [status, session, router]);

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1 && selectedSkills.length === 0) {
      setError('Please select at least one skill');
      return;
    }

    setError('');
    setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`/api/users/${session.user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          bio,
          skills: selectedSkills,
          links: {
            github: github ? `https://github.com/${github}` : '',
            linkedin: linkedin ? `https://linkedin.com/in/${linkedin}` : '',
            portfolio,
            twitter: twitter ? `https://twitter.com/${twitter}` : '',
          },
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update profile');
      }

      // Redirect to dashboard after successful onboarding
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Complete your profile
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Let&apos;s set up your profile so you can start collaborating
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-gray-500">
                Step {currentStep} of 2
              </span>
              <span className="text-xs font-medium text-gray-500">
                {currentStep === 1 ? 'Skills' : 'Profile Information'}
              </span>
            </div>
            <div className="mt-2 h-2 bg-gray-200 rounded-full">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 2) * 100}%` }}
              ></div>
            </div>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
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
          )}

          <form>
            {currentStep === 1 && (
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                  What are your skills?
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Select the technologies and skills you&apos;re proficient in. This helps us match you with relevant projects.
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {COMMON_SKILLS.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${selectedSkills.includes(skill)
                        ? 'bg-indigo-100 text-indigo-800 border-2 border-indigo-500'
                        : 'bg-gray-100 text-gray-800 border-2 border-transparent hover:bg-gray-200'
                        }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>

                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Selected skills ({selectedSkills.length}):</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSkills.length > 0 ? (
                      selectedSkills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => toggleSkill(skill)}
                            className="ml-1.5 inline-flex flex-shrink-0 h-4 w-4 rounded-full text-indigo-400 hover:text-indigo-600 focus:outline-none focus:text-indigo-500"
                          >
                            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">No skills selected</span>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                  About you
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Tell us a bit about yourself to help others get to know you.
                </p>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Professional title
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Full Stack Developer"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                      Bio
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="bio"
                        rows={3}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell us about yourself, your experience, and what you're looking for"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-700">Social profiles (optional)</h4>

                    <div>
                      <label htmlFor="github" className="block text-sm font-medium text-gray-700">
                        GitHub username
                      </label>
                      <div className="mt-1">
                        <div className="flex rounded-md shadow-sm">
                          <span className="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                            github.com/
                          </span>
                          <input
                            type="text"
                            id="github"
                            value={github}
                            onChange={(e) => setGithub(e.target.value)}
                            placeholder="username"
                            className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
                        LinkedIn username
                      </label>
                      <div className="mt-1">
                        <div className="flex rounded-md shadow-sm">
                          <span className="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                            linkedin.com/in/
                          </span>
                          <input
                            type="text"
                            id="linkedin"
                            value={linkedin}
                            onChange={(e) => setLinkedin(e.target.value)}
                            placeholder="username"
                            className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="portfolio" className="block text-sm font-medium text-gray-700">
                        Portfolio website
                      </label>
                      <div className="mt-1">
                        <input
                          type="url"
                          id="portfolio"
                          value={portfolio}
                          onChange={(e) => setPortfolio(e.target.value)}
                          placeholder="https://example.com"
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="twitter" className="block text-sm font-medium text-gray-700">
                        Twitter username
                      </label>
                      <div className="mt-1">
                        <div className="flex rounded-md shadow-sm">
                          <span className="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                            twitter.com/
                          </span>
                          <input
                            type="text"
                            id="twitter"
                            value={twitter}
                            onChange={(e) => setTwitter(e.target.value)}
                            placeholder="username"
                            className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting || !bio.trim()}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70"
                    >
                      {isSubmitting ? 'Saving...' : 'Complete Profile'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
} 