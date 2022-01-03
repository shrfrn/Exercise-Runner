'use strict'

console.log('EX 35')
console.log('encrypt - decrypt');
// reviewed ✔️

// 35.+UnitTesting Write the function encrypt that gets a string and encrypts it. It replaces
// each character code with the code+5 (I.e. 'r' will be replaced by: 'w'). NOTE: The
// function should encrypt the entire string by shifting each letter as described above.
// Now write the function decrypt that decrypts a message. Tip: try to write in the
// console: 'ABC'.charCodeAt(0)
// Tip - search for the opposite function to charCodeAt
// Copyright 2020 © misterBIT
// Bonus: extract the common logic to an encode function that both encrypts and
// decrypts.

console.log('INPUT - rrr')
console.log('EXPECTED - www',)
console.log('ACTUAL - ', encrypt('rrr'))

console.log('INPUT - www')
console.log('EXPECTED - rrr',)
console.log('ACTUAL - ', decrypt('www'))


function encrypt(str) {
    var encryptedStr = ''
    for (var i = 0; i < str.length; i++) {
        var currCharCode = str.charCodeAt(i)
        var encryptedChar = String.fromCharCode(currCharCode + 5)
        encryptedStr += encryptedChar
    }
    return encryptedStr
}

function decrypt(str) {
    var encryptedStr = ''
    for (var i = 0; i < str.length; i++) {
        var currCharCode = str.charCodeAt(i)
        var encryptedChar = String.fromCharCode(currCharCode - 5)
        encryptedStr += encryptedChar
    }
    return encryptedStr
}

// BONUS:
console.log('INPUT - abc,true',)
console.log('EXPECTED - fgh ',)
console.log('ACTUAL - ', encode('abc', true))

console.log('INPUT - fgh,false',)
console.log('EXPECTED - abc ',)
console.log('ACTUAL - ', encode('fgh', false))

function encode(str, isEncrypt) {
    var encryptedStr = ''
    var diff = isEncrypt ? 5 : -5
    for (var i = 0; i < str.length; i++) {
        var currCharCode = str.charCodeAt(i)
        var encryptedChar = String.fromCharCode(currCharCode + diff)
        encryptedStr += encryptedChar
    }
    return encryptedStr
}