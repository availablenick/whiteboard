import clearer from './clearer';
import hider from './hider';

function makeItem(miscItemName, { setIsSidebarVisible }) {
	switch (miscItemName) {
    case 'clearer':
      return clearer;
    case 'hider':
      hider.setIsSidebarVisible = setIsSidebarVisible;
      return hider;
    default:
      break;
  }

  return null;
}

export { makeItem };
