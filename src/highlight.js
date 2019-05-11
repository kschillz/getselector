// https://github.com/vuejs/vue-devtools/blob/dev/src/backend/highlighter.js

let overlay;
// let overlayContent;

const init = () => {
    if (overlay) return;
    overlay = document.createElement('div');
    overlay.id = 'overlay';
    overlay.style.backgroundColor = 'rgba(104, 182, 255, 0.35)';
    overlay.style.position = 'fixed';
    overlay.style.zIndex = '99999999999999999';
    overlay.style.pointerEvents = 'none';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.borderRadius = '3px';
    // overlayContent = document.createElement('div');
    // overlayContent.style.backgroundColor = 'rgba(104, 182, 255, 0.9)';
    // overlayContent.style.fontFamily = 'monospace';
    // overlayContent.style.fontSize = '11px';
    // overlayContent.style.padding = '2px 3px';
    // overlayContent.style.borderRadius = '3px';
    // overlayContent.style.color = 'white';
    // overlay.appendChild(overlayContent);
}

export const highlight = (element) => {
    if (!element) return;
    const rect = element.getBoundingClientRect();

    init();
    if (rect) {
        const content = [];
        showOverlay(rect, content);
    }
}

export const unHighlight = () => {
    if (overlay && overlay.parentNode) {
        document.body.removeChild(overlay);
    }
}

const showOverlay = ({ width = 0, height = 0, top = 0, left = 0 }, content = []) => {
  overlay.style.width = ~~width + 'px';
  overlay.style.height = ~~height + 'px';
  overlay.style.top = ~~top + 'px';
  overlay.style.left = ~~left + 'px';

//   overlayContent.innerHTML = '';
//   content.forEach(child => overlayContent.appendChild(child));

  document.body.appendChild(overlay);
}