import DataField from '../src/datafield'
import * as data from './data.json'

const content = data.data

let dataField = new DataField(content)

/* global describe it expect beforeEach */

describe('Comparison', function () {
  beforeEach(function () {
    dataField = new DataField(content)
  })
  describe('Equality', function () {
    it('should filter entries based on equality', function () {
      expect(dataField.where('age').eq(48).length).toEqual(2)
    })

    it('should throw error if no selector is present', function () {
      expect(() => dataField.where().eq(48)).toThrow('DataField selector or value not specified, use .where(selector) and check method arguments')
    })

    it('should remove 1 item with matching date', function () {
      expect(dataField.where('registered').eq(new Date('Saturday, February 13, 2016 1:36 AM')).length).toEqual(1)
    })

    it('should keep records with 3 friends', function () {
      expect(dataField.where('friends').eq(3).length).toEqual(96)
    })
  })

  describe('Inequality', function () {
    it('should filter entries based on inequality', function () {
      expect(dataField.where('age').not(48).length).toEqual(98)
    })

    it('should should throw error if no selector is present', function () {
      expect(() => dataField.where().not()).toThrow('DataField selector or value not specified, use .where(selector) and check method arguments')
    })

    it('should remove 1 item with matching date', function () {
      expect(dataField.where('registered').not(new Date('may 1, 2015')).length).toEqual(99)
    })

    it('should keep records with NOT 2 friends', function () {
      expect(dataField.where('friends').not(2).length).toEqual(99)
    })
  })

  describe('Greater', function () {
    it('should filter entries based on equality', function () {
      expect(dataField.where('age').gt(48).length).toEqual(42)
    })

    it('should throw error if no selector is present', function () {
      expect(() => dataField.where().gt(48)).toThrow('DataField selector or value not specified, use .where(selector) and check method arguments')
    })

    it('should throw error if no value is present', function () {
      expect(() => dataField.where('age').gt()).toThrow('DataField selector or value not specified, use .where(selector) and check method arguments')
    })

    it('should filter by date', function () {
      expect(dataField.where('registered').gt(new Date('may 1, 2015')).length).toEqual(70)
    })

    it('should keep records with any amount of friends (>0)', function () {
      expect(dataField.where('friends').gt(0).length).toEqual(98)
    })
  })

  describe('Greater-Equal', function () {
    it('should filter entries based on equality', function () {
      expect(dataField.where('age').gte(48).length).toEqual(44)
    })

    it('should throw error if no selector is present', function () {
      expect(() => dataField.where().gte(48)).toThrow('DataField selector or value not specified, use .where(selector) and check method arguments')
    })

    it('should throw error if no value is present', function () {
      expect(() => dataField.where('age').gte()).toThrow('DataField selector or value not specified, use .where(selector) and check method arguments')
    })

    it('should filter by date', function () {
      expect(dataField.where('registered').gte(new Date('may 1, 2015')).length).toEqual(71)
    })
    it('should keep records with 2 or more friends', function () {
      expect(dataField.where('friends').gte(2).length).toEqual(98)
    })

  })

  describe('Less', function () {
    it('should filter entries based on equality', function () {
      expect(dataField.where('age').lt(48).length).toEqual(56)
    })

    it('should return unchanged dataset if no selector is present', function () {
      expect(() => dataField.where().lt(48)).toThrow('DataField selector or value not specified, use .where(selector) and check method arguments')
    })

    it('should should throw error if no value is present', function () {
      expect(() => dataField.where('age').lt()).toThrow('DataField selector or value not specified, use .where(selector) and check method arguments')
    })

    it('should filter by date', function () {
      expect(dataField.where('registered').lt(new Date('may 1, 2015')).length).toEqual(29)
    })

    it('should keep records with less then 3 friends', function () {
      expect(dataField.where('friends').lt(3).length).toEqual(3)
    })

  })

  describe('Less-Equal', function () {
    it('should filter entries based on equality', function () {
      expect(dataField.where('age').lte(48).length).toEqual(58)
    })

    it('should should throw error if no selector is present', function () {
      expect(() => dataField.where().lte(48)).toThrow('DataField selector or value not specified, use .where(selector) and check method arguments')
    })

    it('should throw Error if no value is present', function () {
      expect(() => dataField.where('age').lte()).toThrow('DataField selector or value not specified, use .where(selector) and check method arguments')
    })

    it('should filter by date', function () {
      expect(dataField.where('registered').lte(new Date('may 1, 2015')).length).toEqual(30)
    })

    it('should keep records with 2 or less friends', function () {
      expect(dataField.where('friends').lte(2).length).toEqual(3)
    })
  })

  describe('Boolean filters', function () {
    it('should leave only the active accounts', function () {
      expect(dataField.where('isActive').isTruthy().length).toEqual(48)
    })

    it('should leave only the inactive accounts', function () {
      expect(dataField.where('isActive').isFalsy().length).toEqual(52)
    })

  })
})
