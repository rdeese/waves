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

class Pitch {
  static noteNumbers() {
    return {
      'A': 37,
      'A#': 38,
      'B': 39,
      'C': 40,
      'C#': 41,
      'D': 42,
      'D#': 43,
      'E': 44,
      'F': 45,
      'F#': 46,
      'G': 47,
      'G#': 48,
      "A'": 49
    }
  }

  static frequencyFromNumber(noteNumber) {
    return 440 * Math.pow(1.059463, noteNumber - 49)
  }

  constructor(arg) {
    if (typeof(arg) === 'string') {
      if (arg in Pitch.noteNumbers()) {
        this.number = Pitch.noteNumbers()[arg]
        this.note = arg
      } else {
        throw new Error('pitch constructed with invalid note name')
      }
    } else if (typeof(arg) === 'number') {
      this.number = arg
      this.note = Object.keys(Pitch.noteNumbers()).find(key => Pitch.noteNumbers()[key] === this.number)
    }

    this.frequency = Pitch.frequencyFromNumber(this.number)
  }
}

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

  static randomOnCanvas () {
    return new Point(Math.random()*window.innerWidth, Math.random()*window.innerHeight)
  }
}

const Random = {
  inRange: (low, high) => {
    return (high - low) * Math.random() + low
  }
}

const main = () => {
  const canvas = document.getElementById('canvas')
  context = canvas.getContext('2d')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  let lastPoint = null
  let secondLastPoint = null

  const canvasCenter = new Point(window.innerWidth/2, window.innerHeight/2)
  const leftCenter = canvasCenter.offset(-200, 0)
  const rightCenter = canvasCenter.offset(200, 0)

  context.fillStyle = "#FF0000"
  for (let i = 0; i < 200000; i++) {
    let dot = Point.randomOnCanvas()
    if (Math.sin(dot.distanceFrom(leftCenter)/10) > Random.inRange(-3, 1)) {
      context.fillRect(dot.x, dot.y, 1, 1)
    }
  }

  context.fillStyle = "#0000FF"
  for (let i = 0; i < 200000; i++) {
    let dot = Point.randomOnCanvas()
    if (Math.sin(dot.distanceFrom(rightCenter)/10) > Random.inRange(-3, 1)) {
      context.fillRect(dot.x, dot.y, 1, 1)
    }
  }

  canvas.onclick = (event) => {
    let point = Point.fromEvent(event)
    context.fillText(`${point.x}, ${point.y}`, point.x, point.y);
    if (lastPoint && secondLastPoint) {
      context.moveTo(lastPoint.x, lastPoint.y)
      context.quadraticCurveTo(point.x, point.y, secondLastPoint.x, secondLastPoint.y)
      context.stroke()
    }
    secondLastPoint = lastPoint
    lastPoint = point;
  }
}

window.onload = main;
// })();


/***/ })
/******/ ]);