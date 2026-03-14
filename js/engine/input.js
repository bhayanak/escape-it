// Input handler — keyboard, touch, mouse
export class Input {
  constructor(canvas) {
    this.canvas = canvas;
    this.keys = {};
    this.touchLeft = false;
    this.touchRight = false;
    this.tapped = false;
    this.clickPos = null;
    this._listeners = [];

    this._addListener(window, 'keydown', e => {
      this.keys[e.code] = true;
      if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space'].includes(e.code)) {
        e.preventDefault();
      }
    });
    this._addListener(window, 'keyup', e => { this.keys[e.code] = false; });

    // Touch
    this._addListener(canvas, 'touchstart', e => {
      e.preventDefault();
      this._handleTouch(e.touches);
      this.tapped = true;
      // Set clickPos from first touch (same scaling as mousedown)
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        const y = e.touches[0].clientY - rect.top;
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        this.clickPos = { x: x * scaleX, y: y * scaleY };
      }
    });
    this._addListener(canvas, 'touchmove', e => {
      e.preventDefault();
      this._handleTouch(e.touches);
    });
    this._addListener(canvas, 'touchend', e => {
      e.preventDefault();
      this.touchLeft = false;
      this.touchRight = false;
    });
    this._addListener(canvas, 'touchcancel', e => {
      this.touchLeft = false;
      this.touchRight = false;
    });

    // Mouse
    this._addListener(canvas, 'mousedown', e => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      this.clickPos = { x: x * scaleX, y: y * scaleY };
      this.tapped = true;
      if (x < rect.width / 2) {
        this.touchLeft = true;
      } else {
        this.touchRight = true;
      }
    });
    this._addListener(canvas, 'mouseup', () => {
      this.touchLeft = false;
      this.touchRight = false;
    });
  }

  _addListener(target, event, handler) {
    target.addEventListener(event, handler, { passive: false });
    this._listeners.push({ target, event, handler });
  }

  _handleTouch(touches) {
    this.touchLeft = false;
    this.touchRight = false;
    const rect = this.canvas.getBoundingClientRect();
    for (let i = 0; i < touches.length; i++) {
      const x = touches[i].clientX - rect.left;
      if (x < rect.width / 2) {
        this.touchLeft = true;
      } else {
        this.touchRight = true;
      }
    }
  }

  isLeft() {
    return this.keys['ArrowLeft'] || this.keys['KeyA'] || this.touchLeft;
  }

  isRight() {
    return this.keys['ArrowRight'] || this.keys['KeyD'] || this.touchRight;
  }

  isPause() {
    return this.keys['KeyP'] || this.keys['Escape'];
  }

  isSpace() {
    return this.keys['Space'];
  }

  consumeTap() {
    const t = this.tapped;
    this.tapped = false;
    return t;
  }

  consumeClick() {
    const p = this.clickPos;
    this.clickPos = null;
    return p;
  }

  consumeKey(code) {
    const v = this.keys[code];
    this.keys[code] = false;
    return v;
  }

  destroy() {
    for (const l of this._listeners) {
      l.target.removeEventListener(l.event, l.handler);
    }
    this._listeners = [];
  }
}
