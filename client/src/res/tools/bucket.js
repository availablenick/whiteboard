import { createCanvasChangeEvent, getIconFromCanvas } from '../helpers';

const bucket = {
  color: '',
  getIcon() {
    return ['fas', 'fill'];
  },
  getCursor() {
    return getIconFromCanvas('\uf575', 2, 21);
  },
  executeAction(event) {
    const NO_BUTTON = 0;
    if (event.type === 'mousedown' && event.button === NO_BUTTON) {
      const canvas = event.target;
      const context = canvas.getContext('2d');
      context.fillStyle = this.color;
      context.strokeStyle = this.color;

      const match = /rgba?\((\d+), ?(\d+), ?(\d+)(, ?(\d+))?\)/.exec(this.color);
      const red = Number(match[1]);
      const green = Number(match[2]);
      const blue = Number(match[3]);
      const alpha = match[5] ? Number(match[5]) : 1;
      const drawingColorComponents = [red, green, blue, alpha];

      const sourceX = event.clientX - canvas.offsetLeft;
      const sourceY = event.clientY - canvas.offsetTop;
      const sourcePixelData = context.getImageData(sourceX, sourceY, 1, 1).data;
      const sourceColorComponents = [
        sourcePixelData[0], sourcePixelData[1], sourcePixelData[2], sourcePixelData[3] / 255,
      ];

      fillMatchingArea(canvas, sourceX, sourceY, sourceColorComponents, drawingColorComponents);

      canvas.dispatchEvent(createCanvasChangeEvent());
    }
  },
};

function fillMatchingArea(canvas, sourceX, sourceY, sourceColorComponents, drawingColorComponents) {
  const context = canvas.getContext('2d');
  if (!shouldFill(context, sourceX, sourceY, sourceColorComponents, drawingColorComponents)) {
    return;
  }

  const queue = [[sourceX, sourceY]];
  while (queue.length > 0) {
    const pos = queue.shift();
    let x = pos[0];
    const y = pos[1];
    let lx = x;
    while (lx >= 1
      && shouldFill(context, lx - 1, y, sourceColorComponents, drawingColorComponents)) {
      --lx;
    }

    while (x < canvas.width
      && shouldFill(context, x, y, sourceColorComponents, drawingColorComponents)) {
      ++x;
    }

    context.fillRect(lx, y, x - lx, 1);
    if (y >= 1) {
      scan(context, lx, x - 1, y - 1, queue, sourceColorComponents, drawingColorComponents);
    }

    if (y + 1 < canvas.width) {
      scan(context, lx, x - 1, y + 1, queue, sourceColorComponents, drawingColorComponents);
    }
  }
}

function scan(context, lx, rx, y, queue, sourceColorComponents, drawingColorComponents) {
  let foundBoundary = true;
  for (let x = lx; x <= rx; ++x) {
    if (!shouldFill(context, x, y, sourceColorComponents, drawingColorComponents)) {
      foundBoundary = true;
    } else if (foundBoundary) {
      queue.push([x, y]);
      foundBoundary = false;
    }
  }
}

function shouldFill(context, x, y, sourceColorComponents, drawingColorComponents) {
  const pixelData = context.getImageData(x, y, 1, 1).data;
  const components = [pixelData[0], pixelData[1], pixelData[2], pixelData[3] / 255];
  return colorsMatch(components, sourceColorComponents)
        && !colorsMatch(components, drawingColorComponents);
}

function colorsMatch(color1Components, color2Components) {
  return color1Components[0] === color2Components[0]
          && color1Components[1] === color2Components[1]
          && color1Components[2] === color2Components[2]
          && color1Components[3] === color2Components[3];
}

export default bucket;
