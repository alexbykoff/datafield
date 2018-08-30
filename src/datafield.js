import { findProp, randomTakes, checkTypes } from './utils'
import { isGreater, isLess, isLessOrEq, isGreaterOrEq, isEq, isNotEq, isLike } from './filter'
import error from './errors'

export default class DataField {
  constructor (array = error('NO_CONS'), selector) {
    if (!Array.isArray(array)) error('NOT_ARRAY')
    this.data = array.slice(0) // https://jsperf.com/cloning-arrays/3
    this.caret = 0
    this.selector = selector
  }

  exists (prop = this.selector) {
    const data = this.data.filter(el => findProp(el, prop) !== undefined)
    return new DataField(data, this.selector)
  }

  has (prop) {
    const data = this.data.filter(el => {
      const value = findProp(el, prop)
      return Array.isArray(value) ? value.length : value
    })
    return new DataField(data, this.selector)
  }

  take (number = 1) {
    const data = this.data.slice(this.caret, this.caret + number)
    this.caret += number
    return new DataField(data, this.selector)
  }

  get length () {
    this.__reset()
    return this.data.length
  }

  takeRandom (number = 1) {
    if (typeof number !== 'number') number = parseInt(String(number))
    if (isNaN(number)) number = 1
    number = Math.floor(number)
    if (number > this.data.length) number = this.data.length
    const selected = randomTakes(this.data.length, number)
    const data = this.data.filter((el, i) => selected.includes(i))
    return new DataField(data, this.selector)
  }

  where (selector) {
    this.selector = selector
    return this
  }

  isTruthy () {
    if (!this.selector) error('NO_SEL')
    const data = this.data.filter(el => isLike(el, this.selector))
    return new DataField(data, this.selector)
  }

  isFalsy () {
    if (!this.selector) error('NO_SEL')
    const data = this.data.filter(el => !isLike(el, this.selector))
    return new DataField(data, this.selector)
  }

  eq (value) {
    if (!this.selector || value === undefined) error('NO_SEL_OR_VAL')
    const data = this.data.filter((el) => isEq(el, this.selector, value))
    return new DataField(data, this.selector)
  }

  not (value) {
    if (!this.selector || value === undefined) error('NO_SEL_OR_VAL')
    const data = this.data.filter((el) => isNotEq(el, this.selector, value))
    return new DataField(data, this.selector)
  }

  gt (value) {
    if (!this.selector || value === undefined) error('NO_SEL_OR_VAL')
    const data = this.data.filter((el) => isGreater(el, this.selector, value))
    return new DataField(data, this.selector)
  }

  lt (value) {
    if (!this.selector || value === undefined) error('NO_SEL_OR_VAL')
    const data = this.data.filter((el) => isLess(el, this.selector, value))
    return new DataField(data, this.selector)
  }

  gte (value) {
    if (!this.selector || value === undefined) error('NO_SEL_OR_VAL')
    const data = this.data.filter((el) => isGreaterOrEq(el, this.selector, value))
    return new DataField(data, this.selector)
  }

  lte (value) {
    if (!this.selector || value === undefined) error('NO_SEL_OR_VAL')
    const data = this.data.filter((el) => isLessOrEq(el, this.selector, value))
    return new DataField(data, this.selector)
  }

  range (from, to) {
    if (Array.isArray(from) && from.length === 2) {
      [from, to] = [from[0], from[1]]
    }
    if (!checkTypes(from, to)) error('RANGE_ARG')
    if (!this.selector) error('NO_SEL')
    const data = this.data
      .filter((el) => isGreaterOrEq(el, this.selector, from))
      .filter((el) => isLess(el, this.selector, to))
    return new DataField(data, this.selector)
  }

  includes (value) {
    if (!this.selector) error('NO_SEL')
    if (value === undefined) return this
    const data = this.data.filter(el => {
      const prop = findProp(el, this.selector)
      return Array.isArray(prop) && prop.includes(value)
    })
    return new DataField(data, this.selector)
  }

  any (config = {}) {
    if (typeof config !== 'object' || !Object.keys(config).length) return this
    const data = this.data.filter((el) => this.__checkForAny(el, config))
    return new DataField(data, this.selector)
  }

  all (config = {}) {
    if (typeof config !== 'object' || !Object.keys(config).length) return this
    const data = this.data.filter((el) => this.__checkForAll(el, config))
    return new DataField(data, this.selector)
  }

  sort ({by, order = 'asc', type} = {}) {
    const prop = this.__findFirstOccurrence(by)
    if (!by || !prop) return this
    if (order !== 'desc') order = 'asc'
    if (!type) type = typeof prop
    this.selector = by
    return order === 'asc' ? this.asc(type) : this.desc(type)
  }

  asc (type) {
    if (!this.selector) error('NO_SEL')
    if (!this.data.length) return this
    let data = []
    type = type || this.__getType()
    const prop = this.selector
    switch (type) {
      case 'n':
      case 'num':
      case 'number':
        data = this.data.slice().sort((a, b) => findProp(a, prop) - findProp(b, prop))
        break
      case 'string':
      case 'str':
      case 's':
        data = this.data.slice().sort((a, b) => String(findProp(a, prop)).localeCompare(String(findProp(b, prop))))
        break
      case 'date':
      case 'd':
        data = this.data.slice().sort((a, b) => Number(new Date(findProp(a, prop))) - Number(new Date(findProp(b, prop))))
        break
      case 'array':
      case 'arr':
        data = this.data.slice().sort((a, b) => {
          const _a = findProp(a, prop)
          const _b = findProp(b, prop)
          if (Array.isArray(_a) && Array.isArray(_b)) {
            return _a.length - _b.length
          }
        })
        break
      default:
        return this
    }
    return new DataField(data, this.selector)
  }

