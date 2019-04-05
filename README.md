# Google Analytics Scroll (ga-track-scroll)

<span class="ga-track-scroll-npmversion"><a href="https://npmjs.org/package/ga-track-scroll" title="View this project on NPM"><img src="https://img.shields.io/npm/v/ga-track-scroll.svg" alt="NPM version" /></a></span>

Auto-track scroll depth for Google Analytics.

> This library uses [ga-track](https://github.com/firstandthird/ga-track) and needs [Google Analytics](https://developers.google.com/analytics/devguides/collection/analyticsjs/) to be set up in order to work.

## Installation
```sh
npm i ga-track-scroll
```

## Usage
```js
import 'ga-track-scroll'
```

Once the user starts scrolling it will send events to Google Analytics:

  * `category`: scroll
  * `action`: `document.location.toString()`
  * `label`: "Scrolled X%" (25/50/75/100) (There's also a simple `Scrolled` event the first time the user scrolls)
  * `value`: X (25/50/75/100)
  
It does also fire a custom event on the DOM:

```javascript
document.addEventListener('user:scroll', event => {
  const { amount } = event.detail; // Can be 25/50/75/100
});
``` 
