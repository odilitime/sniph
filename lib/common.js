var mod = {}

/**
 *
 */
mod.passphraseToDimensions = function(passphrase) {
  if (!passphrase) {
    console.error("no passphrase given to secretToDimensions")
    return
  }
  while(passphrase.length < 4) {
    passphrase += passphrase // double the length
  }
  return {
    w: (passphrase[0].charCodeAt(0) % 6) + 4,
    h: (passphrase[1].charCodeAt(0) % 6) + 4,
    d: (passphrase[2].charCodeAt(0) % 6) + 4,
  }
}

/**
 * get an array of positions of character in string
 */
mod.findOccurences = function(letter, str) {
  var parts = str.split(letter)
  var positions = []
  var pos = 0
  for(var i in parts) {
    var part = parts[i]
    pos += part.length + letter.length
    positions.push(pos - 1)
  }
  positions.pop()
  return positions
}

/**
 * convert 1d dimensional position to 2d dimensional coordinates
 */
mod.convert1d22d = function(pos, cols, rows) {
  // but the input needs to be 0-15 or 1-16
  // our input is up to 16
  // (16 / 4) + 1 = 5 <= 4
  // 1-4 instead of 0-3
  var y = Math.floor((pos) / cols) + 1
  var x = (pos % cols) + 1
  if (x > cols) console.warn(pos, '=>', x, 'x > cols', cols)
  if (y > rows) console.warn(pos, '=>', y, 'y > rows', rows)
  //console.log('pos', pos, 'x', x, 'y', y, 'in', cols, 'width')
  return [x, y]
}

/**
 * convert 2d dimensional position to 1d dimensional coordinates
 */
mod.convert2d21d = function(x, y, cols, rows) {
  pos = (cols * (y - 1)) + (x - 1)
  return pos
}

/**
 * shift character set by key
 */
mod.getShifted = function(char_set, passphrase, key, cols, rows, depth, size) {
  shift = 0 // reset shift

  // up to the last 2 tables
  for(var j = 0; j < depth - 2; ++j) {
    var letter = passphrase[key]
    var pos = char_set.indexOf(letter)

    var arr = mod.convert1d22d(pos % size, cols, rows)
    var x = arr[0]
    var y = arr[1]
    shift += y - x

    //console.log(j, key, 'letter', letter, 'at', pos, 'gives', x, y, 'shift becomes', shift)
    key++; if (key == passphrase.length) key = 0
  }
  // make sure shift is positive
  while(shift < 0) shift += char_set.length
  // cut the deck
  var shifted_set = char_set.substr(shift, char_set.length) + char_set.substr(0, shift)
  return [shifted_set, key]
}

/**
 * grow char_set until it's the next "power of two" size up
 */
mod.scaleCharset = function(char_set, size) {
  //console.log('char_set is', char_set.length)
  while(char_set.length < Math.pow(size, 2)) {
    char_set += char_set
    char_set = char_set.substr(0, Math.pow(size, 2))
  }
  return char_set
}

// not sure why but node needs this...
// but it makes node work...
for(var funcName in mod) {
}

// node and browser compatibility
(function(ref) {
  if (ref.constructor.name != 'Module') {
    // browser
    for(var funcName in mod) {
      ref[funcName] = mod[funcName]
    }
  } else {
    // node
    module.exports = {}
    for(var funcName in mod) {
      //console.log('registering', funcName)
      module.exports[funcName] = mod[funcName]
    }
  }
})(typeof module === 'undefined' ? this : module)
