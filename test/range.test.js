import DataField from '../src/datafield'
import * as data from './data.json'

const content = data.data

let dataField = new DataField(content)

/* global describe it expect beforeEach */

describe('Range', function () {
  beforeEach(function () {
    dataField = new DataField(content)
  })
  describe('Different comparison types', function () {
    it('should throw an error as types are different', function () {
      expect(() => dataField.where('index').range(1, 'str')).toThrow('bad arguments')
      expect(() => dataField.where('index').range('str')).toThrow('bad arguments')
      expect(() => dataField.where('index').range()).toThrow('bad arguments')
    })
  })

  describe('Successful filtering by index', function () {
    it('should filter 50 entries by index', function () {
      expect(dataField.where('index').range(0, 50).length).toEqual(50)
    })
  })

  describe('Successful filtering by date', function () {
    it('should filter 65 entries', function () {
      expect(dataField.where('registered').range(new Date('may 3, 1980'), new Date('jan 1, 2017')).length).toEqual(65)
    })
  })

  describe('Successful filtering by alphabet', function () {
    it('select from A to C', function () {
      expect(dataField.where('name.first').range('A', 'C').length).toEqual(16)
    })
    it('select from U to Zz', function () {
      expect(dataField.where('name.first').range('U', 'Zz').length).toEqual(6)
    })
  })

  describe('Successful filtering by array length', function () {
    it('selects arrays with length >0', function () {
      expect(dataField.where('friends').range(1, 100).length).toEqual(98)
    })
  })

  describe('Successful filtering by array length (take only length of 2)', function () {
    it('selects arrays with length >0', function () {
      expect(dataField.where('friends').range(2, 3).length).toEqual(1)
    })
  })

})
