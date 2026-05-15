import React from 'react';

export default function PracticalSkeleton() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-thumb"></div>
      <div className="skeleton-content">
        <div className="skeleton-header">
          <div className="skeleton-badge"></div>
          <div className="skeleton-badge wide"></div>
        </div>
        <div className="skeleton-title"></div>
        <div className="skeleton-footer">
          <div className="skeleton-meta"></div>
          <div className="skeleton-meta"></div>
        </div>
      </div>
    </div>
  );
}
