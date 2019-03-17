var mod = {}

/**
 * get an array of positions of character in string
 */
mod.findOccurences = function(letter, str) {
  //console.log('str', str)
  var parts = str.split(letter)
  var positions = []
  var pos = 0
  //console.log(letter, 'parts', parts.length)
  for(var i in parts) {
    var part = parts[i]
    //console.log(str, part)
    pos += part.length + letter.length
    positions.push(pos - 1)
  }
  positions.pop()
  //console.log('options', positions)
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
  var y = Math.floor(pos / rows) + 1
  var x = (pos % cols) + 1
  if (y > cols) console.warn(pos, '=>', y, 'y > cols', cols)
  if (x > rows) console.warn(pos, '=>', x, 'x > rows', rows)
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

// shift character set by key
mod.getShifted = function(char_set, passphrase, key, cols, rows, depth, size) {
  shift = 0 // reset shift
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
  //console.log(key, 'shift is now', shift)
  //console.log('original charset', char_set)
  if (shift < 0) shift += char_set.length
  //console.log('using shift of', shift)
  var shifted_set = char_set.substr(shift, char_set.length) + char_set.substr(0, shift)
  //console.log('shifted  charset', shifted_set)
  return [shifted_set, key]
}

mod.scaleCharset = function(char_set, size) {
  //console.log('char_set is', char_set.length)
  while(char_set.length < Math.pow(size, 2)) {
    char_set += char_set
    char_set = char_set.substr(0, Math.pow(size, 2))
  }
  return char_set
}

// not sure why but node needs this...
//console.log('mod', mod)
for(var funcName in mod) {
  //console.log('test', funcName)
}

(function(ref) {
  if (ref.constructor.name != 'Module') {
    for(var funcName in mod) {
      ref[funcName] = mod[funcName]
    }
  } else {
    //console.log('Node detected')
    module.exports = {}
    for(var funcName in mod) {
      //console.log('registering', funcName)
      module.exports[funcName] = mod[funcName]
    }
  }
})(typeof module === 'undefined' ? this : module)
