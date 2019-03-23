// v0.5 Sniph try 2
const common = require('./lib/common.js')
const sniph_encrypt = require('./lib/encrypt.js')
const sniph_decrypt = require('./lib/decrypt.js')

var passphrase = 'ALICE BOB'
var plaintext  = 'Hello world'
var char_set   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,?!:;\'\"/\\|<>+-=(){}[]`~@#$%^&*1234567890 \n'
// end inputs

var obj = common.secretToDimensions(passphrase)
var cols  = obj.w // 4-10
var rows  = obj.h // 4-10
var depth = obj.d // 4-10

// scale up charset to next "power of two" size
var size = rows * cols
char_set = common.scaleCharset(char_set, size)

var codes = sniph_encrypt(char_set, passphrase, plaintext, depth, rows, cols)
console.log('encrypted codes', codes)

var result = sniph_decrypt(char_set, passphrase, codes, depth, rows, cols)
if (result != plaintext) console.error('DECRYPTION FAILED', result)

// unit test to make sure the conversion works as expected
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
