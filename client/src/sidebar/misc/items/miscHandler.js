import clearer from './clearer';
import hider from './hider';
import filesaver from './filesaver';

function getIcon(item) {
  switch (item) {
    case 'clearer':
      return clearer.getIcon();
    case 'hider':
      return hider.getIcon();
    case 'filesaver':
      return filesaver.getIcon();
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
    case 'filesaver':
      filesaver.executeAction();
      break;
    default:
      break;
  }
}

export {
  getIcon,
  executeAction,
};
