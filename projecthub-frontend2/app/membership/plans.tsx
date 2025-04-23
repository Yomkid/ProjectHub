// app/constants/plans.ts

export const PLANS = {
    yearly: [
      {
        id: 'basic',
        title: 'Basic Access',
        yearly: 20000,
        monthly: 20000 / 12,
        note: 'For learners who need quick access to real-world project resources.',
        features: [
          'Access curated real-life project writeups',
          'Download documentation (PDF only)',
          'Plagiarism-checked project materials',
          'Offline downloads enabled',
          'Join the ProjectHub learner community',
          'Limited access to AI tools (AI Checker Lite)',
        ],
      },
      {
        id: 'student',
        title: 'Student Access',
        yearly: 30000,
        monthly: 30000 / 12,
        note: 'Recommended for students and developers who want everything unlocked.',
        prevpackage: 'All Basic Access features',
        features: [
          'Full access to all project categories & levels',
          'Download source code, documentation, and media assets',
          'Access to Humanizer & AI Checker Pro tools',
          'Request custom projects on demand',
          'Audio summaries for premium projects',
          'Unlimited downloads & updates',
        ],
      },
      {
        id: 'pro',
        title: 'Contributor Pro',
        yearly: 60000,
        monthly: 60000 / 12,
        note: 'Ideal for writers, educators, and tech experts who want to earn and grow.',
        prevpackage: 'All Student Access features',
        features: [
          'All Student Access features',
          'Upload & monetize your own projects',
          'Get certified with a verification badge',
          'Track views, downloads, and engagement stats',
          'Customizable public profile & contributor dashboard',
          'Earn directly from downloads & referrals',
          'Priority support & early feature access',
        ],
      },
    ],
  };
  