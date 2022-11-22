import { browser } from '$app/environment';
import { writable } from 'svelte/store';
 
const defaultValue = null //JSON.stringify({})
const initialValue = browser ? window.localStorage.getItem('favsBySignatureMap') ?? defaultValue : defaultValue
 
const favsBySignatureStore = writable(initialValue)
 
favsBySignatureStore.subscribe((value) => {
  // console.log(browser, value)
  if (browser) {
    window.localStorage.setItem('favsBySignatureMap', value)
  }
})
 
export default favsBySignatureStore