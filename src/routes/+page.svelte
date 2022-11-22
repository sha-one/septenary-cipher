<script>

import dictionaryJson from '../libs/dictionary.json'
import dictionarySignaturesJson from '../libs/dictionary-signatures.json'
import dictionaryVowelsJson from '../libs/dictionary-vowels.json'
import dictionaryConsonantsJson from '../libs/dictionary-consonants.json'
import favsBySignatureStore from '../stores/localstore'

import CipherVisual from './components/CipherVisual.svelte';


  //TODO: these put in lib and import
  //* Map letters to numbers
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
  //Debug
  // console.log(cipherMap)
  // console.log(cipherMap['c'])

  
  // Numbers
  function lettersAsNumbers(arr) {
    return arr.map((val) => {
      return cipherMap[val.toLowerCase()] || 0
    })
  }
  
  function sumLettersAsNumbers(arr) {
    let initialValue = 0
    return arr.reduce((prev, cur) => prev + cur, initialValue)
  }
  
  //* Process input (WIP)
  let letters = ''
  let lettersOriginal = '' // for recalling transformations

  $: lettersArr = letters.split("")
  $: lettersAsNumbersArr = lettersAsNumbers(lettersArr)
  $: lettersAsNumbersStr = lettersAsNumbersArr.join('') || '0'
  $: lettersAsNumbersSum = sumLettersAsNumbers(lettersAsNumbersArr)

  // Transform: consonants
  function removeVowels(letter = '') {
    const vowels = ['a', 'e', 'i', 'o', 'u']
    return !vowels.some(item => letter.includes(item))
  }

  $: consonantsArr = lettersArr.filter(removeVowels)
  $: consonantsStr = consonantsArr.join('')

  $: consonantsAsNumbersArr = lettersAsNumbers(consonantsArr)
  $: consonantsAsNumbersStr = consonantsAsNumbersArr.join('')
  $: consonantsAsNumbersSum = sumLettersAsNumbers(consonantsAsNumbersArr)
  
  // Transform: vowels
  function removeConsonants(letter = '') {
    const vowels = ['a', 'e', 'i', 'o', 'u', ' ']
    return vowels.some(item => letter.includes(item))
  }

  $: vowelsArr = lettersArr.filter(removeConsonants)
  $: vowelsStr = vowelsArr.join('')

  $: vowelsAsNumbersArr = lettersAsNumbers(vowelsArr)
  $: vowelsAsNumbersStr = vowelsAsNumbersArr.join('')
  $: vowelsAsNumbersSum = sumLettersAsNumbers(vowelsAsNumbersArr)

  // Actions: remove vowels or consonants
  // $: consonantsOnly = false
  // $: vowelsOnly = false

  // function handleOptions(id = '') {
  //   if (id === 'CONSONANTS') {
  //     vowelsOnly = false
  //   } else if (id === 'VOWELS') {
  //     consonantsOnly = false
  //   }
  // }

  // Dictionary lookup
  $: dictionaryLookupWords = dictionaryJson && dictionaryJson[`${lettersAsNumbersSum}`]
  $: dictionaryLookupCount = dictionaryLookupWords && dictionaryLookupWords.length

  $: dictionarySinaturesLookupWords = dictionarySignaturesJson && dictionarySignaturesJson[`${lettersAsNumbersStr}`]
  // $: dictionarySinaturesLookupCount = dictionarySinaturesLookupWords && dictionarySinaturesLookupWords.length

  $: dictionaryVowelsLookupWords = dictionaryVowelsJson && dictionaryVowelsJson[`${vowelsAsNumbersSum}`]

  $: dictionaryConsonantsLookupWords = dictionaryConsonantsJson && dictionaryConsonantsJson[`${consonantsAsNumbersSum}`]

  //
  $: dictionaryMultipleLookup = dictionaryLookupWords && dictionaryVowelsLookupWords.filter(function (obj) {
    return dictionaryLookupWords.indexOf(obj) !== -1
  })
  $: dictionaryMultipleLookupFinal = dictionaryLookupWords && dictionaryMultipleLookup.filter(function (obj) {
    return dictionaryConsonantsLookupWords.indexOf(obj) !== -1
  })

  // $: console.log(dictionaryMultipleLookupFinal)

  // Debounce
  let typingFinished = false
  function debounce(cb, delay = 250) {
    let timeout

    return (...args) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        cb(...args)
        typingFinished = true
      }, delay)
    }
  }
  const updateOptions = debounce(query => {
    // 
  }, 750)

  //@WIP...
  $: signature = `${lettersAsNumbersSum}-${vowelsAsNumbersSum}-${consonantsAsNumbersSum}`
  let favsBySignatureMap = new Map()
  $: favsBySignatureSelection = favsBySignatureMap.get(signature) || new Set()

  // Enable deep nested JSON stringify for Maps & Sets
  Map.prototype.toJSON = function () {
      return [...this]
  }
  Set.prototype.toJSON = function () {
      return [...this]
  }

  // function replacer(key, value) {
  //   if(value instanceof Map) {
  //     return {
  //       dataType: 'Map',
  //       value: Array.from(value.entries()), // or with spread: value: [...value]
  //     };
  //   } else {
  //     return value;
  //   }
  // }

  // function reviver(key, value) {
  //   if(typeof value === 'object' && value !== null) {
  //     if (value.dataType === 'Map') {
  //       return new Map(value.value);
  //     }
  //   }
  //   return value;
  // }

  function handleClickFavourite(e) {
    const target = e.target || e.srcElement
    const text = target.innerHTML.trim()

    favsBySignatureSelection.add(text)    
    favsBySignatureMap.set(signature, favsBySignatureSelection)
    favsBySignatureMap = favsBySignatureMap
    favsBySignatureStore.set( JSON.stringify(favsBySignatureMap) )
    favsBySignatureSelection = favsBySignatureSelection // re-trigger

    // console.log(`Add: ${text}`, signature, favsBySignatureSelection)
  }

  function handleClickFavouriteRemove(e) {
    let target = e.target || e.srcElement
    let text = target.innerHTML.trim()

    const current = favsBySignatureMap.get(signature)
    current.delete(text)
    favsBySignatureStore.set( JSON.stringify(favsBySignatureMap) )
    favsBySignatureMap = favsBySignatureMap
    favsBySignatureSelection = favsBySignatureSelection // re-trigger

    // console.log(`Remove: ${text}`, signature, favsBySignatureSelection)
  }

  function jsonStringToMapOfSets(arr) {
      let parsed = new Map()
      arr.map(entry => {
        const key = entry[0]
        const values = entry[1]
        // console.log(key) 
        // console.log(values)
        parsed.set(key, new Set(values))
      })
      // console.log(parsed)
      return parsed
  }

  $: {
    if ($favsBySignatureStore && $favsBySignatureStore.length > 0) {
      favsBySignatureMap = jsonStringToMapOfSets(JSON.parse($favsBySignatureStore))
    }
  }

  // $: console.log(favsBySignatureMap)
  // $: console.log($favsBySignatureStore)
  // $: console.log(JSON.parse($favsBySignatureStore))

  //Debug
  $: {
    // console.log(letters, letterValue)
    // console.log(lettersArr, lettersAsNumbersArr, lettersAsNumbersStr)
    // console.log(consonantsOnly, vowelsOnly);
    // console.log(consonantsArr, VowelsArr)
    // console.log(dictionaryJson['1'])
    // console.log(dictionaryLookupWords, dictionaryLookupCount)
    // console.log(lettersAsNumbersStr, dictionarySinaturesLookupWords)
}
</script>

