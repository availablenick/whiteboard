import React, { useState, useEffect, useRef } from 'react';
import './Pointer.scss';

function Pointer({ userId, x, y, color = '#000' }) {
  const markerRef = useRef(null);
  const [style, setStyle] = useState({});

  useEffect(() => {
    if (markerRef.current) {
      const marker = markerRef.current;
      setStyle({
        left: x - marker.offsetLeft - marker.offsetWidth / 2,
        top: y - marker.offsetTop - marker.offsetHeight / 2,
      });
    }
  }, [x, y]);

  return (
    <div className="user-pointer" style={style}>
      <span className="label" style={{ color }}>
        User {userId}
      </span>
      <span className="marker" ref={markerRef} style={{ background: color }} />
    </div>
  );
}

export default Pointer;
