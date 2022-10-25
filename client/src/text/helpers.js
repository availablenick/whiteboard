const adjustToCanvasLeft = (x, canvas, element) => {
  let left = x;
  const canvasRight = canvas.offsetLeft + canvas.offsetWidth;
  if (left < canvas.offsetLeft) {
    left = canvas.offsetLeft;
  } else if (left + element.offsetWidth > canvasRight) {
    left = canvasRight - element.offsetWidth;
  }

  return left;
};

const adjustToCanvasTop = (y, canvas, element) => {
  let top = y - element.offsetHeight / 2;
  const canvasBottom = canvas.offsetTop + canvas.offsetHeight;
  if (top < canvas.offsetTop) {
    top = canvas.offsetTop;
  } else if (top + element.offsetHeight > canvasBottom) {
    top = canvasBottom - element.offsetHeight;
  }

  return top;
};

const drawText = (canvas, textarea, rowHeight) => {
  const text = textarea.value;
  if (text !== '') {
    const context = canvas.getContext('2d');
    context.font = window.getComputedStyle(textarea).getPropertyValue('font');

    const textareaRect = textarea.getBoundingClientRect();
    const backupArea = context.getImageData(
      textareaRect.left - canvas.offsetLeft,
      textareaRect.bottom - canvas.offsetTop,
      textareaRect.width,
      canvas.height - (textareaRect.bottom - canvas.offsetTop),
    );

    let fontSize = context.font = window.getComputedStyle(textarea)
      .getPropertyValue('font-size');

    fontSize = Number(fontSize.slice(0, fontSize.length - 2));
    const inc = fontSize / 8;
    const xCoord = textareaRect.left - canvas.offsetLeft;
    const yCoord = textareaRect.top - canvas.offsetTop - 3 * inc;
    let currentText = '';
    let currentWidth = 0;
    let counter = 1;
    let spaceIndex = -1;
    let i = 0;
    // for (let char of text) {
    Array.from(text).forEach((char) => {
      if (char === ' ') {
        spaceIndex = i;
      }

      if (char === '\n') {
        context.fillText(currentText, xCoord, yCoord + rowHeight * counter);
        currentWidth = 0;
        counter++;
        currentText = '';
        i = 0;
        return;
      }

      currentWidth += context.measureText(char).width;
      if (currentWidth <= textareaRect.width) {
        currentText += char;
      } else {
        let textToDraw = currentText;
        if (spaceIndex >= 0) {
          let nextChar = char;
          if (char === ' ') {
            nextChar = '';
          }

          textToDraw = textToDraw.slice(0, spaceIndex);
          currentText = currentText.slice(
            spaceIndex + 1,
            currentText.length,
          ) + nextChar;
        } else {
          currentText = char;
        }

        context.fillText(textToDraw, xCoord, yCoord + rowHeight * counter);

        currentWidth = context.measureText(currentText).width;
        counter++;
        spaceIndex = -1;
        i = currentText.length;
        return;
      }

      i++;
    });

    if (currentText !== '') {
      context.fillText(currentText, xCoord, yCoord + rowHeight * counter);
    }

    context.putImageData(
      backupArea,
      textareaRect.left - canvas.offsetLeft,
      textareaRect.bottom - canvas.offsetTop,
    );
  }
};

exports.adjustToCanvasLeft = adjustToCanvasLeft;
exports.adjustToCanvasTop = adjustToCanvasTop;
exports.drawText = drawText;
