function getIcon() {
  return ['fas', 'save'];
}

function executeAction() {
  const data = document.getElementById('canvas').toDataURL();
  const a = document.createElement('a');
  a.href = data;
  a.download = 'image';
  a.click();
}

export default {
  getIcon,
  executeAction,
};
