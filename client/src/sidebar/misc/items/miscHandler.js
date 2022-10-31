import clearer from './clearer';
import hider from './hider';

function getIcon(item) {
  switch (item) {
    case 'clearer':
      return clearer.getIcon();
    case 'hider':
      return hider.getIcon();
    default:
      break;
  }

  return null;
}

function executeAction(item, event, { setIsSidebarVisible }) {
  switch (item) {
    case 'clearer':
      clearer.executeAction(event);
      break;
    case 'hider':
      hider.executeAction(event, setIsSidebarVisible);
      break;
    default:
      break;
  }
}

export {
  getIcon,
  executeAction,
};
