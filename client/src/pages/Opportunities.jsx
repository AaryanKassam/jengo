import React, { useEffect, useState } from 'react';
import OpportunityCard from '../components/OpportunityCard';
import api from '../services/api';
import { normalizeOpportunity } from '../utils/apiTransform';
import './Opportunities.css';

const Opportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getOpportunities()
      .then((data) => {
        const list = (data.opportunities || []).map(normalizeOpportunity);
        setOpportunities(list);
      })
      .catch(() => setOpportunities([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="opportunities-page">
      <div className="opportunities-header">
        <div className="container">
          <h1>Volunteer Opportunities</h1>
          <p>Discover meaningful ways to make an impact in your community</p>
        </div>
      </div>
      <div className="opportunities-content">
        <div className="container">
          {loading ? (
            <div className="empty-state">
              <p>Loading opportunities…</p>
            </div>
          ) : opportunities.length === 0 ? (
            <div className="empty-state">
              <h3>No opportunities available</h3>
              <p>Check back soon for new volunteer opportunities!</p>
            </div>
          ) : (
            <div className="opportunities-grid">
              {opportunities.map((opp) => (
                <OpportunityCard key={opp.id} opportunity={opp} showApply={false} showStatus />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Opportunities;
