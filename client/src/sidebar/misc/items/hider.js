function getIcon() {
  return ['fas', 'arrow-left'];
}

function executeAction(event, setIsSidebarVisible) {
  event.stopPropagation();
  setIsSidebarVisible(false);
}

export default {
  getIcon,
  executeAction,
};
