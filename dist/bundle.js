/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

// (() => {
let context;

class Point {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  distanceFrom(point) {
    return Math.sqrt(Math.pow(point.x - this.x, 2) + Math.pow(point.y - this.y, 2))
  }

  offset(x, y) {
    return new Point(this.x + x, this.y + y);
  }
  
  static fromEvent (event) {
    return new Point(event.clientX, event.clientY)
  }

  static randomOnCanvas (canvas) {
    return new Point(Math.random()*canvas.width, Math.random()*canvas.height)
  }
}

const Random = {
  inRange: (low, high) => {
    return (high - low) * Math.random() + low
  }
}

const moonrise = (height, moonWavelengthRatio, horizonPosition, moonPosition, moonWavesFunction, showMoon = true) => {
  let canvas = document.createElement('canvas')
  context = canvas.getContext('2d')

  canvas.height = height
  canvas.width = canvas.height*3
  const numPoints = 0.5*canvas.width*canvas.height

  const earthRadius = 40*canvas.height
  const moonRadius = 0.12*canvas.height

  const moonWavelength = moonWavelengthRatio*canvas.height
  const earthWavelength = moonWavelength/64

  const canvasCenter = new Point(canvas.width/2, canvas.height/2)
  const earthHorizonMiddle = canvasCenter.offset(0, horizonPosition*canvas.height-10)

  const moonCenter = canvasCenter.offset(0, moonPosition*canvas.height)
  const earthCenter = earthHorizonMiddle.offset(0, earthRadius)

  const randParams = [-2.5, 0.5]

  // context.fillStyle = "#FF0000"
  for (let i = 0; i < numPoints; i++) {
    let dot = Point.randomOnCanvas(canvas)
    let dist = dot.distanceFrom(earthCenter)
    if (dist > earthRadius && (!showMoon || dot.distanceFrom(moonCenter) > moonRadius) && Math.sin(dist/earthWavelength) > Random.inRange(...randParams)) {
    // if (dist > earthRadius && Math.sin(dist/earthWavelength) > Random.inRange(...randParams)) {}
      context.fillRect(dot.x, dot.y, 1, 1)
    }
  }

  // context.fillStyle = "#0000FF"
  for (let i = 0; i < numPoints; i++) {
    let dot = Point.randomOnCanvas(canvas)
    let distFromMoonCenter = dot.distanceFrom(moonCenter)
    let distFromEarthCenter = dot.distanceFrom(earthCenter)
    // if (distFromMoonCenter > moonRadius && distFromEarthCenter < earthRadius && Math.cos(distFromMoonCenter/moonWavelength) > Random.inRange(...randParams)) {}
    if (distFromEarthCenter < earthRadius && moonWavesFunction(distFromMoonCenter/moonWavelength) > Random.inRange(...randParams)) {
    // if (distFromMoonCenter > moonRadius && Math.cos(distFromMoonCenter/moonWavelength) > Random.inRange(...randParams)) {}
      context.fillRect(dot.x, dot.y, 1, 1)
    }
  }

  return canvas
}


const main = () => {
  const aspectRatio = window.innerWidth / window.innerHeight
  let height;
  if (aspectRatio >= 3) { // height is limiting
    height = window.innerHeight - window.innerHeight / 5
  } else { // width is limiting
    height = (window.innerWidth - window.innerWidth / 5) / 3
  }

  // intro
  let canvas = document.createElement('canvas')
  canvas.height = height;
  canvas.width = canvas.height*3;
  let context = canvas.getContext('2d')
  context.font = '20px sans-serif'
  context.fillText('Moonrise', 20, 20)
  context.fillText('Rupert Deese', 20, 55)
  context.fillText('2018', 20, 80)
  const promptText = 'Scroll this way ->'
  const promptTextXOffset = canvas.width - context.measureText(promptText).width - 20
  console.log(promptTextXOffset)
  context.fillText(promptText, promptTextXOffset, canvas.height - 40) 
  document.body.appendChild(canvas)
    
  // moonrise 1
  canvas = moonrise(height, 0.2, 0, -1/7, (x) => Math.cos(x), false)
  document.body.appendChild(canvas)
  // moonrise 2
  canvas = moonrise(height, 0.2, 0, -1/4, (x) => -Math.cos(x))
  document.body.appendChild(canvas)
  // moonrise 3
  canvas = moonrise(height, 0.18, -1/6, 1/10, (x) => -Math.cos(x))
  document.body.appendChild(canvas)
  // moonrise 4
  canvas = moonrise(height, 0.18, 1/10, -1/6, (x) => -Math.sin(x))
  document.body.appendChild(canvas)

  for (let index = 0; index < document.body.children.length; index++) {
    document.body.children[index].style.padding = `${(window.innerHeight - canvas.height) / 2} ${(window.innerWidth - canvas.width) / 2}`
  }
}

window.onload = main;


/***/ })
/******/ ]);