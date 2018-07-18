import {findProp, randomTakes} from './utils'

export default class DataField {
  constructor (array = []) {
    this.data = array
    this.caret = 0
    this.selector = ''
  }

  exists (prop) {
    const data = this.data.filter(el => findProp(el, prop) !== undefined)
    return new DataField(data)
  }

  has (prop) {
    const data = this.data.filter(el => {
        const value = findProp(el, prop)
        return Array.isArray(value) ? value.length : value
      }
    )
    return new DataField(data)
  }

  take (number = 1) {
    const data = new DataField(this.data.slice(this.caret, this.caret + number))
    this.caret += number
    return data
  }

  length () {
    return this.data.length
  }

  takeRandom (number = 1) {
    if (typeof  number !== 'number') number = parseInt(String(number))
    number = Math.floor(number)
    if (number > this.data.length) number = this.data.length
    const selected = randomTakes(this.data.length, number)
    const data = this.data.filter((el, i) => selected.includes(i))
    return new DataField(data)
  }

  select (selector) {
    this.selector = selector
    return this
  }

  eq (value) {
    if (!this.selector) return this
    const data = this.data.filter(el => findProp(el, this.selector) === value)
    return new DataField(data)
  }

  not (value) {
    if (!this.selector) return this
    const data = this.data.filter(el => findProp(el, this.selector) !== value)
    return new DataField(data)
  }

  gt (value) {
    if (!this.selector || value === undefined) return this
    const data = this.data.filter(el => findProp(el, this.selector) > value)
    return new DataField(data)
  }

  lt (value) {
    if (!this.selector || value === undefined) return this
    const data = this.data.filter(el => findProp(el, this.selector) < value)
    return new DataField(data)
  }

  gte (value) {
    if (!this.selector || value === undefined) return this
    const data = this.data.filter(el => findProp(el, this.selector) >= value)
    return new DataField(data)
  }

  lte (value) {
    if (!this.selector || value === undefined) return this
    const data = this.data.filter(el => findProp(el, this.selector) <= value)
    return new DataField(data)
  }

  asc (prop, type = 'string') {
    if (prop && this.data.length) {
      let data = []
      switch (type) {
        case 'num':
        case 'number':
          data = this.data.slice().sort((a, b) => findProp(a, prop) - findProp(b, prop))
          break
        case 'string':
        case 'str':
        default:
          data = this.data.slice().sort((a, b) => findProp(a, prop).localeCompare(findProp(b, prop)))
      }
      return new DataField(data)
    }
    return this
  }

  desc (prop, type = 'string') {
    if (prop && this.data.length) {
      let data = []
      switch (type) {
        case 'num':
        case 'number':
          data = this.data.slice().sort((a, b) => findProp(b, prop) - findProp(a, prop))
          break
        case 'string':
        case 'str':
        default:
          data = this.data.slice().sort((a, b) => findProp(b, prop).localeCompare(findProp(a, prop)))
      }
      return new DataField(data)
    }
    return this
  }

  sum (prop, strict = true) {
    return this.data.reduce((sum, el) => {
      const value = findProp(el, prop)
      if (strict) return typeof value === 'number' ? sum + value : sum
      return !isNaN(value) ? sum + Number(value) : sum
    }, 0)
  }

  avg (prop, strict = true) {
    let sum = 0, count = 0
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
    return this.data
  }
}