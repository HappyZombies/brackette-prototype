/**
 * These helpers get whatever current value is in the local storage.
 */
import * as locNames from './localStorageNames'

export const isAppSetup = () => {
  return JSON.parse(localStorage.getItem(locNames.IS_APP_SETUP))
}

export const isBracketteSet = () => {
  return JSON.parse(localStorage.getItem(locNames.BRACKETTE)) !== null
}

export const getBracketteObj = () => {
  return JSON.parse(localStorage.getItem(locNames.BRACKETTE))
}

export const updateBracketteObj = (data) => {
  localStorage.setItem(locNames.BRACKETTE, JSON.stringify(data))
}

export const isHost = () => {
  return JSON.parse(localStorage.getItem(locNames.BRACKETTE)).role === 'host'
}

export const isOpenMatchesSet = () => {
  return JSON.parse(localStorage.getItem(locNames.OPEN_MATCHES)) !== null
}

export const getOpenMatchesObj = () => {
  return JSON.parse(localStorage.getItem(locNames.OPEN_MATCHES))
}

export const removeOpenMatchesObj = () => {
  localStorage.removeItem(locNames.OPEN_MATCHES)
}

export const setOpenMatchesObj = (data) => {
  localStorage.setItem(locNames.OPEN_MATCHES, JSON.stringify(data))
}

// Look into this particular object more...
export const isCurrentMatchSet = () => {
  return JSON.parse(localStorage.getItem(locNames.CURRENT_MATCH)) !== null
}

export const getCurrentMatchObj = () => {
  return JSON.parse(localStorage.getItem(locNames.CURRENT_MATCH))
}

export const removeCurrentMatchObj = () => {
  localStorage.removeItem(locNames.CURRENT_MATCH)
}

export const setCurrentMatchObj = (data) => {
  localStorage.setItem(locNames.CURRENT_MATCH, JSON.stringify(data))
}
