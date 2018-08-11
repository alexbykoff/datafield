import { findProp, randomTakes, checkTypes } from './utils'

/// TODO fix array in comparison
export default class DataField {
  constructor (array = [], selector) {
    this.data = array
    this.caret = 0
    this.selector = selector
  }

  exists (prop) {
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
    const data = new DataField(this.data.slice(this.caret, this.caret + number), this.selector)
    this.caret += number
    return data
  }

  length () {
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

  eq (value) {
    if (!this.selector) return this
    let data
    if (value instanceof Date) {
      data = this.data.filter(el => new Date(findProp(el, this.selector)).getTime() === value.getTime())
      return new DataField(data, this.selector)
    }
    data = this.data.filter(el => findProp(el, this.selector) === value)
    return new DataField(data, this.selector)
  }

  not (value) {
    if (!this.selector) return this
    let data
    if (value instanceof Date) {
      data = this.data.filter(el => new Date(findProp(el, this.selector)).getTime() !== value.getTime())
      return new DataField(data, this.selector)
    }
    data = this.data.filter(el => findProp(el, this.selector) !== value)
    return new DataField(data, this.selector)
  }

  gt (value) {
    if (!this.selector || value === undefined) return this
    let data
    if (value instanceof Date) {
      data = this.data.filter(el => new Date(findProp(el, this.selector)) > value)
      return new DataField(data, this.selector)
    }
    data = this.data.filter(el => findProp(el, this.selector) > value)
    return new DataField(data, this.selector)
  }

  lt (value) {
    if (!this.selector || value === undefined) return this
    let data
    if (value instanceof Date) {
      data = this.data.filter(el => new Date(findProp(el, this.selector)) < value)
      return new DataField(data, this.selector)
    }
    data = this.data.filter(el => findProp(el, this.selector) < value)
    return new DataField(data, this.selector)
  }

  gte (value) {
    if (!this.selector || value === undefined) return this
    let data
    if (value instanceof Date) {
      data = this.data.filter(el => new Date(findProp(el, this.selector)) >= value)
      return new DataField(data, this.selector)
    }
    data = this.data.filter(el => findProp(el, this.selector) >= value)
    return new DataField(data, this.selector)
  }

  lte (value) {
    if (!this.selector || value === undefined) return this
    let data
    if (value instanceof Date) {
      data = this.data.filter(el => new Date(findProp(el, this.selector)) <= value)
      return new DataField(data, this.selector)
    }
    data = this.data.filter(el => findProp(el, this.selector) <= value)
    return new DataField(data, this.selector)
  }

  range (from, to) {
    if (!checkTypes(from, to)) throw new Error('bad arguments')
    if (!this.selector) return this
    let data
    if (from instanceof Date) {
      data = this.data.filter(el => {
        const val = findProp(el, this.selector)
        return new Date(val) >= from && new Date(val) < to
      })
      return new DataField(data, this.selector)
    }
    data = this.data.filter(el => {
      const val = findProp(el, this.selector)
      if (Array.isArray(val)) {
        return val.length >= from && val < to.length
      }
      return val >= from && val < to
    })
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
    if (this.selector && this.data.length) {
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
    return this
  }

  desc (type) {
    if (this.selector && this.data.length) {
      let data = []
      type = type || this.__getType()
      const prop = this.selector
      switch (type) {
        case 'n':
        case 'num':
        case 'number':
          data = this.data.slice().sort((a, b) => findProp(b, prop) - findProp(a, prop))
          break
        case 'string':
        case 'str':
        case 's':
          data = this.data.slice().sort((a, b) => String(findProp(b, prop)).localeCompare(String(findProp(a, prop))))
          break
        case 'date':
        case 'd':
          data = this.data.slice().sort((a, b) => Number(new Date(findProp(b, prop))) - Number(new Date(findProp(a, prop))))
          break
        case 'array':
        case 'arr':
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
    return this
  }

  sum (prop, strict = true) {
    this.__reset()
    return this.data.reduce((sum, el) => {
      const value = findProp(el, prop)
      if (strict) return typeof value === 'number' ? sum + value : sum
      return !isNaN(value) ? sum + Number(value) : sum
    }, 0)
  }

  avg (prop, strict = true) {
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

  median (prop, strict = true) {
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
    return this.data
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
}
