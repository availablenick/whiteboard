import bucket from './bucket';
import circle from './circle';
import eraser from './eraser';
import eyeDropper from './eyeDropper';
import segment from './segment';
import pencil from './pencil';
import rectangle from './rectangle';
import text from './text';

function getIcon(tool) {
  switch (tool) {
    case 'bucket':
      return bucket.getIcon();
    case 'circle':
      return circle.getIcon();
    case 'eraser':
      return eraser.getIcon();
    case 'eyeDropper':
      return eyeDropper.getIcon();
    case 'segment':
      return segment.getIcon();
    case 'pencil':
      return pencil.getIcon();
    case 'rectangle':
      return rectangle.getIcon();
    case 'text':
      return text.getIcon();
    default:
      break;
  }

  return null;
}

function getCursor(tool, config) {
  switch (tool) {
    case 'bucket':
      return bucket.getCursor();
    case 'circle':
      return circle.getCursor();
    case 'eraser':
      return eraser.getCursor(config);
    case 'eyeDropper':
      return eyeDropper.getCursor();
    case 'segment':
      return segment.getCursor();
    case 'pencil':
      return pencil.getCursor();
    case 'rectangle':
      return rectangle.getCursor();
    case 'text':
      return text.getCursor();
    default:
      break;
  }

  return null;
}

function executeAction(
  tool, event, { config = { drawing: {} }, setConfig, setShapeState, setTextState },
) {
  switch (tool) {
    case 'bucket':
      bucket.executeAction(event, config.drawing.color);
      break;
    case 'circle':
      circle.executeAction(event, setShapeState);
      break;
    case 'eraser':
      eraser.executeAction(event, config, setConfig);
      break;
    case 'eyeDropper':
      eyeDropper.executeAction(event, setConfig);
      break;
    case 'segment':
      segment.executeAction(event, setShapeState);
      break;
    case 'pencil':
      pencil.executeAction(event, config.drawing.color);
      break;
    case 'rectangle':
      rectangle.executeAction(event, setShapeState);
      break;
    case 'text':
      text.executeAction(event, setTextState);
      break;
    default:
      break;
  }
}

export {
  getIcon,
  getCursor,
  executeAction,
};
