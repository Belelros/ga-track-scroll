import ScrollBus from 'scroll-bus';
import GATrack from 'ga-track';

let scrollPercent = 0;
let lastPos = 0;
let wHeight = 0;
let dHeight = 0;
let trackLength = 0;
const location = document.location.toString();
let hasScrolled = false;
const cache = [25, 50, 75, 100];

function getDocHeight() {
  return Math.max(
    document.body.scrollHeight, document.documentElement.scrollHeight,
    document.body.offsetHeight, document.documentElement.offsetHeight,
    document.body.clientHeight, document.documentElement.clientHeight);
}

function computeSizes() {
  wHeight = window.innerHeight ||
      (document.documentElement || document.body).clientHeight;
  dHeight = getDocHeight();

  trackLength = dHeight - wHeight;
}

function getScrolledAmount() {
  const scrollTop = window.pageYOffset ||
    (document.documentElement || document.body.parentNode || document.body).scrollTop;

  return Math.floor(scrollTop / trackLength * 100);
}

function scrollCheck() {
  if (!cache.length) {
    return;
  }

  scrollPercent = getScrolledAmount();

  if (lastPos !== scrollPercent) {
    lastPos = scrollPercent;
  }

  if (!hasScrolled && scrollPercent > 0) {
    hasScrolled = true;
    GATrack.sendEvent('scroll', location, 'Scrolled');
  }

  const events = cache.filter(a => a <= scrollPercent);
  events.forEach(e => {
    GATrack.sendEvent('scroll', location, `Scrolled ${e}%`);
    cache.splice(cache.indexOf(e), 1);
  });
}

computeSizes();
ScrollBus.on(scrollCheck);

window.addEventListener('resize', computeSizes, false);
