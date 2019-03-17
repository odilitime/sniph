if (typeof(require) !== 'undefined') {
  common = require('./common.js')
  for(var funcName in common) {
    global[funcName] = common[funcName]
  }
}

function sniph_encrypt(char_set, passphrase, plaintext, depth, rows, cols, offset) {
  var encoding = ''
  var key = 0
  var shift = 0
  var size = rows * cols
  for(var i in plaintext) {
    //console.log('shiftin', i, 'is', key)
    var arr = getShifted(char_set, passphrase, key, cols, rows, depth, size)
    var shifted_set = arr[0]
    var key = arr[1]

    var letter = plaintext[i]
    var options = findOccurences(letter, shifted_set)
    /*
    for(var j in options) {
      console.log(j, 'test=', options[j], '=>', shifted_set[options[j]])
    }
    */
    //console.log(letter, 'in shiftset_set', options)
    var randOpt = Math.floor(Math.random() * options.length)
    var version = options[randOpt]
    //console.log(letter, '=>', shifted_set[version], 'random', randOpt, '/', options.length, options)
    var arr = convert1d22d(version, size, size)
    var d2 = arr[0]
    var dN = arr[1]
    //console.log(letter, '==', shifted_set[version], '~', version, version % size, 'selected', d2, dN)

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
    //console.log(version, '==', d2y, d2x, dNy, dNx)
    encoding += s
  }
  //console.log('encoding', encoding)
  // convert encoding to positions in tables
  var cipher_text = ''
  for(var i in encoding) {
    var x = parseInt(encoding[i])
    var r = Math.floor(Math.random() * 999999)
    var w = 1
    var t = x
    //console.log('x', x, 'r', r, 'i%2', i%2 == 0)
    if (i%2 == 0) {
      // row
      t += rows
      while(t < 10) {
        w++
        t += rows
      }
      if (x == rows) {
        x = 0
        w++
      }
      //console.log('row w', w, 'r%w', r%w, 't', t)
      x += (r % w) * rows
    } else {
      // col
      t += cols
      while(t < 10) {
        w++
        t += cols
      }
      if (x == cols) {
        x = 0
        w++
      }
      //console.log('col w', w, 'r%w', r%w, 't', t)
      x += (r % w) * cols
    }
    // zeropad
    var str = x + ''
    //if (str.length == 1) str = '0'+str
    //console.log('final x', x)
    //console.log('encode', encoding[i], '=', str)
    cipher_text += str
  }
  // FIXME: offset it again
  return cipher_text
}

(function(ref) {
  if (ref.constructor.name == 'Module') {
    // node
    module.exports = sniph_encrypt
  } else {
    // browser
    //module['sniph_encrypt'] = sniph_encrypt
  }
})(typeof(module)=== 'undefined' ? this : module)
