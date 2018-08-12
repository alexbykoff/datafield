import DataField from '../src/datafield'
import * as data from './data.json'

const content = data.data

let dataField = new DataField(content)

/* global describe it expect beforeEach */
describe('Math operations', function () {
  beforeEach(function () {
    dataField = new DataField(content)
  })

  describe('Sums', function () {
    it('should sum age values from 100 entries WITH type coercion', function () {
      expect(dataField.sum('age', false)).toEqual(4317)
    })

    it('should sum age values from 100 entries WITHOUT type coercion', function () {
      expect(dataField.sum('age')).toEqual(4293)
    })

    it('should sum age from selected sources', function () {
      const data = dataField.where('age').gt(45)
      expect(data.sum('age')).toEqual(2608)
    })

    it('should sum ages from 2 selections without WITH type coercion', function () {
      const dataHigh = dataField.where('age').gt(45)
      const dataLow = dataField.where('age').lte(45)
      const sum = dataHigh.sum('age', false) + dataLow.sum('age', false)
      expect(sum).toEqual(4317)
    })
  })

  describe('Average', function () {
    it('should get average for age WITH type coercion', function () {
      expect(dataField.avg('age', false)).toEqual(43.17)
    })

    it('should get average for age WITHOUT type coercion', function () {
      expect(dataField.avg('age')).toEqual(43.36363636363637)
    })
  })

  describe('Median', function () {
    it('should get median for age WITH type coercion', function () {
      expect(dataField.median('age', false)).toEqual(44)
    })

    it('should get median for age WITHOUT type coercion', function () {
      expect(dataField.median('age')).toEqual(44)
    })
  })

  describe('Random', function () {
    it('should return a new DataField with a single element in it', function () {
      expect(dataField.takeRandom(1).length).toEqual(1)
    })

    it('should return a new DataField with random number of elements (at least 1)', function () {
      expect(dataField.takeRandom())
    })

    it('should return a new DataField with 100 elements', function () {
      expect(dataField.takeRandom(100).length).toEqual(100)
    })

    it('should return a new DataField with 100 elements', function () {
      expect(dataField.takeRandom(Math.floor(Math.random() * 200) + 100).length).toEqual(100)
    })

    it('should try to parse string', function () {
      expect(dataField.takeRandom('7').length).toEqual(7)
    })

    it('should try to parse string', function () {
      expect(dataField.takeRandom('not a number').length).toEqual(1)
    })
  })
})
