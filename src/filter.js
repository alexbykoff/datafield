import { findProp } from './utils'

function isGreater (el, selector, value) {
  let propValue = findProp(el, selector)
  if (Array.isArray(propValue)) propValue = propValue.length
  if (value instanceof Date) propValue = new Date(propValue)
  return propValue > value
}

function isGreaterOrEq (el, selector, value) {
  let propValue = findProp(el, selector)
  if (Array.isArray(propValue)) propValue = propValue.length
  if (value instanceof Date) propValue = new Date(propValue)
  return propValue >= value
}

function isLess (el, selector, value) {
  let propValue = findProp(el, selector)
  if (Array.isArray(propValue)) propValue = propValue.length
  if (value instanceof Date) propValue = new Date(propValue)
  return propValue < value
}

function isLessOrEq (el, selector, value) {
  let propValue = findProp(el, selector)
  if (Array.isArray(propValue)) propValue = propValue.length
  if (value instanceof Date) propValue = new Date(propValue)
  return propValue <= value
}

function isEq (el, selector, value) {
  let propValue = findProp(el, selector)
  if (Array.isArray(propValue)) propValue = propValue.length
  if (value instanceof Date) propValue = new Date(propValue)
  return value instanceof Date ? propValue.getTime() === value.getTime() : propValue === value
}

function isNotEq (el, selector, value) {
  let propValue = findProp(el, selector)
  if (Array.isArray(propValue)) propValue = propValue.length
  if (value instanceof Date) propValue = new Date(propValue)
  return value instanceof Date ? propValue.getTime() !== value.getTime() : propValue !== value
}

function isLike (el, selector) {
  return Boolean(findProp(el, selector))
}

export { isGreater, isGreaterOrEq, isLess, isLessOrEq, isEq, isNotEq, isLike }
