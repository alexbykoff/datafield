import DataField from '../src/datafield'
import data from './data'

let dataField = new DataField(data)

/* global describe it expect beforeEach */

describe('General', function () {
  beforeEach(function () {
    dataField = new DataField(data)
  })

  describe('Data array', function () {
    it('should contain data for 100 entries', function () {
      expect(data.length).toEqual(100)
    })
  })

  describe('DataField general', function () {
    it('should return DataField', function () {
      expect(dataField instanceof DataField).toBe(true)
    })

    it('should return proper length() via method call', function () {
      const length = dataField.take(6).length()
      expect(length).toEqual(6)
    })

    it('should return an array of 100 elements', function () {
      expect(dataField.values().length).toEqual(100)
    })
  })

  describe('Nested props', function () {
    it('should find values for nested prop', function () {
      const data = dataField.has('name.first')
      expect(data.length()).toEqual(98)
    })

    it('should find values for array', function () {
      const data = dataField.has('friends')
      expect(data.length()).toEqual(100)
    })

    it('should find nested prop', function () {
      const data = dataField.exists('name.first')
      expect(data.length()).toEqual(99)
    })

    it('should remove all entries', function () {
      const data = dataField.exists('name.first.test')
      expect(data.length()).toEqual(0)
    })
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
      expect(dataField.takeRandom(1).length()).toEqual(1)
    })

    it('should return a new DataField with random number of elements (at least 1)', function () {
      expect(dataField.takeRandom())
    })

    it('should return a new DataField with 100 elements', function () {
      expect(dataField.takeRandom(100).length()).toEqual(100)
    })

    it('should return a new DataField with 100 elements', function () {
      expect(dataField.takeRandom(Math.floor(Math.random() * 200) + 100).length()).toEqual(100)
    })

    it('should try to parse string', function () {
      expect(dataField.takeRandom('7').length()).toEqual(7)
    })

    it('should try to parse string', function () {
      expect(dataField.takeRandom('not a number').length()).toEqual(1)
    })
  })
})

