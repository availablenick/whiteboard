import bucket from './bucket';
import circle from './circle';
import eraser from './eraser';
import eyeDropper from './eyeDropper';
import line from './line';
import pencil from './pencil';
import rectangle from './rectangle';
import text from './text';

function makeItem(toolName, {
  config = { drawing: {} },
  setConfig,
  setShapeState,
  setTextState,
}) {
  switch (toolName) {
    case 'bucket':
      bucket.color = config.drawing.color;
      return bucket;
    case 'circle':
      circle.setShapeState = setShapeState;
      return circle;
    case 'eraser':
      eraser.config = config;
      eraser.setConfig = setConfig;
      return eraser;
    case 'eyeDropper':
      eyeDropper.setConfig = setConfig;
      return eyeDropper;
    case 'line':
      line.setShapeState = setShapeState;
      return line;
    case 'pencil':
      pencil.color = config.drawing.color;
      return pencil;
    case 'rectangle':
      rectangle.setShapeState = setShapeState;
      return rectangle;
    case 'text':
      text.setTextState = setTextState;
      return text;
    default:
      break;
  }

  return null;
}

export { makeItem };