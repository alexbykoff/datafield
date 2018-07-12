const assert = require('assert')
const DataSet = require('../src/dataset')
const data = require('./data')

const dataSet = new DataSet(data)

describe('Suite 1', function () {
  describe('Data array', function () {
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
    it('should sum age values from 100 entries WITH type coercion', function () {
      assert.equal(dataSet.sum('age', false), 4317)
    })

    it('should sum age values from 100 entries WITHOUT type coercion', function () {
      assert.equal(dataSet.sum('age'), 4293)
    })

    it('should sum age from selected sources', function () {
      const data = dataSet.select('age').gt(45)
      assert.equal(data.sum('age'), 2608)
    })

    it('should sum ages from 2 selections without WITH type coercion', function () {
      const dataHigh = dataSet.select('age').gt(45)
      const dataLow = dataSet.select('age').lte(45)
      const sum = dataHigh.sum('age', false) + dataLow.sum('age', false)
      assert.equal(sum, 4317)
    })
  })

  describe('Average', function () {
    it('should get average for age WITH type coercion', function () {
      assert.equal(dataSet.avg('age', false), 43.17)
    })

    it('should get average for age WITHOUT type coercion', function () {
      assert.equal(dataSet.avg('age'), 43.36363636363637)
    })
  })

  describe('Median', function () {
    it('should get median for age WITH type coercion', function () {
      assert.equal(dataSet.median('age', false), 44)
    })

    it('should get median for age WITHOUT type coercion', function () {
      assert.equal(dataSet.median('age'), 44)
    })
  })

})