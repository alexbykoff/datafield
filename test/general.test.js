import DataField from '../src/datafield'
import * as data from './data.json'
import error from '../src/errors'

const content = data.data

let dataField = new DataField(content)

/* global describe it expect beforeEach */

describe('General', function () {
  beforeEach(function () {
    dataField = new DataField(content)
  })

  describe('Constructor errors', function () {
    it('throws an error if no array is provided', function () {
      expect(() => new DataField()).toThrow('array should be passed into the DataField constructor')
    })

    it('throws an error if no argument is not an array', function () {
      expect(() => new DataField({})).toThrow('DataField can only accept arrays')
    })

    it('throws a general error if error type is unknown', function () {
      expect(() => error()).toThrow('DataField error')
    })
  })

  describe('Data array', function () {
    it('contains data for 100 entries', function () {
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

  describe('Pick Test', function () {
    it('should keep even elements', function () {
      expect(dataField.pick('even').length).toEqual(50)
    })

    it('should keep even elements', function () {
      expect(dataField.pick('odd').length).toEqual(50)
    })

    it('should keep every 3rd element', function () {
      expect(dataField.pick('3n').length).toEqual(34)
    })

    it('should keep every 5th element', function () {
      expect(dataField.pick('5n').length).toEqual(20)
    })

    it('should throw an error if argument is not a string', function () {
      expect(() => dataField.pick(42)).toThrow('DataField selector .pick() expects a string')
    })

    it('should throw an error if argument is not right', function () {
      expect(() => dataField.pick("wrong string")).toThrow('DataField selector .pick() should have a proper argument value — "even", "odd" or "{number}n" (i.e. 3n for every third element)')
    })

    it('should return this if no argument provided', function () {
      expect(dataField.pick().length).toEqual(100)
    })
  })

})


