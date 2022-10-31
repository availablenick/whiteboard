import bottomResize from './positions/bottom';
import bottomLeftResize from './positions/bottomLeft';
import bottomRightResize from './positions/bottomRight';
import leftResize from './positions/left';
import rightResize from './positions/right';
import topResize from './positions/top';
import topLeftResize from './positions/topLeft';
import topRightResize from './positions/topRight';

function resize(position, event, measurements, setStyle, heightLowerBound, widthLowerBound) {
  switch (position) {
    case 'bottom':
      bottomResize(event, measurements, setStyle, heightLowerBound);
      break;
    case 'bottom-left':
      bottomLeftResize(event, measurements, setStyle, heightLowerBound, widthLowerBound);
      break;
    case 'bottom-right':
      bottomRightResize(event, measurements, setStyle, heightLowerBound, widthLowerBound);
      break;
    case 'left':
      leftResize(event, measurements, setStyle, widthLowerBound);
      break;
    case 'right':
      rightResize(event, measurements, setStyle, widthLowerBound);
      break;
    case 'top':
      topResize(event, measurements, setStyle, heightLowerBound);
      break;
    case 'top-left':
      topLeftResize(event, measurements, setStyle, heightLowerBound, widthLowerBound);
      break;
    case 'top-right':
      topRightResize(event, measurements, setStyle, heightLowerBound, widthLowerBound);
      break;
    default:
      break;
  }
}

export default resize;
