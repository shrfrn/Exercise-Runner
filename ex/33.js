'use strict'

console.log('EX 33')
console.log('fun with vowels - string manipulations')
// reviewed ✔️

/*
33.+UnitTesting VOWELS (aeiou)
code the following functions:
a. Write a function named printVowelsCount(str) that gets a string and print how
many times each vowel appears.
*/
const VOWELS = 'aeiouAEIOU'

console.log('INPUT: TelAvivBeach')
console.log('EXPECTED:\n Char a appears 1 times\n Char e appears 2 times\n Char i appears 1 times\n Char o appears 0 times\n Char u appears 0 times\n Char A appears 1 times\n Char E appears 0 times\n Char I appears 0 times\n Char O appears 0 times\n Char U appears 0 times');
console.log('ACTUAL:')
printVowelsCount('TelAvivBeach')

function printVowelsCount(str) {

  for (var i = 0; i < VOWELS.length; i++) {
    var currVowel = VOWELS.charAt(i)
    var vowelCount = 0
    for (var j = 0; j < str.length; j++) {
      var char = str.charAt(j)
      if (currVowel === char) {
        vowelCount++
      }
    }
    console.log('Char', currVowel, 'appears', vowelCount, 'times')
  }
}

console.log('\n====================\n')

// b. Write a function that gets a string and changes the vowels to lowercase letters,
// and the rest to uppercase letters (GiZiM GiDoo).

console.log('INPUT: gizim gidoo')
console.log('EXPECTED: GiZiM GiDoo')
console.log('ACTUAL:', selectiveChangeCase('gizim gidoo'))

function selectiveChangeCase(str) {
  var res = ''
  for (var i = 0; i < str.length; i++) {
    var char = str.charAt(i)
    char = (VOWELS.includes(char)) ? char.toLowerCase() : char.toUpperCase()
    res += char
  }
  return 'The selective case string is: ' + res
}

console.log('\n====================\n')

// c. Write a function that gets a string and doubles all the vowels in it.
// Test the functions using the inputs: “aeiouAEIOU” “TelAvivBeach"

console.log('INPUT - aeiouAEIOU')
console.log('EXPECTED - aaeeiioouuAAEEIIOOUU')
console.log('ACTUAL - ', changeToDoubleVowels('aeiouAEIOU'))

console.log('INPUT - TelAvivBeach')
console.log('EXPECTED - TeelAAviivBeeaach')
console.log('ACTUAL - ', changeToDoubleVowels('TelAvivBeach'))

function changeToDoubleVowels(str) {
  var doubleVowelStr = ''
  var char = ''
  for (var i = 0; i < str.length; i++) {
    char = str.charAt(i)
    if (VOWELS.includes(char)) {
      doubleVowelStr += char
    }
    doubleVowelStr += char
  }
  return 'The double vowels string is: ' + doubleVowelStr
}
