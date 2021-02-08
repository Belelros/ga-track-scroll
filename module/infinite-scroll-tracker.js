import Domodule from 'domodule';
import { find } from 'domassist';
import { trackScrollPosition } from '../';

function percentage(percent, total) {
  return Math.round((percent / 100) * total);
}

let supportsPassive = false;
try {
  const opts = Object.defineProperty({}, 'passive', {
    get() {
      // eslint-disable-next-line no-unused-vars
      supportsPassive = true;
    }
  });
  window.addEventListener('testPassive', null, opts);
  window.removeEventListener('testPassive', null, opts);
} catch (e) {
  // Silently erroring
}

class InfiniteScrollTracker extends Domodule {
  postInit() {
    const scrollOption = supportsPassive ? { passive: true } : false;
    this.observer = new MutationObserver(this.onMutationHappen.bind(this));
    this.observer.observe(this.el, {
      childList: true
    });
    this.tracked = [];
    this.pending = [];
    this.getElements();

    window.addEventListener('resize', this.computeSizes.bind(this), false);
    window.addEventListener('scroll', this.onScroll.bind(this), scrollOption);
  }

  getElements() {
    const elements = find(this.options.selector);
    const currentScrollPosition = InfiniteScrollTracker.getScrollPosition();

    elements.forEach((element, i) => {
      const trackedConf = this.tracked[i] || {};

      if (!trackedConf.id) {
        trackedConf.id = element.id || this.generateId();
        element.id = trackedConf.id;

        trackedConf.positions = this.getScrollPositions(
          element,
          i,
          currentScrollPosition
        );
        trackedConf.element = element;
      }

      this.tracked[i] = trackedConf;
    });
    this.refreshPending();
  }

  refreshPending() {
    this.pending = [];

    this.tracked.forEach(el => {
      el.positions.forEach(pos => {
        if (!pos.triggered) {
          this.pending.push(pos);
        }
      });
    });
  }

  onMutationHappen() {
    this.getElements();
  }

  onScroll() {
    if (this.pending.length) {
      const currentPosition = InfiniteScrollTracker.getScrollPosition();
      const triggered = [];

      for (let i = 0; i < this.pending.length; i++) {
        if (this.pending[i].scroll <= currentPosition) {
          triggered.push(this.pending[i]);
          this.pending[i].triggered = true;
        } else {
          break;
        }
      }

      if (triggered.length) {
        this.refreshPending();
        triggered.forEach(trigger => trackScrollPosition(trigger.amount, trigger.label));
      }
    }
  }

  computeSizes() {
    const currentPosition = InfiniteScrollTracker.getScrollPosition();

    this.tracked.forEach((el, i) => {
      el.positions = this.getScrollPositions(el.element, i, currentPosition, el.pending);
    });

    this.refreshPending();
  }

  generateId() {
    return `${this.options.selector.replace('.', '')}-${Date.now()}`;
  }

  getScrollPositions(element, elementPosition, currentScroll, pending) {
    const positions = [0, 25, 50, 75, 100];
    const trackablePositions = Array.isArray(pending) ?
      pending.filter(p => !p.triggered).map(p => p.amount) : positions;
    const labelText = elementPosition === 0 ?
      this.options.landingLabel :
      `${this.options.extraLabel} ${elementPosition + 1}`;

    if (trackablePositions.length) {
      const rect = element.getBoundingClientRect();
      const top = rect.top + currentScroll;

      return positions.map((amount, i) => {
        if (positions[i] === amount) {
          let label;

          if (i === 0) {
            label = `Scrolled ${labelText}`;
          } else {
            label = `Scrolled ${labelText} - ${amount}%`;
          }

          return ({
            amount,
            triggered: false,
            label,
            scroll: (top + percentage(amount, rect.height))
          });
        }

        return pending[i];
      });
    }
  }

  static getScrollPosition() {
    return (window.pageYOffset || document.scrollTop) - (document.clientTop || 0) || 0;
  }

  get defaults() {
    return {
      landingLabel: 'Landing Article',
      extraLabel: 'Article'
    };
  }

  get required() {
    return {
      options: ['selector']
    };
  }
}

window.disableGATrackScroll = true;

Domodule.register('InfiniteScrollTracker', InfiniteScrollTracker);
