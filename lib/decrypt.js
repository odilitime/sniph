if (typeof(require) !== 'undefined') {
  const common = require('./common.js')
  for(var funcName in common) {
    global[funcName] = common[funcName]
  }
}

function sniph_decrypt(char_set, passphrase, msg, depth, rows, cols) {
  var str = ''
  for(var i in msg) {
    var t = 0
    var code = parseInt(msg[i])
    if (i % 2 == 0) {
      // row
      t = code % rows
      if (!t) t = rows
    } else {
      // col
      t = code % cols
      if (!t) t = cols
    }
    if (t == 10) t = 0
    //console.log('decode code', code, '=', t)
    str += '' + t
  }
  //console.log('decoding', str)
  // break it into blocks of 4 chars
  var chars = []
  for(var i = 0; i < Math.floor(str.length / 4); ++i) {
    var code = str.substr(4 * i, 4)
    chars.push(code)
  }
  //console.log('characters', chars)
  var decoding = ''
  var k = 0
  var size = rows * cols
  for(var i in chars) {
    var tset = chars[i]
    // positional secret charset adjustment
    //console.log('shiftin', i, 'is', k)
    var arr = getShifted(char_set, passphrase, k, cols, rows, depth, size)
    var shifted_set = arr[0]
    //console.log('shifted_set', shifted_set)
    var k = arr[1]

    // d2y, d2x, dNy, dNx
    var x1 = parseInt(tset[0]); if (!x1) x1 = 10
    var y1 = parseInt(tset[1]); if (!y1) y1 = 10
    var x2 = parseInt(tset[2]); if (!x2) x2 = 10
    var y2 = parseInt(tset[3]); if (!y2) y2 = 10

    var d2 = ((x1 - 1) * cols) + (y1 - 1)
    var dN = ((x2 - 1) * cols) + (y2 - 1)
    //console.log(x1, y1, x2, y2, 'selected', d2, dN)

    var char_pos = convert2d21d(d2 + 1, dN + 1, size, size)
    //console.log(d2, dN, '==', char_pos)
    var out = shifted_set[char_pos]
    //console.log(char_pos, '=>', shifted_set[char_pos])
    //console.log('char_pos', char_pos, '/', shifted_set.length, '=', out)
    decoding += out
  }
  return decoding
}

(function(ref) {
  if (ref.constructor.name == 'Module') {
    // node
    module.exports = sniph_decrypt
  } else {
    // browser
    //module['sniph_encrypt'] = sniph_encrypt
  }
})(typeof(module)=== 'undefined' ? this : module)
