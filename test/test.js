const assert = require('assert')
const DataSet = require('../src/dataset')
const data = require('./data')

describe('Suite 1', function () {
  describe('data array should be present', function () {
    it('should contain data for 100 entries', function () {
      assert.equal(data.length, 100)
    })
  })

  describe('testing DataSet', function () {
    const dataSet = new DataSet(data)
    it('should return DataSet', function () {
      assert.equal(dataSet instanceof DataSet, true)
    })

    it('should return proper length() via method call', function () {
      assert.equal(dataSet.take(6).length(), 6)
    })
  })

})