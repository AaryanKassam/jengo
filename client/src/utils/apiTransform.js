// Transform API responses to frontend format (id, company, etc.)

export function normalizeOpportunity(opp) {
  if (!opp) return null;
  const nonprofit = opp.nonprofit || {};
  return {
    id: opp._id?.toString() || opp.id,
    _id: opp._id,
    title: opp.title,
    description: opp.description,
    category: opp.category,
    skillsRequired: opp.skillsRequired || [],
    keywords: opp.keywords || [],
    estimatedHours: opp.estimatedHours,
    deadline: opp.deadline ? (typeof opp.deadline === 'string' ? opp.deadline : new Date(opp.deadline).toISOString().slice(0, 10)) : '',
    location: opp.location || '',
    workMode: opp.workMode || (opp.location?.toLowerCase() === 'remote' ? 'Remote' : 'In person'),
    status: opp.status || 'open',
    company: nonprofit.name || 'Organization',
    logo: nonprofit.organizationLogo || '',
    nonprofitId: nonprofit._id?.toString() || opp.nonprofit?.toString?.() || opp.nonprofitId,
    postedTime: opp.createdAt ? formatPostedTime(opp.createdAt) : 'Recently',
    createdAt: opp.createdAt
  };
}

export function normalizeApplication(app) {
  if (!app) return null;
  const volunteer = app.volunteer || {};
  const opportunity = app.opportunity || {};
  return {
    id: app._id?.toString() || app.id,
    _id: app._id,
    opportunityId: opportunity._id?.toString() || app.opportunity?.toString?.() || app.opportunityId,
    volunteerId: volunteer._id?.toString() || app.volunteer?.toString?.() || app.volunteerId,
    volunteerName: volunteer.name || '',
    volunteerEmail: volunteer.email || '',
    volunteerSchool: volunteer.school || '',
    volunteerSkills: volunteer.skills || [],
    volunteerInterests: volunteer.interests || [],
    volunteerProfilePhoto: volunteer.profilePhoto || '',
    volunteerPitchVideoUrl: volunteer.pitchVideoUrl || '',
    volunteerResume: volunteer.resume || '',
    volunteerForm: volunteer.volunteerForm || '',
    status: app.status || 'applied',
    appliedAt: app.createdAt,
    opportunityTitle: opportunity.title || ''
  };
}

function formatPostedTime(date) {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return d.toLocaleDateString();
}
