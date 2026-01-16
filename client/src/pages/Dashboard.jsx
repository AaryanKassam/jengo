import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import OpportunityCard from '../components/OpportunityCard';
import CreateOpportunity from '../components/CreateOpportunity';
import ApplicationCard from '../components/ApplicationCard';
import VolunteerApplicationCard from '../components/VolunteerApplicationCard';
import RoleSwitcher from '../components/RoleSwitcher';
import { mockOpportunities, mockApplications } from '../utils/mockData';
import './Dashboard.css';

const Dashboard = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [myOpportunities, setMyOpportunities] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [activeTab, setActiveTab] = useState('opportunities');
  const [viewRole, setViewRole] = useState('volunteer'); // 'volunteer' or 'nonprofit'
  const [currentUser, setCurrentUser] = useState(null);
  const [volunteerProfile, setVolunteerProfile] = useState({
    location: '',
    school: '',
    skillsInput: '',
    resume: '',
    volunteerForm: '',
    profilePhoto: ''
  });
  const [nonprofitProfile, setNonprofitProfile] = useState({
    location: '',
    organizationDescription: '',
    website: '',
    socialLinksInput: '',
    typicalVolunteerHours: '',
    logo: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Load user role
    const storedUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (storedUser?.role) {
      setViewRole(storedUser.role);
    }
    setCurrentUser(storedUser);

    const storedOpportunities = JSON.parse(localStorage.getItem('opportunities') || 'null');
    const initialOpportunities = Array.isArray(storedOpportunities) && storedOpportunities.length > 0
      ? storedOpportunities
      : mockOpportunities;
    setOpportunities(initialOpportunities);
    localStorage.setItem('opportunities', JSON.stringify(initialOpportunities));

    const storedApplications = JSON.parse(localStorage.getItem('applications') || 'null');
    const initialApplications = Array.isArray(storedApplications) && storedApplications.length > 0
      ? storedApplications
      : mockApplications;
    setApplications(initialApplications);
    localStorage.setItem('applications', JSON.stringify(initialApplications));
  }, [navigate]);

  useEffect(() => {
    if (!currentUser) return;
    const myApps = applications.filter((app) => app.volunteerId === currentUser.id);
    setMyApplications(myApps);

    const myOpps = opportunities.filter((opp) => opp.nonprofitId === currentUser.id);
    setMyOpportunities(myOpps);

    setVolunteerProfile({
      location: currentUser.location || '',
      school: currentUser.school || '',
      skillsInput: (currentUser.skills || []).join(', '),
      resume: currentUser.resume || '',
      volunteerForm: currentUser.volunteerForm || '',
      profilePhoto: currentUser.profilePhoto || ''
    });

    setNonprofitProfile({
      location: currentUser.location || '',
      organizationDescription: currentUser.organizationDescription || '',
      website: currentUser.website || '',
      socialLinksInput: (currentUser.socialLinks || []).join(', '),
      typicalVolunteerHours: currentUser.typicalVolunteerHours || '',
      logo: currentUser.logo || ''
    });
  }, [applications, opportunities, currentUser]);

  const handleRoleChange = (role) => {
    setViewRole(role);
    // Reset to appropriate default tab
    if (role === 'volunteer') {
      setActiveTab('opportunities');
    } else {
      setActiveTab('my-postings');
    }
  };

  const handleApply = (opportunityId) => {
    const opportunity = opportunities.find(opp => opp.id === opportunityId);
    if (!opportunity) return;
    if (opportunity.status === 'closed') {
      alert('This opportunity is closed.');
      return;
    }

    const volunteerId = currentUser?.id || 'vol1';
    const duplicate = applications.some(
      (app) => app.opportunityId === opportunityId && app.volunteerId === volunteerId
    );
    if (duplicate) {
      alert('You have already applied to this opportunity.');
      return;
    }

    const newApplication = {
      id: `app${Date.now()}`,
      opportunityId: opportunity.id,
      volunteerId,
      volunteerName: currentUser?.name || 'You',
      volunteerEmail: currentUser?.email || 'you@example.com',
      volunteerSchool: currentUser?.school || 'Your School',
      volunteerSkills: currentUser?.skills || ['General'],
      volunteerResume: currentUser?.resume || '',
      volunteerForm: currentUser?.volunteerForm || '',
      status: 'applied',
      appliedAt: new Date().toISOString(),
      opportunityTitle: opportunity.title
    };

    const updatedApplications = [...applications, newApplication];
    setApplications(updatedApplications);
    localStorage.setItem('applications', JSON.stringify(updatedApplications));
    alert(`Applied to ${opportunity.title}!`);
  };

  const handleOpportunityCreated = (newOpp) => {
    const updated = [...opportunities, newOpp];
    setOpportunities(updated);
    localStorage.setItem('opportunities', JSON.stringify(updated));
    setActiveTab('my-postings');
  };

  const handleAccept = (applicationId) => {
    const updated = applications.map(app => 
      app.id === applicationId 
        ? { ...app, status: 'accepted', reviewedAt: new Date().toISOString() }
        : app
    );
    setApplications(updated);
    localStorage.setItem('applications', JSON.stringify(updated));
    alert('Application accepted!');
  };

  const handleReject = (applicationId) => {
    const updated = applications.map(app => 
      app.id === applicationId 
        ? { ...app, status: 'rejected', reviewedAt: new Date().toISOString() }
        : app
    );
    setApplications(updated);
    localStorage.setItem('applications', JSON.stringify(updated));
    alert('Application rejected.');
  };

  const handleCloseOpportunity = (opportunityId) => {
    const updated = opportunities.map((opp) =>
      opp.id === opportunityId ? { ...opp, status: 'closed' } : opp
    );
    setOpportunities(updated);
    localStorage.setItem('opportunities', JSON.stringify(updated));
    alert('Opportunity closed.');
  };

  const handleVolunteerProfileSave = () => {
    if (!currentUser) return;
    const updatedUser = {
      ...currentUser,
      location: volunteerProfile.location,
      school: volunteerProfile.school,
      skills: volunteerProfile.skillsInput
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean),
      resume: volunteerProfile.resume,
      volunteerForm: volunteerProfile.volunteerForm,
      profilePhoto: volunteerProfile.profilePhoto
    };
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
    alert('Profile updated.');
  };

  const handleNonprofitProfileSave = () => {
    if (!currentUser) return;
    const updatedUser = {
      ...currentUser,
      location: nonprofitProfile.location,
      organizationDescription: nonprofitProfile.organizationDescription,
      website: nonprofitProfile.website,
      socialLinks: nonprofitProfile.socialLinksInput
        .split(',')
        .map((link) => link.trim())
        .filter(Boolean),
      typicalVolunteerHours: nonprofitProfile.typicalVolunteerHours,
      logo: nonprofitProfile.logo
    };
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
    alert('Organization profile updated.');
  };

  const renderVolunteerContent = () => {
    switch (activeTab) {
      case 'opportunities':
        return (
          <div className="opportunities-grid">
            {opportunities.map((opp) => (
              <OpportunityCard 
                key={opp.id} 
                opportunity={opp}
                onApply={() => handleApply(opp.id)}
                showStatus
              />
            ))}
          </div>
        );
      case 'saved':
        const savedIds = JSON.parse(localStorage.getItem('savedOpportunities') || '[]');
        const savedOpps = opportunities.filter(opp => savedIds.includes(opp.id));
        return savedOpps.length > 0 ? (
          <div className="opportunities-grid">
            {savedOpps.map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} showStatus />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No Opportunities</h3>
            <p>Save opportunities you're interested in to view them here.</p>
          </div>
        );
      case 'applications':
        return myApplications.length > 0 ? (
          <div className="applications-grid">
            {myApplications.map((app) => {
              const opp = opportunities.find(o => o.id === app.opportunityId);
              return (
                <VolunteerApplicationCard
                  key={app.id}
                  application={app}
                  opportunity={opp}
                />
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No Applications Yet</h3>
            <p>Start applying to opportunities to track your applications here.</p>
          </div>
        );
      case 'profile':
        return (
          <div className="profile-section">
            <h2>My Profile</h2>
            <div className="profile-form">
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={volunteerProfile.location}
                  onChange={(e) => setVolunteerProfile({ ...volunteerProfile, location: e.target.value })}
                  placeholder="City, State"
                />
              </div>
              <div className="form-group">
                <label>School</label>
                <input
                  type="text"
                  value={volunteerProfile.school}
                  onChange={(e) => setVolunteerProfile({ ...volunteerProfile, school: e.target.value })}
                  placeholder="Enter your school"
                />
              </div>
              <div className="form-group">
                <label>Skills</label>
                <input
                  type="text"
                  value={volunteerProfile.skillsInput}
                  onChange={(e) => setVolunteerProfile({ ...volunteerProfile, skillsInput: e.target.value })}
                  placeholder="Add your skills (comma separated)"
                />
              </div>
              <div className="form-group">
                <label>Resume (PDF Link)</label>
                <input
                  type="url"
                  value={volunteerProfile.resume}
                  onChange={(e) => setVolunteerProfile({ ...volunteerProfile, resume: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="form-group">
                <label>Volunteer Form (PDF Link)</label>
                <input
                  type="url"
                  value={volunteerProfile.volunteerForm}
                  onChange={(e) => setVolunteerProfile({ ...volunteerProfile, volunteerForm: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="form-group">
                <label>Profile Photo URL</label>
                <input
                  type="url"
                  value={volunteerProfile.profilePhoto}
                  onChange={(e) => setVolunteerProfile({ ...volunteerProfile, profilePhoto: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <button className="btn btn-primary" onClick={handleVolunteerProfileSave}>
                Save Profile
              </button>
            </div>
          </div>
        );
      default:
        return (
          <div className="empty-state">
            <h3>{activeTab}</h3>
            <p>This feature is coming soon.</p>
          </div>
        );
    }
  };

  const renderNonprofitContent = () => {
    switch (activeTab) {
      case 'create':
        return <CreateOpportunity onOpportunityCreated={handleOpportunityCreated} />;
      case 'my-postings':
        return myOpportunities.length > 0 ? (
          <div className="opportunities-grid">
            {myOpportunities.map((opp) => (
              <OpportunityCard
                key={opp.id}
                opportunity={opp}
                showApply={false}
                onClose={handleCloseOpportunity}
                showStatus
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No Opportunities Posted</h3>
            <p>Create your first opportunity to get started.</p>
            <button 
              className="btn btn-primary" 
              onClick={() => setActiveTab('create')}
              style={{ marginTop: '16px' }}
            >
              Create Opportunity
            </button>
          </div>
        );
      case 'applicants':
        // Show applications for nonprofit's opportunities
        const myOppIds = myOpportunities.map(opp => opp.id);
        const relevantApps = applications.filter(app => myOppIds.includes(app.opportunityId));
        return relevantApps.length > 0 ? (
          <div className="applications-grid">
            {relevantApps.map((app) => (
              <ApplicationCard
                key={app.id}
                application={app}
                onAccept={handleAccept}
                onReject={handleReject}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No Applications Yet</h3>
            <p>Applications for your opportunities will appear here.</p>
          </div>
        );
      case 'profile':
        return (
          <div className="profile-section">
            <h2>Organization Profile</h2>
            <div className="profile-form">
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={nonprofitProfile.location}
                  onChange={(e) => setNonprofitProfile({ ...nonprofitProfile, location: e.target.value })}
                  placeholder="City, State"
                />
              </div>
              <div className="form-group">
                <label>Organization Description</label>
                <textarea
                  rows="4"
                  value={nonprofitProfile.organizationDescription}
                  onChange={(e) => setNonprofitProfile({ ...nonprofitProfile, organizationDescription: e.target.value })}
                  placeholder="Describe your organization..."
                />
              </div>
              <div className="form-group">
                <label>Website</label>
                <input
                  type="url"
                  value={nonprofitProfile.website}
                  onChange={(e) => setNonprofitProfile({ ...nonprofitProfile, website: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="form-group">
                <label>Social Links</label>
                <input
                  type="text"
                  value={nonprofitProfile.socialLinksInput}
                  onChange={(e) => setNonprofitProfile({ ...nonprofitProfile, socialLinksInput: e.target.value })}
                  placeholder="Comma-separated URLs"
                />
              </div>
              <div className="form-group">
                <label>Typical Volunteer Hours</label>
                <input
                  type="text"
                  value={nonprofitProfile.typicalVolunteerHours}
                  onChange={(e) => setNonprofitProfile({ ...nonprofitProfile, typicalVolunteerHours: e.target.value })}
                  placeholder="e.g., 10-20 hours per week"
                />
              </div>
              <div className="form-group">
                <label>Organization Logo URL</label>
                <input
                  type="url"
                  value={nonprofitProfile.logo}
                  onChange={(e) => setNonprofitProfile({ ...nonprofitProfile, logo: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <button className="btn btn-primary" onClick={handleNonprofitProfileSave}>
                Save Profile
              </button>
            </div>
          </div>
        );
      default:
        return (
          <div className="empty-state">
            <h3>{activeTab}</h3>
            <p>This feature is coming soon.</p>
          </div>
        );
    }
  };

  const getTitle = () => {
    if (viewRole === 'volunteer') {
      switch (activeTab) {
        case 'opportunities': return 'Volunteer Opportunities';
        case 'saved': return 'Saved Opportunities';
        case 'applications': return 'My Applications';
        case 'profile': return 'My Profile';
        default: return 'Dashboard';
      }
    } else {
      switch (activeTab) {
        case 'create': return 'Create Opportunity';
        case 'my-postings': return 'My Opportunities';
        case 'applicants': return 'Applicants';
        case 'profile': return 'Organization Profile';
        default: return 'Dashboard';
      }
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        role={viewRole}
      />
      <div className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-left">
            <h1 className="dashboard-title">{getTitle()}</h1>
          </div>
          <div className="header-right">
            <RoleSwitcher 
              currentRole={viewRole} 
              onRoleChange={handleRoleChange}
            />
            <div className="user-menu">
              <div className="user-avatar">
                {currentUser?.name ? currentUser.name.charAt(0) : 'S'}
              </div>
              <span className="dropdown-arrow">▼</span>
            </div>
          </div>
        </header>
        <div className="dashboard-content">
          {viewRole === 'volunteer' ? renderVolunteerContent() : renderNonprofitContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
