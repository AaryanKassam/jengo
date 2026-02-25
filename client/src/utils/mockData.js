// Mock data for prototype features (e.g. demo flows)
// Opportunities, applications, and volunteers now come from MongoDB

export const mockUser = {
  id: '1',
  name: 'Demo User',
  username: 'demouser',
  email: 'demo@example.com',
  role: 'volunteer',
  credits: 179,
  location: 'San Francisco, CA',
  profilePhoto: '',
  school: '',
  skills: [],
  resume: '',
  volunteerForm: ''
};

export const mockNonprofit = {
  id: 'np1',
  name: 'Community Health Foundation',
  username: 'communityhealth',
  email: 'info@communityhealth.org',
  role: 'nonprofit',
  location: 'San Francisco, CA',
  organizationDescription: 'Dedicated to improving community health through education and outreach programs.',
  website: 'https://communityhealth.org',
  socialLinks: ['https://linkedin.com/company/communityhealth'],
  typicalVolunteerHours: '10-20 hours per week',
  logo: null
};
