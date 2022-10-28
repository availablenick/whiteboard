import React from 'react';
import Circle from './Circle';
import Rectangle from './Rectangle';
import Segment from './Segment';

function ShapeSelector({ shape, x, y, config, setShapeState }) {
  switch (shape) {
    case 'circle':
      return (
        <Circle x={x} y={y} config={config} setShapeState={setShapeState} />
      );
    case 'rectangle':
      return (
        <Rectangle x={x} y={y} config={config} setShapeState={setShapeState} />
      );
    case 'segment':
      return (
        <Segment x={x} y={y} config={config} setShapeState={setShapeState} />
      );
    default:
      return <></>;
  }
}

export default ShapeSelector;
