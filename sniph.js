// v0.5 Sniph try 2
const common = require('./lib/common.js')
const sniph_encrypt = require('./lib/encrypt.js')
const sniph_decrypt = require('./lib/decrypt.js')

var rows = 4 // 4-10
var cols = 4 // 4-10
var depth = 4 // 4-10?
var offset = 0
var passphrase = 'ALICE BOB'
var plaintext = 'Hello world'

// end inputs

var size = rows * cols
var char_set = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,?!:;\'\"/\\|<>+-=(){}[]`~@#$%^&*1234567890 \n'

//console.log('common', common)

char_set = common.scaleCharset(char_set, size)

//console.log('char_set is now', char_set.length)

var codes = sniph_encrypt(char_set, passphrase, plaintext, depth, rows, cols, offset)
console.log('encrypted codes', codes)
var result = sniph_decrypt(char_set, passphrase, codes, depth, rows, cols)
//console.log('decrypted codes', result)
if (result != plaintext) console.error('DECRYPTION FAILED', result)

/*
var maxx = 16
var maxy = 16
for(var i=0; i<257; ++i) {
  var test = i % (maxx*maxy)
  var arr = convert1d22d(test, maxx, maxy)
  var rev = convert2d21d(arr[0], arr[1], maxx, maxy)
  if (rev != test) {
    console.log('corrupt', i, test, '!=', rev, 'via', arr[0], arr[1])
  }
}
*/