<div class="content-section">
  <div class="content-section-inner">
    <h1 class="text-green-500 pb-0">Septenary Cipher App</h1>
    <p class="text-gray-400 text-sm">Prototype (v0.1) — <strong>by shaOne & LCKing</strong></p> 
    <br />
    <CipherVisual />
  </div>
</div>
<div class="content-section">
  <div class="content-section-inner">
    <h2>Calculate:</h2>
    <input class="dark sum" bind:value={lettersAsNumbersSum} type="number" name="number" maxlength="80" readonly disabled><br/>
    <input class="dark info" bind:value={lettersAsNumbersStr} type="number" name="number" maxlength="80" readonly disabled><br/>
    <input class="" bind:value={letters} on:keydown={()=>{
      typingFinished = false
      updateOptions()
    }} type="text" name="text" maxlength="80" pattern="[A-Za-z]"><br/><br/> 
    <!-- <span class="sum">{lettersAsNumbersSum}</span> <span>{lettersAsNumbersStr}</span><br/><br/> -->
    
    <input class="dark consonants" bind:value={consonantsStr} type="text" name="text" maxlength="80" readonly disabled> <span class="sum">{consonantsAsNumbersSum}</span> <span class="info">{consonantsAsNumbersStr}</span><br/>
    
    <input class="dark vowels" bind:value={vowelsStr} type="text" name="text" maxlength="80" readonly disabled> <span class="sum">{vowelsAsNumbersSum}</span> <span class="info">{vowelsAsNumbersStr}</span><br/><br/>

    <!-- <input on:click={()=>{handleOptions('CONSONANTS')}} bind:checked={consonantsOnly} type="checkbox"> Consonants only <br/>
    <input on:click={()=>{handleOptions('VOWELS')}} bind:checked={vowelsOnly} type="checkbox"> Vowels only <br/><br/> -->
  </div>
