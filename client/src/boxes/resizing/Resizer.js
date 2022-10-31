import React from 'react';
import resize from './handler';
import './Resizer.scss';

function Resizer({
  position, boxMeasurements, setStyle, heightLowerBound, widthLowerBound,
}) {
  const resizeParentBox = (event) => {
    event.preventDefault();
    event.persist();
    event.stopPropagation();

    document.onmousemove = (mouseMoveEvent) => {
      resize(
        position,
        mouseMoveEvent,
        boxMeasurements,
        setStyle,
        heightLowerBound,
        widthLowerBound,
      );
    };

    document.onmouseup = () => {
      document.onmousemove = null;
      document.onmouseup = null;
    };
  };

  return <div className={`res ${position}`} onMouseDown={resizeParentBox} />;
}

export default Resizer;
