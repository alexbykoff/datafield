import DataField from '../src/datafield'
import * as data from './data.json'

const content = data.data

let dataField = new DataField(content)

/* global describe it expect beforeEach */

describe('General', function () {
  beforeEach(function () {
    dataField = new DataField(content)
  })

  describe('Data array', function () {
    it('should contain data for 100 entries', function () {
      expect(content.length).toEqual(100)
    })
  })

  describe('DataField general', function () {
    it('should return DataField', function () {
      expect(dataField instanceof DataField).toBe(true)
    })

    it('should return proper length() via method call', function () {
      const length = dataField.take(6).length
      expect(length).toEqual(6)
    })

    it('should return an array of 100 elements', function () {
      expect(dataField.values().length).toEqual(100)
    })
  })

  describe('Nested props', function () {
    it('should find values for nested prop', function () {
      const data = dataField.has('name.first')
      expect(data.length).toEqual(98)
    })

    it('should find values for array', function () {
      const data = dataField.has('friends')
      expect(data.length).toEqual(98)
    })

    it('should find nested prop', function () {
      const data = dataField.exists('name.first')
      expect(data.length).toEqual(99)
    })

    it('should remove all entries', function () {
      const data = dataField.exists('name.first.test')
      expect(data.length).toEqual(0)
    })
  })
  describe('Includes', function () {
    it('should throw an error when used without selector', function () {
      expect(() => dataField.includes('ad')).toThrow('DataField selector not specified, use .where(selector)')
    })

    it('should return this if no value is specified', function () {
      expect(dataField.where('tags').includes().length).toEqual(100)
    })

    it('filters by array including value', function () {
      expect(dataField.where('tags').includes('ad').length).toEqual(5)
    })
  })
})