  desc (type) {
    if (!this.selector) error('NO_SEL')
    if (!this.data.length) return this
    let data = []
    type = type || this.__getType()
    const prop = this.selector
    switch (type) {
      case 'num':
      case 'number':
        data = this.data.slice().sort((a, b) => findProp(b, prop) - findProp(a, prop))
        break
      case 'str':
      case 'string':
        data = this.data.slice().sort((a, b) => String(findProp(b, prop)).localeCompare(String(findProp(a, prop))))
        break
      case 'date':
        data = this.data.slice().sort((a, b) => Number(new Date(findProp(b, prop))) - Number(new Date(findProp(a, prop))))
        break
      case 'arr':
      case 'array':
        data = this.data.slice().sort((a, b) => {
          const _a = findProp(a, prop)
          const _b = findProp(b, prop)
          if (Array.isArray(_a) && Array.isArray(_b)) {
            return _b.length - _a.length
          }
        })
        break
      default:
        return this
    }
    return new DataField(data, this.selector)
  }

  sum (prop = error('NO_MATH_SEL'), strict = true) {
    this.__reset()
    return this.data.reduce((sum, el) => {
      const value = findProp(el, prop)
      if (strict) return typeof value === 'number' ? sum + value : sum
      return !isNaN(value) ? sum + Number(value) : sum
    }, 0)
  }

  avg (prop = error('NO_MATH_SEL'), strict = true) {
    this.__reset()
    let sum = 0
    let count = 0
    this.data.forEach(el => {
      const value = findProp(el, prop)
      if (strict) {
        if (typeof value === 'number') {
          count++
          sum += value
        }
      } else {
        if (!isNaN(value)) {
          count++
          sum += Number(value)
        }
      }
    })
    return count ? sum / count : 0
  }

  median (prop = error('NO_MATH_SEL'), strict = true) {
    this.__reset()
    const values = []
    this.data.forEach(el => {
      const value = findProp(el, prop)
      if (strict) {
        if (typeof value === 'number') {
          values.push(value)
        }
      } else {
        if (!isNaN(value)) {
          values.push(Number(value))
        }
      }
    })

    if (values.length === 0) {
      return 0
    } else if (values.length === 1) {
      return values[0]
    }

    values.sort((a, b) => a - b)
    const medianItem = Math.floor(values.length / 2)
    return values.length % 2 ? values[medianItem] : (values[medianItem - 1] + values[medianItem]) / 2
  }

  values () {
    this.__reset()
    return this.data.slice(0) // https://jsperf.com/cloning-arrays/3
  }

  toArray () {
    return this.values()
  }

  __reset () {
    this.selector = ''
  }

  __getType (selector = this.selector) {
    if (!selector) return
    for (let i = 0; i < this.data.length; i++) {
      const prop = findProp(this.data[i], selector)
      if (prop) {
        if (Array.isArray(prop)) return 'array'
        return typeof prop
      }
    }
  }

  __findFirstOccurrence (selector) {
    if (!selector) return
    for (let i = 0; i < this.data.length; i++) {
      const prop = findProp(this.data[i], selector)
      if (prop) {
        return prop
      }
    }
  }

  __checkForAny (el, config) {
    const props = Object.keys(config)
    for (let prop of props) {
      switch (prop) {
        case 'gt':
          if (isGreater(el, this.selector, config[prop])) return true
          break
        case 'gte':
          if (isGreaterOrEq(el, this.selector, config[prop])) return true
          break
        case 'lt':
          if (isLess(el, this.selector, config[prop])) return true
          break
        case 'lte':
          if (isLessOrEq(el, this.selector, config[prop])) return true
          break
        case 'eq':
          if (isEq(el, this.selector, config[prop])) return true
          break
        case 'not':
          if (isNotEq(el, this.selector, config[prop])) return true
          break
        case 'is':
          if (config[prop] === isLike(el, this.selector)) return true
          break
        case 'range':
          if (
            Array.isArray(config[prop]) && config[prop].length === 2 &&
            isGreaterOrEq(el, this.selector, config[prop][0]) &&
            isLess(el, this.selector, config[prop][1])) return true
          break
        default:
      }
    }
  }

  __checkForAll (el, config) {
    const props = Object.keys(config)
    for (let prop of props) {
      switch (prop) {
        case 'gt':
          if (!isGreater(el, this.selector, config[prop])) return
          break
        case 'gte':
          if (!isGreaterOrEq(el, this.selector, config[prop])) return
          break
        case 'lt':
          if (!isLess(el, this.selector, config[prop])) return
          break
        case 'lte':
          if (!isLessOrEq(el, this.selector, config[prop])) return
          break
        case 'eq':
          if (!isEq(el, this.selector, config[prop])) return
          break
        case 'not':
          if (!isNotEq(el, this.selector, config[prop])) return
          break
        case 'is':
          if (config[prop] !== isLike(el, this.selector)) return
          break
        case 'range':
          if (
            Array.isArray(config[prop]) && config[prop].length === 2 &&
            !(isGreaterOrEq(el, this.selector, config[prop][0]) &&
              isLess(el, this.selector, config[prop][1]))) return
          break
        default:
      }
    }
    return true
  }
}
