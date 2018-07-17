const chai = require('chai')
const assert = chai.assert
const should = chai.should()
const DataSet = require('../src/dataset')
const data = require('./data')

const dataSet = new DataSet(data)

describe('General', function () {
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
      const length = dataSet.take(6).length()
      assert.equal(length, 6)
      length.should.be.a('number')
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

    it('should find values for array', function () {
      const data = dataSet.has('friends')
      assert.equal(data.length(), 100)
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

  describe('Random', function () {
    it('should return a new DataSet with a single element in it', function () {
      assert.equal(dataSet.takeRandom(1).length(), 1)
    })

    it('should return a new DataSet with random number of elements (at least 1)', function () {
      assert(dataSet.takeRandom())
    })

    it('should return a new DataSet with 100 elements', function () {
      assert.equal(dataSet.takeRandom(100).length(), 100)
    })

    it('should return a new DataSet with 100 elements', function () {
      assert.equal(dataSet.takeRandom(Math.floor(Math.random() * 200) + 100).length(), 100)
    })

  })

})

describe('Comparison', function () {
  describe('Equality', function () {
    it('should filter entries based on equality', function () {
      assert.equal(dataSet.select('age').eq(48).length(), 2)
    })
    it('should return unchanged dataset if no selector is present', function () {
      assert.equal(dataSet.select().eq(48).length(), 100)
    })
  })

  describe('Inequality', function () {
    it('should filter entries based on inequality', function () {
      assert.equal(dataSet.select('age').not(48).length(), 98)
    })
    it('should return unchanged dataset if no selector is present', function () {
      assert.equal(dataSet.select().not().length(), 100)
    })
  })

  describe('Greater', function () {
    it('should filter entries based on equality', function () {
      assert.equal(dataSet.select('age').gt(48).length(), 42)
    })
    it('should return unchanged dataset if no selector is present', function () {
      assert.equal(dataSet.select().gt(48).length(), 100)
    })
    it('should return unchanged dataset if no value is present', function () {
      assert.equal(dataSet.select('age').gt().length(), 100)
    })
  })

  describe('Greater-Equal', function () {
    it('should filter entries based on equality', function () {
      assert.equal(dataSet.select('age').gte(48).length(), 44)
    })
    it('should return unchanged dataset if no selector is present', function () {
      assert.equal(dataSet.select().gte(48).length(), 100)
    })
    it('should return unchanged dataset if no value is present', function () {
      assert.equal(dataSet.select('age').gte().length(), 100)
    })
  })

  describe('Less', function () {
    it('should filter entries based on equality', function () {
      assert.equal(dataSet.select('age').lt(48).length(), 56)
    })
    it('should return unchanged dataset if no selector is present', function () {
      assert.equal(dataSet.select().lt(48).length(), 100)
    })
    it('should return unchanged dataset if no value is present', function () {
      assert.equal(dataSet.select('age').lt().length(), 100)
    })
  })

  describe('Less-Equal', function () {
    it('should filter entries based on equality', function () {
      assert.equal(dataSet.select('age').lte(48).length(), 58)
    })
    it('should return unchanged dataset if no selector is present', function () {
      assert.equal(dataSet.select().lte(48).length(), 100)
    })
    it('should return unchanged dataset if no value is present', function () {
      assert.equal(dataSet.select('age').lte().length(), 100)
    })
  })

  describe('Sorting', function () {

    it('should sort unchanged dataset when empty asc()', function () {
      assert.equal(dataSet.asc().length(), 100)
    })

    it('should sort unchanged dataset when empty desc()', function () {
      assert.equal(dataSet.desc().length(), 100)
    })

    it('should sort data alphabetically', function () {
      const name = dataSet.asc('name.last').values()[0].name.last
      assert.equal(name, 'Abbott')
    })

    it('should sort data alphabetically in descending order', function () {
      const name = dataSet.desc('name.last').values()[0].name.last
      assert.equal(name, 'Yates')
    })

    it('should sort data by age in ascending order', function () {
      const name = dataSet.asc('age', 'num').values()[0].age
      assert.equal(name, 19)
    })

    it('should sort data by age in descending order', function () {
      const name = dataSet.desc('age', 'num').values()[0].age
      assert.equal(name, 68)
    })
  })

})