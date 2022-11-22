import * as fs from 'fs';
import dictionaryJson from './words_dictionary.json' assert {type: 'json'}

//TODO: these put in lib and import
const cipherMap = {
  'a': 1,
  'b': 2,
  'c': 3,
  'd': 4,
  'e': 5,
  'f': 6,
  'g': 7,
  'h': 6,
  'i': 5,
  'j': 4,
  'k': 3,
  'l': 2,
  'm': 1,
  'n': 1,
  'o': 2,
  'p': 3,
  'q': 4,
  'r': 5,
  's': 6,
  't': 7,
  'u': 6,
  'v': 5,
  'w': 4,
  'x': 3,
  'y': 2,
  'z': 1,
}

function lettersAsNumbers(arr) {
  return arr.map((val) => {
    return cipherMap[val.toLowerCase()] || 0
  })
}

function sumLettersAsNumbers(arr) {
  let initialValue = 0
  return arr.reduce((prev, cur) => prev + cur, initialValue)
}

// Loop

function buildDictionaryBySum() {
  let limit = 0;
  let wordsBySumObj = {}
  
  for (const key in dictionaryJson){
    limit++
    if(dictionaryJson.hasOwnProperty(key)){
    // if(limit > 1900 && limit < 2000 && dictionaryJson.hasOwnProperty(key)){
      
      let lettersAsNumbersArr = lettersAsNumbers(key.split(""))
      let lettersAsNumbersStr = lettersAsNumbersArr.join('')
      let lettersAsNumbersSum = sumLettersAsNumbers(lettersAsNumbersArr)
  
      if ( wordsBySumObj[lettersAsNumbersSum] ) {
        wordsBySumObj[lettersAsNumbersSum].push(`${key}`)
      } else {
        wordsBySumObj[lettersAsNumbersSum] = [`${key}`]
      }
      // console.log(`${key} : ${dictionaryJson[key]} : ${lettersAsNumbersSum}`)
    }
  }
  // console.log(wordsBySumObj)
  
  let data = JSON.stringify(wordsBySumObj)
  fs.writeFileSync('./dictionary.json', data)
}
// buildDictionaryBySum()

function buildDictionaryByNumericSignature() {
  let limit = 0;
  let wordsBySumObj = {}
  
  for (const key in dictionaryJson){
    limit++
    if(dictionaryJson.hasOwnProperty(key)){
    // if(limit > 1900 && limit < 2000 && dictionaryJson.hasOwnProperty(key)){
      
      let lettersAsNumbersArr = lettersAsNumbers(key.split(""))
      let lettersAsNumbersStr = lettersAsNumbersArr.join('')
      // let lettersAsNumbersSum = sumLettersAsNumbers(lettersAsNumbersArr)
  
      if ( wordsBySumObj[lettersAsNumbersStr] ) {
        wordsBySumObj[lettersAsNumbersStr].push(`${key}`)
      } else {
        wordsBySumObj[lettersAsNumbersStr] = [`${key}`]
      }
      // console.log(`${key} : ${dictionaryJson[key]} : ${lettersAsNumbersArr}`)
    }
  }
  // console.log(wordsBySumObj)
  
  let data = JSON.stringify(wordsBySumObj)
  fs.writeFileSync('./dictionary-signatures.json', data)
}
// buildDictionaryByNumericSignature()

//TODO: Break the word into sum total, vowels total, and consonants. This will give 3 different totals.. then find matching words with three of the same totals. For example Mercury - Total = 27, Vowels only = 11, Consonants = 16 a matching word is Jesus - Total = 27, Vowels only = 11, Consonants only = 16

function removeConsonants(letter = '') {
  const vowels = ['a', 'e', 'i', 'o', 'u', ' ']
  return vowels.some(item => letter.includes(item))
}

function removeVowels(letter = '') {
  const vowels = ['a', 'e', 'i', 'o', 'u']
  return !vowels.some(item => letter.includes(item))
}

function buildDictionaryByVowelSum() {
  let limit = 0;
  let wordsByVowelSumObj = {}
  
  for (const key in dictionaryJson){
    limit++
    if(dictionaryJson.hasOwnProperty(key)){
    // if(limit > 1950 && limit < 2000 && dictionaryJson.hasOwnProperty(key)){
      
      let lettersArr = key.split("")

      let vowelsArr = lettersArr.filter(removeConsonants)
      let vowelsAsNumbers = lettersAsNumbers(vowelsArr)
      let vowelsAsNumbersSum = sumLettersAsNumbers(vowelsAsNumbers)
      // let vowelsStr = vowelsArr.join('')

      //* Vowel sum
      if ( wordsByVowelSumObj[vowelsAsNumbersSum] ) {
        wordsByVowelSumObj[vowelsAsNumbersSum].push(`${key}`)
      } else {
        wordsByVowelSumObj[vowelsAsNumbersSum] = [`${key}`]
      }
      // console.log(`${key} : ${vowelsAsNumbersSum}`, vowelsArr)
      // console.log(wordsByVowelSumObj)

      //TODO:additional idea -  Vowel signatures
      // if ( wordsByVowelSumObj[vowelsStr] ) {
      //   wordsByVowelSumObj[vowelsStr].push(`${key}`)
      // } else {
      //   wordsByVowelSumObj[vowelsStr] = [`${key}`]
      // }
      // console.log(`${key} : ${dictionaryJson[key]} : ${vowelsArr}`, wordsByVowelSumObj)
    }
  }
  // console.log(wordsBySumObj)
  
  let data = JSON.stringify(wordsByVowelSumObj)
  fs.writeFileSync('./dictionary-vowels.json', data)
}
// buildDictionaryByVowelSum()

function buildDictionaryByConsonantSum() {
  let limit = 0;
  let wordsByConsonantSumObj = {}
  
  for (const key in dictionaryJson){
    limit++
    if(dictionaryJson.hasOwnProperty(key)){
    // if(limit > 1950 && limit < 2000 && dictionaryJson.hasOwnProperty(key)){
      
      let lettersArr = key.split("")

      let consonantsArr = lettersArr.filter(removeVowels)
      let consonantsAsNumbers = lettersAsNumbers(consonantsArr)
      let consonantsAsNumbersSum = sumLettersAsNumbers(consonantsAsNumbers)
      // let consonantsStr = consonantsArr.join('')

      //* Consonant sum
      if ( wordsByConsonantSumObj[consonantsAsNumbersSum] ) {
        wordsByConsonantSumObj[consonantsAsNumbersSum].push(`${key}`)
      } else {
        wordsByConsonantSumObj[consonantsAsNumbersSum] = [`${key}`]
      }
      // console.log(`${key} : ${consonantsAsNumbersSum}`, consonantsArr)
      // console.log(wordsByConsonantSumObj)

      //TODO:additional idea -  Consonant signatures
      // if ( wordsByConsonantSumObj[consonantsStr] ) {
      //   wordsByConsonantSumObj[consonantsStr].push(`${key}`)
      // } else {
      //   wordsByConsonantSumObj[consonantsStr] = [`${key}`]
      // }
      // console.log(`${key} : ${dictionaryJson[key]} : ${consonantsArr}`, wordsByConsonantSumObj)
    }
  }
  // console.log(wordsBySumObj)
  
  let data = JSON.stringify(wordsByConsonantSumObj)
  fs.writeFileSync('./dictionary-consonants.json', data)
}
buildDictionaryByConsonantSum()