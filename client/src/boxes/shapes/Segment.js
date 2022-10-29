import React, { useState, useEffect, useRef } from 'react';
import createCanvasChangeEvent from '../../global/helpers';
import { calculateAngle, distance } from './helpers';
import './Segment.scss';

function Segment({ config, x, y, setShapeState }) {
  const canvas = document.getElementById('canvas');
  const segmentRef = useRef(null);
  const initialStyle = {
    left: '-500px',
    top: '-500px',
  };

  const [style, setStyle] = useState(initialStyle);
  const [state, setState] = useState({
    stage: 'shaping',
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
    if (/shaping/.test(state.stage)) {
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

  const handleMouseDown = (event) => {
    event.preventDefault();
    if (/shaping/.test(state.stage)) {
      document.onmousemove = (mouseMoveEvent) => {
        mouseMoveEvent.stopPropagation();
        const q = { x: mouseMoveEvent.clientX, y: mouseMoveEvent.clientY };

        const canvasRight = canvas.offsetLeft + canvas.offsetWidth;
        if (q.x < canvas.offsetLeft) {
          q.x = canvas.offsetLeft;
        } else if (q.x > canvasRight) {
          q.x = canvasRight;
        }

        const canvasBottom = canvas.offsetTop + canvas.offsetHeight;
        if (q.y < canvas.offsetTop) {
          q.y = canvas.offsetTop;
        } else if (q.y > canvasBottom) {
          q.y = canvasBottom;
        }

        const width = distance(state.fixedPoint, q);
        let angle = calculateAngle(state.fixedPoint, q);
        if (state.fixedSide === 'right') {
          angle = -(180 - angle);
        }

        setStyle((prevStyle) => ({
          ...prevStyle,
          transform: `rotate(${angle}deg)`,
          width: `${width}px`,
        }));
      };
    } else {
      const rect = segmentRef.current.getBoundingClientRect();
      const shiftX = event.clientX - rect.left;
      const shiftY = event.clientY - rect.top;
      document.onmousemove = (mouseMoveEvent) => {
        let xPos = mouseMoveEvent.clientX - shiftX;
        let yPos = mouseMoveEvent.clientY - shiftY;
        const canvasRight = canvas.offsetLeft + canvas.offsetWidth;
        if (xPos < canvas.offsetLeft) {
          xPos = canvas.offsetLeft;
        } else if (xPos + rect.width > canvasRight) {
          xPos = canvasRight - rect.width;
        }

        const canvasBottom = canvas.offsetTop + canvas.offsetHeight;
        if (yPos < canvas.offsetTop) {
          yPos = canvas.offsetTop;
        } else if (yPos + rect.height > canvasBottom) {
          yPos = canvasBottom - rect.height;
        }

        setStyle((prevStyle) => ({
          ...prevStyle,
          left: `${xPos}px`,
          top: `${yPos}px`,
        }));
      };
    }

    document.onmouseup = () => {
      document.onmousemove = null;
      document.onmouseup = null;
      if (/shaping/.test(state.stage)) {
        setState({
          ...state,
          stage: 'positioning',
        });
      }
    };
  };

  const positions = ['left', 'right'];
  const points = positions.map((position) => {
    const resMouseDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
      const pointRect = event.target.getBoundingClientRect();
      const segRect = segmentRef.current.getBoundingClientRect();
      if (position === 'left') {
        let xCoord = null;
        if (Math.abs(pointRect.left - segRect.left) < Math.abs(pointRect.right - segRect.right)) {
          xCoord = segRect.right;
        } else {
          xCoord = segRect.left;
        }

        let yCoord = null;
        if (Math.abs(pointRect.top - segRect.top) < Math.abs(pointRect.bottom - segRect.bottom)) {
          yCoord = segRect.bottom;
        } else {
          yCoord = segRect.top;
        }

        setStyle({
          ...style,
          bottom: `${window.innerHeight - yCoord}px`,
          left: '',
          right: `${window.innerWidth - xCoord}px`,
          top: '',
          transformOrigin: 'right center',
        });

        setState({
          stage: 'reshaping',
          fixedPoint: { x: xCoord, y: yCoord },
          fixedSide: 'right',
        });
      } else {
        let xCoord = null;
        if (Math.abs(pointRect.x - segRect.left) < Math.abs(pointRect.x - segRect.right)) {
          xCoord = segRect.right;
        } else {
          xCoord = segRect.left;
        }

        let yCoord = null;
        if (Math.abs(pointRect.y - segRect.top) < Math.abs(pointRect.y - segRect.bottom)) {
          yCoord = segRect.bottom;
        } else {
          yCoord = segRect.top;
        }

        setStyle({
          ...style,
          bottom: '',
          left: `${xCoord}px`,
          right: '',
          top: `${yCoord}px`,
          transformOrigin: 'left center',
        });

        setState({
          stage: 'reshaping',
          fixedPoint: { x: xCoord, y: yCoord },
          fixedSide: 'left',
        });
      }
    };

    return (
      <div
        key={position}
        className={`res ${position}`}
        onMouseDown={resMouseDown}
      />
    );
  });

  return (
    <div
      className="segment-shape"
      style={style}
      ref={segmentRef}
      onMouseDown={handleMouseDown}
    >
      {(state.stage === 'positioning' || state.stage === 'reshaping') && points}
    </div>
  );
}

export default Segment;
