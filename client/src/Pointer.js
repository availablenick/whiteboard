import React from 'react';
import './Pointer.scss';

function Pointer({ userId, x, y, color = '#000' }) {
  return (
    <div
      className="user-pointer"
      style={{ left: x, top: y }}
    >
      <span className="label" style={{ color }}>
        User {userId}
      </span>
      <span className="marker" style={{ background: color }} />
    </div>
  );
}

export default Pointer;
