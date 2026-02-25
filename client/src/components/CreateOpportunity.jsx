import React, { useState } from 'react';
import api from '../services/api';
import { normalizeOpportunity } from '../utils/apiTransform';
import './CreateOpportunity.css';

function extractKeywords(text, max = 20) {
  const stop = new Set([
    'a','an','and','are','as','at','be','but','by','for','from','has','have','i','in','is','it','its','of','on',
    'or','our','so','that','the','their','they','this','to','was','we','were','with','you','your'
  ]);
  const tokens = (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 3 && !stop.has(t));
  const counts = new Map();
  for (const t of tokens) counts.set(t, (counts.get(t) || 0) + 1);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, max)
    .map(([k]) => k);
}

const CreateOpportunity = ({ onOpportunityCreated, onError }) => {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    skillsRequired: [],
    estimatedHours: '',
    deadline: '',
    location: ''
  });
  const [currentSkill, setCurrentSkill] = useState('');

  const categories = [
    'Grant Writing',
    'Social Media',
    'Outreach',
    'Event Planning',
    'Administrative',
    'Marketing',
    'Fundraising',
    'Other'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    const parts = currentSkill.split(/[,;\n]/).map((p) => p.trim()).filter(Boolean);
    if (parts.length === 0) return;
    const existing = new Set(formData.skillsRequired.map((s) => s.toLowerCase()));
    const toAdd = parts.filter((p) => !existing.has(p.toLowerCase()));
    if (toAdd.length > 0) {
      setFormData({
        ...formData,
        skillsRequired: [...formData.skillsRequired, ...toAdd]
      });
    }
    setCurrentSkill('');
  };

  const handlePasteSkills = (e) => {
    const pasted = e.clipboardData?.getData('text') || '';
    if (!pasted.trim()) return;
    const parts = pasted.split(/[,;\n]/).map((p) => p.trim()).filter(Boolean);
    if (parts.length > 1) {
      e.preventDefault();
      const existing = new Set(formData.skillsRequired.map((s) => s.toLowerCase()));
      const toAdd = parts.filter((p) => !existing.has(p.toLowerCase()));
      if (toAdd.length > 0) {
        setFormData({
          ...formData,
          skillsRequired: [...formData.skillsRequired, ...toAdd]
        });
        setCurrentSkill('');
      }
    }
  };

  const handleRemoveSkill = (skill) => {
    setFormData({
      ...formData,
      skillsRequired: formData.skillsRequired.filter(s => s !== skill)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        skillsRequired: formData.skillsRequired || [],
        estimatedHours: parseInt(formData.estimatedHours, 10),
        deadline: formData.deadline || undefined,
        location: formData.location || ''
      };
      const data = await api.createOpportunity(payload);
      if (data.opportunity) {
        const normalized = normalizeOpportunity(data.opportunity);
        onOpportunityCreated(normalized);
        setFormData({
          title: '',
          description: '',
          category: '',
          skillsRequired: [],
          estimatedHours: '',
          deadline: '',
          location: ''
        });
      } else {
        onError?.(data.message || 'Failed to create opportunity');
      }
    } catch (err) {
      onError?.(err?.message || 'Failed to create opportunity');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-opportunity">
      <h2>Create New Opportunity</h2>
      <form onSubmit={handleSubmit} className="opportunity-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Grant Writing Assistant"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the volunteer opportunity..."
            rows="5"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="location">Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., San Francisco, CA or Remote"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="estimatedHours">Estimated Hours *</label>
            <input
              type="number"
              id="estimatedHours"
              name="estimatedHours"
              value={formData.estimatedHours}
              onChange={handleChange}
              placeholder="e.g., 20"
              min="1"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="deadline">Application Deadline *</label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="skills">Required Skills</label>
          <div className="skills-input-group">
            <input
              type="text"
              id="skills"
              value={currentSkill}
              onChange={(e) => setCurrentSkill(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddSkill(e)}
              onPaste={handlePasteSkills}
              placeholder="Add a skill and press Enter (or paste comma-separated)"
            />
            <button type="button" onClick={handleAddSkill} className="btn-add-skill">
              Add
            </button>
          </div>
          <div className="skills-tags">
            {formData.skillsRequired.map((skill, index) => (
              <span key={index} className="skill-tag">
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="remove-skill"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create Opportunity'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateOpportunity;
