// node/browser support
if (typeof(require) !== 'undefined') {
  const common = require('./common.js')
  for(var funcName in common) {
    global[funcName] = common[funcName]
  }
}

/**
 * decode message using passhare with charset in this size matrix with the following ceaser-shift offset
 */
function sniph_decrypt(char_set, passphrase, msg, depth, rows, cols, offset) {
  // un-"caesar shift"
  msg = msg.substr(msg.length - offset) + msg.substr(0, msg.length - offset)

  // decode rows/cols
  var str = ''
  for(var i in msg) {
    var t = 0 // reset position
    var code = parseInt(msg[i]) // get current character in message

    // if even
    if (i % 2 == 0) {
      // row (i is even)
      t = code % rows  // make sure t isn't bigger than rows
      if (!t) t = rows // adjust for starting count at 1
    } else {
      // col (i is odd)
      t = code % cols  // make sure t isn't bigger than cols
      if (!t) t = cols // adjust for starting count at 1
    }
    if (t == 10) t = 0 // adjust for starting count at 1
    str += '' + t // convert number to string and add to next phase
  }

  // break it into blocks of 4 chars
  var chars = []
  for(var i = 0; i < Math.floor(str.length / 4); ++i) {
    var code = str.substr(4 * i, 4)
    chars.push(code)
  }

  // go over each coordinate set
  var decoding = ''
  var k = 0
  var size = rows * cols
  for(var i in chars) {
    var tset = chars[i]

    // get shifted by secret character set
    var arr = getShifted(char_set, passphrase, k, cols, rows, depth, size)
    var shifted_set = arr[0]
    var k = arr[1] // next shift

    // d2y, d2x, dNy, dNx
    var x1 = parseInt(tset[0]); if (!x1) x1 = 10
    var y1 = parseInt(tset[1]); if (!y1) y1 = 10
    var x2 = parseInt(tset[2]); if (!x2) x2 = 10
    var y2 = parseInt(tset[3]); if (!y2) y2 = 10

    // figure out 2nd to last table and last table
    var d2 = ((x1 - 1) * cols) + (y1 - 1)
    var dN = ((x2 - 1) * cols) + (y2 - 1)

    // get position in table
    var char_pos = convert2d21d(d2 + 1, dN + 1, size, size)
    var out = shifted_set[char_pos] // get character at position
    decoding += out // write to output
  }
  return decoding
}

// node and browser compatibility
(function(ref) {
  if (ref.constructor.name == 'Module') {
    // node
    module.exports = sniph_decrypt
  } else {
    // browser
    // should be already set
    //module['sniph_encrypt'] = sniph_encrypt
  }
})(typeof(module)=== 'undefined' ? this : module)
