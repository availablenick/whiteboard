function getIcon() {
  return ['fas', 'font'];
}

function getCursor() {
  return 'text';
}

function executeAction(event, setTextState) {
  if (event.type === 'click') {
    setTextState({
      isWriting: true,
      x: event.clientX,
      y: event.clientY,
    });
  }
}

export default {
  getIcon,
  getCursor,
  executeAction,
};
