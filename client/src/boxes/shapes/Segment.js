import React, { useState, useEffect, useRef } from 'react';
import createCanvasChangeEvent from '../../global/helpers';
import { calculateAngle, calculateDistance } from './helpers';
import './Segment.scss';

const stages = {
  POSITIONING: 0,
  RESHAPING: 1,
  SHAPING: 2,
};

function Segment({ config, x, y, setShapeState }) {
  const canvas = document.getElementById('canvas');
  const segmentRef = useRef(null);
  const initialStyle = {
    left: '-500px',
    top: '-500px',
  };

  const [style, setStyle] = useState(initialStyle);
  const [state, setState] = useState({
    stage: stages.SHAPING,
    fixedPoint: { x, y },
    fixedSide: 'left',
  });

  useEffect(() => {
    const newStyle = {
      background: config.drawing.color,
      left: `${x}px`,
      top: `${y}px`,
      transformOrigin: 'left center',
      width: 0,
    };

    const segmentShape = segmentRef.current;
    setStyle(newStyle);

    return () => {
      document.onmousemove = null;
      document.onmouseup = null;

      const ctx = canvas.getContext('2d');
      const leftRect = segmentShape.getElementsByClassName('left')[0].getBoundingClientRect();
      const rightRect = segmentShape.getElementsByClassName('right')[0].getBoundingClientRect();
      ctx.fillStyle = config.drawing.color;
      ctx.strokeStyle = config.drawing.color;
      ctx.lineWidth = 4;

      const x1 = leftRect.x + leftRect.width / 2 - canvas.offsetLeft;
      const y1 = leftRect.y + leftRect.height / 2 - canvas.offsetTop;
      const x2 = rightRect.x + rightRect.width / 2 - canvas.offsetLeft;
      const y2 = rightRect.y + rightRect.height / 2 - canvas.offsetTop;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.closePath();

      canvas.dispatchEvent(createCanvasChangeEvent());
    };
  }, []);

  useEffect(() => {
    if (isChangingShape(state.stage)) {
      const newEvent = new MouseEvent('mousedown', { bubbles: true });
      segmentRef.current.dispatchEvent(newEvent);
    } else {
      setStyle({
        ...style,
        cursor: 'move',
      });

      const removeShape = (event) => {
        if (event.target === segmentRef.current) {
          return;
        }

        setShapeState({
          isShaping: false,
        });
      };

      document.addEventListener('click', removeShape);
      return () => {
        document.removeEventListener('click', removeShape);
      };
    }

    return () => {};
  }, [state]);

  const handleMouseDown = (mouseDownEvent) => {
    mouseDownEvent.preventDefault();
    if (isChangingShape(state.stage)) {
      document.onmousemove = (mouseMoveEvent) => {
        mouseMoveEvent.stopPropagation();
        const p = { x: mouseMoveEvent.clientX, y: mouseMoveEvent.clientY };
        clamp(p, canvas.getBoundingClientRect());
        const width = calculateDistance(state.fixedPoint, p);
        let angle = calculateAngle(state.fixedPoint, p);
        if (state.fixedSide === 'right') {
          angle = -(180 - angle);
        }

        setStyle((prev) => ({
          ...prev,
          transform: `rotate(${angle}deg)`,
          width: `${width}px`,
        }));
      };
    } else {
      const xShift = mouseDownEvent.clientX - segmentRef.current.offsetLeft;
      const yShift = mouseDownEvent.clientY - segmentRef.current.offsetTop;
      document.onmousemove = (mouseMoveEvent) => {
        const p = {
          x: mouseMoveEvent.clientX - xShift,
          y: mouseMoveEvent.clientY - yShift,
        };

        clamp(p, canvas.getBoundingClientRect());
        setStyle((prev) => ({
          ...prev,
          left: `${p.x}px`,
          top: `${p.y}px`,
        }));
      };
    }

    document.onmouseup = () => {
      document.onmousemove = null;
      document.onmouseup = null;
      if (isChangingShape(state.stage)) {
        setState({
          ...state,
          stage: stages.POSITIONING,
        });
      }
    };
  };

  const positions = ['left', 'right'];
  const resizers = positions.map((position) => (
    <Resizer
      key={position}
      position={position}
      segmentRect={segmentRef.current ? segmentRef.current.getBoundingClientRect() : {}}
      setStyle={setStyle}
      setState={setState}
    />
  ));

  return (
    <div
      className="segment-shape"
      style={style}
      ref={segmentRef}
      onMouseDown={handleMouseDown}
    >
      {(state.stage === stages.POSITIONING || state.stage === stages.RESHAPING) && resizers}
    </div>
  );
}

function isChangingShape(stage) {
  return stage === stages.SHAPING || stage === stages.RESHAPING;
}

function clamp(p, bounds) {
  if (p.x < bounds.left) {
    p.x = bounds.left;
  } else if (p.x > bounds.right) {
    p.x = bounds.right;
  }

  if (p.y < bounds.top) {
    p.y = bounds.top;
  } else if (p.y > bounds.bottom) {
    p.y = bounds.bottom;
  }
}

function Resizer({ position, segmentRect, setStyle, setState }) {
  const resize = (mouseDownEvent) => {
    mouseDownEvent.preventDefault();
    const resizerRect = mouseDownEvent.target.getBoundingClientRect();
    let fixedPointX = -1;
    if (isAtLeftEnd(resizerRect, segmentRect)) {
      fixedPointX = segmentRect.right;
    } else {
      fixedPointX = segmentRect.left;
    }

    let fixedPointY = -1;
    if (isAtTopEnd(resizerRect, segmentRect)) {
      fixedPointY = segmentRect.bottom;
    } else {
      fixedPointY = segmentRect.top;
    }

    if (position === 'left') {
      setStyle((prev) => ({
        ...prev,
        bottom: `${window.innerHeight - fixedPointY}px`,
        left: '',
        right: `${window.innerWidth - fixedPointX}px`,
        top: '',
        transformOrigin: 'right center',
      }));

      setState({
        stage: stages.RESHAPING,
        fixedPoint: { x: fixedPointX, y: fixedPointY },
        fixedSide: 'right',
      });
    } else {
      setStyle((prev) => ({
        ...prev,
        bottom: '',
        left: `${fixedPointX}px`,
        right: '',
        top: `${fixedPointY}px`,
        transformOrigin: 'left center',
      }));

      setState({
        stage: stages.RESHAPING,
        fixedPoint: { x: fixedPointX, y: fixedPointY },
        fixedSide: 'left',
      });
    }
  };

  return <div className={`res ${position}`} onMouseDown={resize} />;
}

function isAtLeftEnd(resizerRect, segmentRect) {
  return (
    Math.abs(resizerRect.left - segmentRect.left) < Math.abs(resizerRect.right - segmentRect.right)
  );
}

function isAtTopEnd(resizerRect, segmentRect) {
  return (
    Math.abs(resizerRect.top - segmentRect.top) < Math.abs(resizerRect.bottom - segmentRect.bottom)
  );
}

export default Segment;
