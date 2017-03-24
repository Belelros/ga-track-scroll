import ScrollBus from 'scroll-bus';
import GATrack from 'ga-track';

let scrollPercent = 0;
let lastPos = 0;
let wHeight = 0;
let dHeight = 0;
let trackLength = 0;
const location = document.location.toString();
const scrollTriggers = {
  scroll: false,
  25: false,
  50: false,
  75: false,
  100: false
};

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
  scrollPercent = getScrolledAmount();

  if (lastPos !== scrollPercent) {
    lastPos = scrollPercent;
  }

  if (!scrollTriggers.scroll) {
    scrollTriggers.scroll = true;
    GATrack.sendEvent('scroll', location, 'Scrolled');
  }

  switch (scrollPercent) {
    case 25:
      if (scrollTriggers['25']) break;
      GATrack.sendEvent('scroll', location, 'Scrolled 25%');
      scrollTriggers['25'] = true;
      break;
    case 50:
      if (scrollTriggers['50']) break;
      GATrack.sendEvent('scroll', location, 'Scrolled 50%');
      scrollTriggers['50'] = true;
      break;
    case 75:
      if (scrollTriggers['75']) break;
      GATrack.sendEvent('scroll', location, 'Scrolled 75%');
      scrollTriggers['75'] = true;
      break;
    case 100:
      if (scrollTriggers['100']) break;
      GATrack.sendEvent('scroll', location, 'Scrolled 100%');
      scrollTriggers['100'] = true;
      break;
    default:
  }
}

computeSizes();
ScrollBus.on(scrollCheck);

window.addEventListener('resize', computeSizes, false);
