class DataSet {
  constructor (array, caret = 0) {
    this.data = array
    this.caret = caret
    this.selector = ''
  }

  exists (prop) {
    const data = this.data.filter(el => prop in el)
    return new DataSet(data)
  }

  has (prop) {
    const data = this.data.filter(el => Array.isArray(el[prop]) ? el[prop].length : el[prop])
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
    const data = this.data.filter(el => el[this.selector] === value)
    return new DataSet(data)
  }

  gt (value) {
    if (!this.selector) return this
    const data = this.data.filter(el => el[this.selector] > value)
    return new DataSet(data)
  }

  lt (value) {
    if (!this.selector) return this
    const data = this.data.filter(el => el[this.selector] < value)
    return new DataSet(data)
  }

  gte (value) {
    if (!this.selector) return this
    const data = this.data.filter(el => el[this.selector] >= value)
    return new DataSet(data)
  }

  lte (value) {
    if (!this.selector) return this
    const data = this.data.filter(el => el[this.selector] <= value)
    return new DataSet(data)
  }

  asc (prop, type = 'string') {
    if (this.data[this.caret] && this.data[this.caret][prop]) {
      let data = []
      switch (type) {
        case 'num':
        case 'number':
          data = this.data.slice().sort((a, b) => a[prop] - b[prop])
          break
        case 'string':
        case 'str':
        default:
          data = this.data.slice().sort((a, b) => a[prop].localeCompare(b[prop]))
      }
      return new DataSet(data)
    }
    return this
  }

  desc (prop, type = 'string') {
    if (this.data[this.caret] && this.data[this.caret][prop]) {
      let data = []
      switch (type) {
        case 'num':
        case 'number':
          data = this.data.slice().sort((a, b) => b[prop] - a[prop])
          break
        case 'string':
        case 'str':
        default:
          data = this.data.slice().sort((a, b) => b[prop].localeCompare(a[prop]))
      }
      return new DataSet(data)
    }
    return this
  }

  sum (prop) {
    return this.data.reduce((sum, el) => !isNaN(el[prop]) ? sum + el[prop] : sum, 0)
  }

  values () {
    return this.data
  }
}

function randomTakes (len, num, collection = []) {
  const index = Math.floor(Math.random() * len)
  if (!collection.includes(index)) collection.push(index)
  return collection.length === num ? collection : randomTakes(len, num, collection)
}

module.exports = DataSet
