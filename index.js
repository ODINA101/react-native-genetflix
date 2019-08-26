import App from './src/app';
const _XHR = GLOBAL.originalXMLHttpRequest ?
    GLOBAL.originalXMLHttpRequest :
    GLOBAL.XMLHttpRequest

XMLHttpRequest = _XHR
console.disableYellowBox = true;