import React from 'react';
import './MysteryCard.css';

const MysteryCard = ({ title, description }) => (
  <div className="mystery-card">
    <h2 className="mystery-title">{title}</h2>
    <p className="mystery-description">{description}</p>
  </div>
);

export default MysteryCard;
