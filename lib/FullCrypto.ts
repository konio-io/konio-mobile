/**
 * This module merge quick-crypto with subtle polyfill
 * It creates also a global PolyfillCrypto webview that must be 
 * inserted on root of application View
 */

import crypto from 'react-native-quick-crypto';
import PolyfillCrypto, { subtle } from 'react-native-webview-crypto';

const fullCrypto = { ...crypto, subtle  };

//@ts-ignore
global.crypto = fullCrypto;

//@ts-ignore
global.PolyfillCrypto = PolyfillCrypto;

module.exports = fullCrypto;
export default fullCrypto;