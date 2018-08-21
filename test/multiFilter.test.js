import DataField from '../src/datafield'
import * as data from './data.json'

const content = data.data

let dataField = new DataField(content)

/* global describe it expect beforeEach */
describe('MultiFilter', function () {
  beforeEach(function () {
    dataField = new DataField(content)
  })

  describe('test .any cases', function () {
    it('checks .gt', function () {
      expect(dataField.where('age').any({gt: 30}).length).toEqual(dataField.where('age').gt(30).length)
    })

    it('checks two-zone filter', function () {
      expect(dataField.where('age')
        .any({eq: 34, lt: 30, gt: 50}).length).toEqual(67)

      expect(dataField.where('age')
        .any({lt: 30, gt: 50}).length).toEqual(64)
    })

  })

  describe('test .all cases', function () {
    it('checks 3 params', function () {
      const multi = dataField.where('age')
        .all({gt: 20, lt: 40, not: 36})
      const chained = dataField.where('age')
        .gt(20).lt(40).not(36)
      expect(multi.length).toEqual(chained.length)
    })

    it('checks truthy value', function () {
      expect(dataField.where('age').all({is: true}).length).toEqual(100)
      expect(dataField.where('friends').all({is: true}).length).toEqual(99)
    })

    it('checks falsy value', function () {
      expect(dataField.where('friends').all({is: false}).length).toEqual(1)
    })

    it('checks multi params', function () {
      expect(dataField.where('age').all(
        {
          is: true,
          range: [1, 100],
          gt: 3,
          gte: 50,
          lt: 60,
          lte: 80,
          not: 55
        }
      ).length).toEqual(17)

      expect(dataField.where('age').all(
        {
          is: true,
          range: [1, 100],
          gt: 3,
          lt: 60,
          lte: 80,
          not: 55,
          eq: 34
        }
      ).length).toEqual(3)

      expect(dataField.where('age')
        .all({range: [45, 55]}).length)
        .toEqual(dataField.where('age').range(45, 55).length)
    })

  })
})
