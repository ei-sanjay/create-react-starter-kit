const { TextDecoder, TextEncoder } = require('node:util');

/**
 * jsdom does not provide Encoding APIs (React Router 7) or fetch (RTK Query).
 * Use whatwg-fetch instead of undici — patching Node's fetch onto jsdom's Window
 * leaves microtasks that crash on `window.location` during teardown.
 */
Object.assign(globalThis, { TextEncoder, TextDecoder });

require('whatwg-fetch');
