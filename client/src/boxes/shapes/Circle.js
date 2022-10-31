import React, { useState, useEffect, useRef } from 'react';
import Resizer from '../resizing/Resizer';
import { getQuadrant } from './helpers';
import createCanvasChangeEvent from '../../global/helpers';
import getElementMeasurements from '../helpers';
import resize from '../resizing/handler';
import './Circle.scss';

function Circle({ config, x, y, setShapeState }) {
  const canvas = document.getElementById('canvas');
  const circleRef = useRef(null);
  const initialStyle = {
    left: '-500px',
    top: '-500px',
  };

  const [style, setStyle] = useState(initialStyle);
  const [stage, setStage] = useState('shaping');
  useEffect(() => {
    const newStyle = {
      border: `4px solid ${config.drawing.color}`,
      height: 0,
      left: `${x}px`,
      top: `${y}px`,
      width: 0,
    };

    const circShape = circleRef.current;
    setStyle(newStyle);

    return () => {
      document.onmousemove = null;
      document.onmouseup = null;

      const ctx = canvas.getContext('2d');
      ctx.fillStyle = config.drawing.color;
      ctx.strokeStyle = config.drawing.color;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(
        circShape.offsetLeft + (circShape.offsetWidth / 2) - canvas.offsetLeft,
        circShape.offsetTop + (circShape.offsetHeight / 2) - canvas.offsetTop,
        (circShape.offsetWidth - ctx.lineWidth) / 2,
        (circShape.offsetHeight - ctx.lineWidth) / 2,
        0,
        0,
        2 * Math.PI,
      );

      ctx.stroke();
      ctx.closePath();

      canvas.dispatchEvent(createCanvasChangeEvent());
    };
  }, []);

  useEffect(() => {
    if (/shaping/.test(stage)) {
      const newEvent = new MouseEvent('mousedown', { bubbles: true });
      circleRef.current.dispatchEvent(newEvent);
    } else {
      const removeShape = (event) => {
        if (event.target === circleRef.current
            || circleRef.current.contains(event.target)) {
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
  }, [stage]);

  const handleMouseDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (/shaping/.test(stage)) {
      event.persist();
      const p = { x, y };
      const corners = {
        1: 'top-right',
        2: 'top-left',
        3: 'bottom-left',
        4: 'bottom-right',
      };

      document.onmousemove = (mouseMoveEvent) => {
        const q = { x: mouseMoveEvent.clientX, y: mouseMoveEvent.clientY };
        resize(
          corners[getQuadrant(p, q)],
          mouseMoveEvent,
          circleRef.current,
          setStyle,
          0,
          0,
        );
      };
    } else {
      const shiftX = event.clientX - circleRef.current.offsetLeft;
      const shiftY = event.clientY - circleRef.current.offsetTop;
      document.onmousemove = (mouseMoveEvent) => {
        let xPos = mouseMoveEvent.clientX - shiftX;
        let yPos = mouseMoveEvent.clientY - shiftY;
        const canvasRight = canvas.offsetLeft + canvas.offsetWidth;
        if (xPos < canvas.offsetLeft) {
          xPos = canvas.offsetLeft;
        } else if (xPos + circleRef.current.offsetWidth > canvasRight) {
          xPos = canvasRight - circleRef.current.offsetWidth;
        }

        const canvasBottom = canvas.offsetTop + canvas.offsetHeight;
        if (yPos < canvas.offsetTop) {
          yPos = canvas.offsetTop;
        } else if (yPos + circleRef.current.offsetHeight > canvasBottom) {
          yPos = canvasBottom - circleRef.current.offsetHeight;
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
      if (/shaping/.test(stage)) {
        setStage('positioning');
      }
    };
  };

  const positions = [
    'top',
    'top-right',
    'right',
    'bottom-right',
    'bottom',
    'bottom-left',
    'left',
    'top-left',
  ];

  const resizers = positions.map((position) => (
    <Resizer
      key={position}
      position={position}
      boxMeasurements={getElementMeasurements(circleRef.current)}
      setStyle={setStyle}
      heightLowerBound={1}
      widthLowerBound={1}
    />
  ));

  return (
    <div
      className="circle-shape"
      style={style}
      ref={circleRef}
      onMouseDown={handleMouseDown}
    >
      {stage === 'positioning' && resizers}
    </div>
  );
}

export default Circle;
