const sleeve = require('sleeve')

class DataSet {
  constructor (array, caret = 0) {
    this.data = array
    this.caret = caret
    this.selector = ''
  }

  exists (prop) {
    const data = this.data.filter(el => findProp(el, prop) !== undefined)
    return new DataSet(data)
  }

  has (prop) {
    const data = this.data.filter(el => {
        const value = findProp(el, prop)
        return Array.isArray(value) ? value.length : value
      }
    )
    return new DataSet(data)
  }

  take (number = 1) {
    return new DataSet(this.data.slice(this.caret, this.caret + number), this.caret + number)
  }

  length () {
    return this.data.length
  }

  takeRandom (number = 1) {
    if (number > this.data.length) number = this.data.length
    const selected = randomTakes(this.data.length, number)
    const data = this.data.filter((el, i) => selected.includes(i))
    return new DataSet(data)
  }

  select (selector) {
    this.selector = selector
    return this
  }

  eq (value) {
    if (!this.selector) return this
    const data = this.data.filter(el => findProp(el, this.selector) === value)
    return new DataSet(data)
  }

  gt (value) {
    if (!this.selector) return this
    const data = this.data.filter(el => findProp(el, this.selector) > value)
    return new DataSet(data)
  }

  lt (value) {
    if (!this.selector) return this
    const data = this.data.filter(el => findProp(el, this.selector) < value)
    return new DataSet(data)
  }

  gte (value) {
    if (!this.selector) return this
    const data = this.data.filter(el => findProp(el, this.selector) >= value)
    return new DataSet(data)
  }

  lte (value) {
    if (!this.selector) return this
    const data = this.data.filter(el => findProp(el, this.selector) <= value)
    return new DataSet(data)
  }

  asc (prop, type = 'string') {
    if (this.data[this.caret] && findProp(this.data[this.caret], prop)) {
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
      return new DataSet(data)
    }
    return this
  }

  desc (prop, type = 'string') {
    if (this.data[this.caret] && findProp(this.data[this.caret], prop)) {
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
      return new DataSet(data)
    }
    return this
  }

  sum (prop) {
    return this.data.reduce((sum, el) => {
      const value = findProp(el, prop)
      return !isNaN(value) ? sum + value : sum
    }, 0)
  }

  values () {
    return this.data
  }
}

function findProp (el, prop) {
  if (el.hasOwnProperty(prop)) return el[prop]
  const result = sleeve(el, prop, () => {})
  return result
}

function randomTakes (len, num, collection = []) {
  const index = Math.floor(Math.random() * len)
  if (!collection.includes(index)) collection.push(index)
  return collection.length === num ? collection : randomTakes(len, num, collection)
}

module.exports = DataSet