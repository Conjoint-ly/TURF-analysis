'use strict';

var MathsJS = {
  Vector: require('./vector')
}

// NodeJS
if (module) module.exports = MathsJS

// Browser
if (window) {
  window['MathsJS'] = MathsJS
  for (var i in MathsJS) {
    window[i] = MathsJS[i]
  }
}