</div>
<div class="content-section">
  <div class="content-section-inner">
    <div>
      <h2><strong>Dictionary lookup</strong> (by signature of: <span class="info">{lettersAsNumbersStr}</span> )</h2>
      {#if dictionarySinaturesLookupWords && typingFinished}
        <div class="dictionary-container">
          {#each dictionarySinaturesLookupWords as item (item)}
            <div>{item} </div>
          {/each}
        </div>
        {/if}
        <br />
        <!-- WIP -->
      <h2><strong>Dictionary lookup</strong> (by total sum: <span class="info">{lettersAsNumbersSum}</span>, vowel sum: <span class="info">{vowelsAsNumbersSum}</span> and consonant sum: <span class="info">{consonantsAsNumbersSum}</span>)</h2>
      {#if dictionaryMultipleLookupFinal && typingFinished}
      <p class="results-text">Results: {dictionaryMultipleLookupFinal.length}</p>
      {#if favsBySignatureSelection.size}
        <div>
          {#each [ ...favsBySignatureSelection ] as fav (fav)}
          <span class="result-item fav" on:click={(e)=>{handleClickFavouriteRemove(e)}}>{fav} </span>
          {/each}
        </div>
        <br />
      {/if}
        <div class="dictionary-container scroll">
          {#each dictionaryMultipleLookupFinal as item (item)}
            <div class="result-item" on:click={(e)=>{handleClickFavourite(e)}}>{item} </div>
          {/each}
        </div>
        {/if}
        <br />
      <!-- <h2><strong>Dictionary lookup</strong> (by consonant sum of: <span class="info">{consonantsAsNumbersSum}</span> )</h2>
      {#if dictionaryConsonantsLookupWords && typingFinished}
        <div class="dictionary-container">
          {#each dictionaryConsonantsLookupWords as item (item)}
            <div>{item} </div>
          {/each}
        </div>
        {/if}
        <br /> -->
      <!-- <h2><strong>Dictionary lookup</strong> (by vowel sum of: <span class="info">{vowelsAsNumbersSum}</span> )</h2>
      {#if dictionaryVowelsLookupWords && typingFinished}
        <div class="dictionary-container">
          {#each dictionaryVowelsLookupWords as item (item)}
            <div>{item} </div>
          {/each}
        </div>
        {/if}
        <br /> -->
        <!-- <h2><strong>Dictionary lookup</strong> (by sum of: <span class="sum">{lettersAsNumbersSum}</span>)</h2>
      {#if dictionaryLookupWords && typingFinished}
        <div class="dictionary-container">
          {#each dictionaryLookupWords as item (item)}
            <div>{item} </div>
          {/each}
        </div>
      {/if} -->
    </div>
  </div>
</div>

<style lang="postcss">
/* ... */
input {
  @apply text-2xl px-4 py-2 bg-slate-700 font-mono;
}
input.dark {
  @apply bg-slate-900;
}
input.sum,
:global(.sum) {
  @apply text-green-600;
}
input.consonants,
:global(.consonants) {
  @apply text-indigo-500;
}
input.vowels,
:global(.vowels) {
  @apply text-yellow-500;
}
:global(.info) {
  @apply text-slate-600;
}
.dictionary-container {
  @apply grid grid-cols-4;
}
.dictionary-container.scroll {
  @apply max-h-52 overflow-y-scroll bg-slate-800 px-4 py-2;
}
.results-text {
  @apply text-base pb-4 text-slate-500;
}

.result-item {
  @apply cursor-pointer;
}
.result-item:hover {
  @apply text-slate-500;
}

.result-item.fav {
  @apply text-green-500 bg-slate-700 inline-block px-2 rounded-md mr-2;
}


</style>
