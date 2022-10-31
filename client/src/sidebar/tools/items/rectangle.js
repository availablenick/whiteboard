function getIcon() {
  return ['far', 'square'];
}

function getCursor() {
  return 'crosshair';
}

function executeAction(event, setShapeState) {
  const LEFT_BUTTON = 1;
  if (event.type === 'mousemove' && event.buttons === LEFT_BUTTON) {
    event.persist();
    setShapeState((prevState) => {
      if (prevState.isShaping) {
        return prevState;
      }

      return {
        isShaping: true,
        shape: 'rectangle',
        x: event.clientX,
        y: event.clientY,
      };
    });
  }
}

export default {
  getIcon,
  getCursor,
  executeAction,
};
