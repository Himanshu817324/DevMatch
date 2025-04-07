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
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Complete your profile
        </h2>
        <p className="mt-2 text-center text-sm text-gray-300">
          Let&apos;s set up your profile so you can start collaborating
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-gray-300">
                Step {currentStep} of 2
              </span>
              <span className="text-xs font-medium text-gray-300">
                {currentStep === 1 ? 'Skills' : 'Profile Information'}
              </span>
            </div>
            <div className="mt-2 h-2 bg-gray-700 rounded-full">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 2) * 100}%` }}
              ></div>
            </div>
          </div>

          {error && (
            <div className="mb-4 bg-red-900 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form>
            {currentStep === 1 && (
              <div>
                <h3 className="text-lg font-medium leading-6 text-white mb-4">
                  What are your skills?
                </h3>
                <p className="text-sm text-gray-300 mb-4">
                  Select the technologies and skills you&apos;re proficient in. This helps us match you with relevant projects.
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {COMMON_SKILLS.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${selectedSkills.includes(skill)
                        ? 'bg-indigo-500 text-white border-2 border-white'
                        : 'bg-gray-700 text-white border-2 border-gray-500 hover:border-white hover:bg-gray-600'
                        }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>

                <div className="mt-4">
                  <p className="text-sm font-medium text-white mb-2">Selected skills ({selectedSkills.length}):</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSkills.length > 0 ? (
                      selectedSkills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500 text-white"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => toggleSkill(skill)}
                            className="ml-1.5 inline-flex flex-shrink-0 h-4 w-4 rounded-full text-white hover:text-red-200 focus:outline-none focus:text-red-300"
                          >
                            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-300">No skills selected</span>
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
                <h3 className="text-lg font-medium leading-6 text-white mb-4">
                  About you
                </h3>
                <p className="text-sm text-gray-300 mb-4">
                  Tell us a bit about yourself to help others get to know you.
                </p>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                      Professional title
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 bg-gray-700 text-white rounded-md"
                        placeholder="e.g. Frontend Developer"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-300">
                      Bio
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="bio"
                        name="bio"
                        rows={4}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 bg-gray-700 text-white rounded-md"
                        placeholder="Tell others about yourself, your experience, and what you're looking for"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-300">Social profiles (optional)</h4>

                    <div>
                      <label htmlFor="github" className="block text-sm font-medium text-gray-300">
                        GitHub username
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-600 bg-gray-700 text-gray-300 sm:text-sm">
                          github.com/
                        </span>
                        <input
                          type="text"
                          id="github"
                          name="github"
                          value={github}
                          onChange={(e) => setGithub(e.target.value)}
                          className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-600 bg-gray-700 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="linkedin" className="block text-sm font-medium text-gray-300">
                        LinkedIn username
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-600 bg-gray-700 text-gray-300 sm:text-sm">
                          linkedin.com/in/
                        </span>
                        <input
                          type="text"
                          id="linkedin"
                          name="linkedin"
                          value={linkedin}
                          onChange={(e) => setLinkedin(e.target.value)}
                          className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-600 bg-gray-700 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="portfolio" className="block text-sm font-medium text-gray-300">
                        Portfolio website
                      </label>
                      <div className="mt-1">
                        <input
                          type="url"
                          id="portfolio"
                          name="portfolio"
                          value={portfolio}
                          onChange={(e) => setPortfolio(e.target.value)}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 bg-gray-700 text-white rounded-md"
                          placeholder="https://yourportfolio.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="twitter" className="block text-sm font-medium text-gray-300">
                        Twitter username
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-600 bg-gray-700 text-gray-300 sm:text-sm">
                          twitter.com/
                        </span>
                        <input
                          type="text"
                          id="twitter"
                          name="twitter"
                          value={twitter}
                          onChange={(e) => setTwitter(e.target.value)}
                          className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-600 bg-gray-700 text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="inline-flex items-center px-4 py-2 border border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
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