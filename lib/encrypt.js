// node/browser support
if (typeof(require) !== 'undefined') {
  common = require('./common.js')
  for(var funcName in common) {
    global[funcName] = common[funcName]
  }
}

/**
 * encode plaintext using passhare with charset in this size matrix with the following ceaser-shift offset
 */
function sniph_encrypt(char_set, passphrase, plaintext, depth, rows, cols, offset) {
  // encode plaintext into first set of positions
  var encoding = ''
  var key = 0
  var shift = 0
  var size = rows * cols// v0.1 Snoph xD

// TODO: stutter
// TODO:

var plaintext = 'Hello world'
var password = 'ALICE BOB'

function getDimensions(secret) {
  var dimensions = []
  if (secret.length < 3) {
    console.warn('secret is too short', secret)
    return
  }
  var dimNum = secret.charCodeAt(0) % (100+16)
  dimNum += 16

  var w = secret.charCodeAt(1) % 6
  w += 4
  var h = secret.charCodeAt(2) % 6
  h += 4

  for(var i=0; i < dimNum; ++i) {
    // clamp value to 4-9
    var value = secret.charCodeAt(i % secret.length) % 6
    value += 4
    //value = w * h
    dimensions.push(value)
  }

  return dimensions
}

/*
// last dimension 256
// in the last dimension, the small table size is 16 = 16 totals (16chars*16tables)
// largest table is 100 = 2.5 tables total
// 3-16 tables in
// no less than 16 in the final dimensions
*/

// 3x3 size in the 3rd dimension
// table size 9 char, 81 tables

// all tables in a tree are the same size
// 1st dimension = 1 tables    9 cells
// 2nd dimension = 9 tables   81 cells
// 3rd dimension = 81 tables 729 cells

// (1st/2nd) being deterministic, leaves 9 potential tables for 3rd dimension
// valid 3rd dimension = 9 tables 81 cells

// wants every character to have 1.5-2 unique code per symbol
// they don't have the dimensionality

//

function lookUpXD(arr, secret) {
  // FIXME use secret to caesar shift the starting position
  var charPos = BigInt(0)
  var levelValue = BigInt(1)
  for(var level in arr) {
    var cur = arr[level][0]
    var max = arr[level][1]
    //console.log('cur', cur, 'max', max, 'levelValue', levelValue)
    // what about over flow? probably fine for lower dimensions
    charPos += levelValue * BigInt(cur)
    // FIXME: isn't going to handle large values well
    levelValue *= BigInt(max) // update the levelValue
  }
  charPos %= BigInt(98)
  if (charPos[96]) return '\t'
  if (charPos[97]) return '\n'
  return String.fromCharCode(32 + Number(charPos))
}

var findCharCacheXd = {} // store cache values
function findCharXD(findChar, secret, dims) {

  if (findCharCacheXd[findChar] !== undefined) {
    if (Math.random() > 0.5 && findCharCacheXd[findChar].length > 4) {
      var idx = Math.floor(Math.random() * findCharCacheXd[findChar].length)
      var code = findCharCacheXd[findChar][idx]
      console.log('using cache of', findCharCacheXd[findChar].length, 'for', findChar)
      return code
    }
  }
  while(1) {
    var pos = []
    var code = []
    for(var i in dims) {
      var max = dims[i]
      cur = Math.floor(Math.random() * max)
      code.push(cur)
      pos.push([cur, max])
    }
    var resultChar = lookUpXD(pos, secret)
    //console.log(resultChar)
    if (resultChar == findChar) {
      return code
    }
    if (findCharCacheXd[resultChar] === undefined) findCharCacheXd[resultChar] = []
    findCharCacheXd[resultChar].push(code)
  }
}

function encode_sniph(plaintext, secret) {
  var dims = getDimensions(secret)
  var result = []
  for(var i in plaintext) {
    var letter = plaintext[i]
    var code = findCharXD(letter, secret, dims)
    result.push(code)
    console.log(letter, 'found at', code.join(','))
  }
  return result
}

function decode_sniph(codes, secret) {
  var dims = getDimensions(secret)
  var result = ""
  for(var i in codes) {
    var path = codes[i]
    var position = []
    for(var j in path) {
      var cur = path[j]
      var max = dims[j]
      position.push([cur, max])
    }
    result += lookUpXD(position, secret)+','
  }
  return result
}

function stutterPattern(secret) {
  var dims = getDimensions(secret)
  // we know there's dims.length codes
  // now we need to make a pattern
  // make an array of 1-3 stutters
}

var dims = getDimensions(password)
console.log('dims', dims.length, ':', dims)
var encrypted = encode_sniph(plaintext, password)
console.log('encrypted codes:')
for(var i in encrypted) {
  console.log(encrypted[i].join(','))
}

console.log('resultText', decode_sniph(encrypted, password))

  for(var i in plaintext) {

    // get shifted by secret character set
    var arr = getShifted(char_set, passphrase, key, cols, rows, depth, size)
    var shifted_set = arr[0]
    var key = arr[1] // next shift

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
  // caesar shift
  cipher_text = cipher_text.substr(offset) + cipher_text.substr(0, offset)
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
