import React, { useState, useEffect, useRef } from 'react';
import behaviors from '../res/resizing';
import { getQuadrant } from './helpers';
import { createCanvasChangeEvent } from '../res/helpers';
import './Circle.scss';
import '../res/resizable.scss';

function Circle({ config, x, y, setShapeState }) {
  const canvas = document.getElementById('canvas');
  const ref = useRef(null);
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

    const circShape = ref.current;
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
      ref.current.dispatchEvent(newEvent);
    } else {
      const removeShape = (event) => {
        if (event.target === ref.current
            || ref.current.contains(event.target)) {
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
          ref.current,
          setStyle,
          { height: 0, width: 0 },
        );
      };
    } else {
      const shiftX = event.clientX - ref.current.offsetLeft;
      const shiftY = event.clientY - ref.current.offsetTop;
      document.onmousemove = (mouseMoveEvent) => {
        let xPos = mouseMoveEvent.clientX - shiftX;
        let yPos = mouseMoveEvent.clientY - shiftY;
        const canvasRight = canvas.offsetLeft + canvas.offsetWidth;
        if (xPos < canvas.offsetLeft) {
          xPos = canvas.offsetLeft;
        } else if (xPos + ref.current.offsetWidth > canvasRight) {
          xPos = canvasRight - ref.current.offsetWidth;
        }

        const canvasBottom = canvas.offsetTop + canvas.offsetHeight;
        if (yPos < canvas.offsetTop) {
          yPos = canvas.offsetTop;
        } else if (yPos + ref.current.offsetHeight > canvasBottom) {
          yPos = canvasBottom - ref.current.offsetHeight;
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

      function mouseMove(mouseMoveEvent) {
        behaviors[item](mouseMoveEvent, ref.current, setStyle, { height: 1, width: 1 });
      }

      document.addEventListener('mousemove', mouseMove);
      document.onmouseup = () => {
        document.removeEventListener('mousemove', mouseMove);
        document.onmouseup = null;
        setStyle({
          ...style,
          bottom: '',
          height: ref.current.offsetHeight,
          left: `${ref.current.offsetLeft}px`,
          right: '',
          top: `${ref.current.offsetTop}px`,
          width: `${ref.current.offsetWidth}px`,
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
      className="circle-shape resizable"
      style={style}
      ref={ref}
      onMouseDown={handleMouseDown}
    >

      {stage === 'positioning' && points}
    </div>
  );
}

export default Circle;
