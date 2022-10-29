import React, { useState, useEffect, useRef } from 'react';
import behaviors from '../resizing';
import { getQuadrant } from './helpers';
import { createCanvasChangeEvent } from '../../global/helpers';
import './Rectangle.scss';
import '../resizing.scss';

function Rectangle({ config, x, y, setShapeState }) {
  const canvas = document.getElementById('canvas');
  const rectangleRef = useRef(null);
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

    const rectShape = rectangleRef.current;
    setStyle(newStyle);

    return () => {
      document.onmousemove = null;
      document.onmouseup = null;

      const ctx = canvas.getContext('2d');
      ctx.fillStyle = config.drawing.color;
      ctx.strokeStyle = config.drawing.color;
      ctx.lineWidth = 4;
      ctx.strokeRect(
        rectShape.offsetLeft - canvas.offsetLeft + ctx.lineWidth / 2,
        rectShape.offsetTop - canvas.offsetTop + ctx.lineWidth / 2,
        rectShape.offsetWidth - ctx.lineWidth,
        rectShape.offsetHeight - ctx.lineWidth,
      );

      canvas.dispatchEvent(createCanvasChangeEvent());
    };
  }, []);

  useEffect(() => {
    if (/shaping/.test(stage)) {
      const newEvent = new MouseEvent('mousedown', { bubbles: true });
      rectangleRef.current.dispatchEvent(newEvent);
    } else {
      const removeShape = (event) => {
        if (event.target === rectangleRef.current
            || rectangleRef.current.contains(event.target)) {
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
        behaviors[corners[getQuadrant(p, q)]](
          mouseMoveEvent,
          rectangleRef.current,
          setStyle,
          { height: 0, width: 0 },
        );
      };
    } else {
      const shiftX = event.clientX - rectangleRef.current.offsetLeft;
      const shiftY = event.clientY - rectangleRef.current.offsetTop;
      document.onmousemove = (mouseMoveEvent) => {
        let xPos = mouseMoveEvent.clientX - shiftX;
        let yPos = mouseMoveEvent.clientY - shiftY;
        const canvasRight = canvas.offsetLeft + canvas.offsetWidth;
        if (xPos < canvas.offsetLeft) {
          xPos = canvas.offsetLeft;
        } else if (xPos + rectangleRef.current.offsetWidth > canvasRight) {
          xPos = canvasRight - rectangleRef.current.offsetWidth;
        }

        const canvasBottom = canvas.offsetTop + canvas.offsetHeight;
        if (yPos < canvas.offsetTop) {
          yPos = canvas.offsetTop;
        } else if (yPos + rectangleRef.current.offsetHeight > canvasBottom) {
          yPos = canvasBottom - rectangleRef.current.offsetHeight;
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

  const points = positions.map((item) => {
    function resMouseDown(event) {
      event.preventDefault();
      event.persist();
      event.stopPropagation();

      document.onmousemove = (mouseMoveEvent) => {
        behaviors[item](mouseMoveEvent, rectangleRef.current, setStyle, { height: 1, width: 1 });
      };

      document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
        setStyle({
          ...style,
          bottom: '',
          height: rectangleRef.current.offsetHeight,
          left: `${rectangleRef.current.offsetLeft}px`,
          right: '',
          top: `${rectangleRef.current.offsetTop}px`,
          width: `${rectangleRef.current.offsetWidth}px`,
        });
      };
    }

    return (
      <div
        key={item}
        className={`res ${item}`}
        onMouseDown={resMouseDown}
      />
    );
  });

  return (
    <div
      className="rect-shape resizable"
      style={style}
      ref={rectangleRef}
      onMouseDown={handleMouseDown}
    >

      {stage === 'positioning' && points}
    </div>
  );
}

export default Rectangle;
