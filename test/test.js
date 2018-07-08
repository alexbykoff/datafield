const assert = require('assert')
const DataSet = require('../src/dataset')
const data = require('./data')

const dataSet = new DataSet(data)

describe('Suite 1', function () {
  describe('data array should be present', function () {
    it('should contain data for 100 entries', function () {
      assert.equal(data.length, 100)
    })
  })

  describe('DataSet general', function () {
    it('should return DataSet', function () {
      assert.equal(dataSet instanceof DataSet, true)
    })

    it('should return proper length() via method call', function () {
      assert.equal(dataSet.take(6).length(), 6)
    })

    it('should return an array of 100 elements', function () {
      assert.equal(dataSet.values().length, 100)
    })
  })

  describe('Nested props', function () {
    it('should find values for nested prop', function () {
      const data = dataSet.has('name.first')
      assert.equal(data.length(), 98)
    })

    it('should find nested prop', function () {
      const data = dataSet.exists('name.first')
      assert.equal(data.length(), 99)
    })

    it('should remove all entries', function () {
      const data = dataSet.exists('name.first.test')
      assert.equal(data.length(), 0)
    })
  })

  describe('Sums', function () {
    it('should sum age values from 100 entries', function () {
      assert.equal(dataSet.sum('age'), 4317)
    })

    it('should sum age from selected sources', function () {
      const data = dataSet.select('age').gt(45)
      assert.equal(data.sum('age'), 2608)
    })

    it('should sum ages from 2 selections', function () {
      const dataHigh = dataSet.select('age').gt(45)
      const dataLow = dataSet.select('age').lte(45)
      const sum = dataHigh.sum('age') + dataLow.sum('age')
      assert.equal(sum, 4317)
    })
  })
})