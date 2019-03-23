// node/browser support
if (typeof(require) !== 'undefined') {
  common = require('./common.js')
  for(var funcName in common) {
    global[funcName] = common[funcName]
  }
}

/**
 * encode plaintext using passhare with charset in this size matrix
 */
function sniph_encrypt(char_set, passphrase, plaintext, depth, rows, cols) {
  if (depth === undefined) {
    var obj = passphraseToDimensions(passphrase)
    cols  = obj.w // 4-10
    rows  = obj.h // 4-10
    depth = obj.d // 4-10
  }
  // encode plaintext into first set of positions
  var encoding = ''
  var key = 0
  var shift = 0
  var size = rows * cols
  for(var i in plaintext) {
    // convert current plaintext letter to one of our options
    var letter = plaintext[i]
    var options = findOccurences(letter, shifted_set) // find options we can use
    var randOpt = Math.floor(Math.random() * options.length) // randomly select one
    var version = options[randOpt] // get the version for the selected one

    // get coordinates to selected option
    var arr = convert1d22d(version, size, size)
    var d2 = arr[0]
    var dN = arr[1]

    // 2nd to last table
    var arr = convert1d22d(d2 - 1, cols, rows)
    var d2x = arr[0]
    var d2y = arr[1]
    var s = d2y + '' + d2x

    // last table
    var arr = convert1d22d(dN - 1, cols, rows)
    var dNx = arr[0]
    var dNy = arr[1]
    s += dNy + ''+ dNx

    encoding += s // add to our encoded string
  }

  // convert encoding to 2nd set of positions
  var cipher_text = ''
  for(var i in encoding) {
    var x = parseInt(encoding[i]) // data to encode
    var r = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER) // number of random times to wrap
    var w = 1 // number of wraps
    var t = x // current position

    // if even
    if (i%2 == 0) {
      // row (i is even)
      t += rows // add one wrap
      while(t < 10) {
        w++ // count wrap
        t += rows // add one wrap
      }
      if (x == rows) { // adjust for starting count at 1
        // wrap one more time
        x = 0
        w++
      }
      x += (r % w) * rows
    } else {
      // col (i is odd)
      t += cols // add one wrap
      while(t < 10) {
        w++ // count wrap
        t += cols // add one wrap
      }
      if (x == cols) { // adjust for starting count at 1
        // wrap one more time
        x = 0
        w++
      }
      x += (r % w) * cols
    }

    var str = x + '' // convert number to string
    cipher_text += str
  }
  return cipher_text // return
}

// node and browser compatibility
(function(ref) {
  if (ref.constructor.name == 'Module') {
    // node
    module.exports = sniph_encrypt
  } else {
    // browser
    // should be already set
    //module['sniph_encrypt'] = sniph_encrypt
  }
})(typeof(module)=== 'undefined' ? this : module)
