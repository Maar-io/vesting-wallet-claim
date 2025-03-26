import React from 'react';
import { StatCardProps } from '../../types';
import './StatCard.css';

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="stat-card loading">
        <div className="stat-card-header">
          <div className="stat-card-title"></div>
          <div className="stat-card-icon"></div>
        </div>
        <div className="stat-card-value"></div>
        <div className="stat-card-change"></div>
      </div>
    );
  }

  const getChangeClass = () => {
    if (!change) return 'neutral';
    return change.startsWith('+') 
      ? 'positive' 
      : change.startsWith('-') 
        ? 'negative' 
        : 'neutral';
  };

  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <h3 className="stat-card-title">{title}</h3>
        {icon && <span className="stat-card-icon">{icon}</span>}
      </div>
      <div className="stat-card-value">{value}</div>
      {change && (
        <div className={`stat-card-change ${getChangeClass()}`}>
          {change}
        </div>
      )}
    </div>
  );
};

export default StatCard;