describe('Comparison', function () {
  describe('Equality', function () {
    it('should filter entries based on equality', function () {
      expect(dataField.where('age').eq(48).length()).toEqual(2)
    })

    it('should return unchanged dataset if no selector is present', function () {
      expect(dataField.where().eq(48).length()).toEqual(100)
    })

    it('should remove 1 item with matching date', function () {
      expect(dataField.where('registered').eq(new Date('Saturday, February 13, 2016 1:36 AM')).length()).toEqual(1)
    })
  })

  describe('Inequality', function () {
    it('should filter entries based on inequality', function () {
      expect(dataField.where('age').not(48).length()).toEqual(98)
    })

    it('should return unchanged dataset if no selector is present', function () {
      expect(dataField.where().not().length()).toEqual(100)
    })

    it('should remove 1 item with matching date', function () {
      expect(dataField.where('registered').not(new Date('may 1, 2015')).length()).toEqual(99)
    })
  })

  describe('Greater', function () {
    it('should filter entries based on equality', function () {
      expect(dataField.where('age').gt(48).length()).toEqual(42)
    })

    it('should return unchanged dataset if no selector is present', function () {
      expect(dataField.where().gt(48).length()).toEqual(100)
    })

    it('should return unchanged dataset if no value is present', function () {
      expect(dataField.where('age').gt().length()).toEqual(100)
    })

    it('should filter by date', function () {
      expect(dataField.where('registered').gt(new Date('may 1, 2015')).length()).toEqual(70)
    })
  })

  describe('Greater-Equal', function () {
    it('should filter entries based on equality', function () {
      expect(dataField.where('age').gte(48).length()).toEqual(44)
    })

    it('should return unchanged dataset if no selector is present', function () {
      expect(dataField.where().gte(48).length()).toEqual(100)
    })

    it('should return unchanged dataset if no value is present', function () {
      expect(dataField.where('age').gte().length()).toEqual(100)
    })

    it('should filter by date', function () {
      expect(dataField.where('registered').gte(new Date('may 1, 2015')).length()).toEqual(71)
    })
  })

  describe('Less', function () {
    it('should filter entries based on equality', function () {
      expect(dataField.where('age').lt(48).length()).toEqual(56)
    })

    it('should return unchanged dataset if no selector is present', function () {
      expect(dataField.where().lt(48).length()).toEqual(100)
    })

    it('should return unchanged dataset if no value is present', function () {
      expect(dataField.where('age').lt().length()).toEqual(100)
    })

    it('should filter by date', function () {
      expect(dataField.where('registered').lt(new Date('may 1, 2015')).length()).toEqual(29)
    })
  })

  describe('Less-Equal', function () {
    it('should filter entries based on equality', function () {
      expect(dataField.where('age').lte(48).length()).toEqual(58)
    })

    it('should return unchanged dataset if no selector is present', function () {
      expect(dataField.where().lte(48).length()).toEqual(100)
    })

    it('should return unchanged dataset if no value is present', function () {
      expect(dataField.where('age').lte().length()).toEqual(100)
    })

    it('should filter by date', function () {
      expect(dataField.where('registered').lte(new Date('may 1, 2015')).length()).toEqual(30)
    })
  })

  describe('Sorting', function () {

    it('should sort unchanged dataset when empty asc()', function () {
      expect(dataField.asc().length()).toEqual(100)
    })

    it('should do nothing when there is no data', function () {
      expect(new DataField([]).asc().length()).toEqual(0)
    })

    it('should return unchanged dataset when sorting type is not supported', function () {
      expect(dataField.asc({}).length()).toEqual(100)
    })

    it('should return unchanged dataset when empty desc()', function () {
      expect(dataField.desc().length()).toEqual(100)
    })

    it('should sort data alphabetically', function () {
      const name = dataField.where('name.last').asc().values()[0].name.last
      expect(name).toEqual('Abbott')
    })

    it('should sort data alphabetically in descending order', function () {
      const name = dataField.where('name.last').desc().values()[0].name.last
      expect(name).toEqual('Yates')
    })

    it('should sort data by age in ascending order', function () {
      const name = dataField.where('age').asc().values()[0].age
      expect(name).toEqual(19)
    })

    it('should sort data by age in descending order', function () {
      const name = dataField.where('age').desc().values()[0].age
      expect(name).toEqual(68)
    })

    it('should sort data using sort() method', function () {
      const company = dataField.sort({by: 'company', order: 'desc', type: 'string'}).values()[0].company
      expect(company).toEqual('ZOLAVO')
    })

    it('should sort data using sort() method, defaulting to "asc" order and "string" type', function () {
      const company = dataField.sort({by: 'company'}).values()[0].company
      expect(company).toEqual('ANIVET')
    })

    it('should sort by string type because "date" type is not passed, using desc() method', function () {
      const company = dataField.where('registered').desc().values()[0].company
      expect(company).toEqual('EXIAND')
    })

    it('should sort by string type because "date" type is not passed, using asc() method', function () {
      const company = dataField.where('registered').asc().values()[0].company
      expect(company).toEqual('BOILCAT')
    })

    it('should sort data by date', function () {
      const company = dataField.sort({by: 'registered', type: 'date'}).values()[0].company
      expect(company).toEqual('ISOTRACK')
    })
  })
})

describe('Range', function () {
  describe('Different comparison types', function () {
    it('should throw an error as types are different', function () {
      expect(() => dataField.where('index').range(1, 'str')).toThrow('bad arguments')
      expect(() => dataField.where('index').range('str')).toThrow('bad arguments')
      expect(() => dataField.where('index').range()).toThrow('bad arguments')
    })
  })

  describe('Successful filtering by index', function () {
    it('should filter 50 entries by index', function () {
      expect(dataField.where('index').range(0, 50).length()).toEqual(50)
    })
  })

  describe('Successful filtering by date', function () {
    it('should filter 65 entries', function () {
      expect(dataField.where('registered').range(new Date('may 3, 1980'), new Date('jan 1, 2017')).length()).toEqual(65)
    })
  })

  describe('Successful filtering by alphabet', function () {
    it('select from A to C', function () {
      expect(dataField.where('name.first').range('A', 'C').length()).toEqual(16)
    })
    it('select from U to Zz', function () {
      expect(dataField.where('name.first').range('U', 'Zz').length()).toEqual(6)
    })
  })
})
