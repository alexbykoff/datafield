import DataField from '../src/datafield'
import * as data from './data.json'

const content = data.data

let dataField = new DataField(content)

/* global describe it expect beforeEach */

describe('Sorting', function () {

  beforeEach(function () {
    dataField = new DataField(content)
  })

  it('should sort unchanged dataset when empty asc()', function () {
    expect(dataField.asc().length).toEqual(100)
  })

  it('should do nothing when there is no data', function () {
    expect(new DataField([]).asc().length).toEqual(0)
  })

  it('should return unchanged dataset when sorting type is not supported', function () {
    expect(dataField.asc({}).length).toEqual(100)
  })

  it('should return unchanged dataset when empty desc()', function () {
    expect(dataField.desc().length).toEqual(100)
  })

  it('should sort data alphabetically', function () {
    const name = dataField.where('name.last').asc().toArray()[0].name.last
    expect(name).toEqual('Abbott')
  })

  it('should sort data alphabetically in descending order', function () {
    const name = dataField.where('name.last').desc().toArray()[0].name.last
    expect(name).toEqual('Yates')
  })

  it('should sort data by age in ascending order', function () {
    const name = dataField.where('age').asc().toArray()[0].age
    expect(name).toEqual(19)
  })

  it('should sort data by age in descending order', function () {
    const name = dataField.where('age').desc().toArray()[0].age
    expect(name).toEqual(68)
  })

  it('should return unchanged if type is not right - using asc()', function () {
    const name = dataField.sort({by: 'isActive'}).toArray()[0].age
    expect(name).toEqual(41)
  })

  it('should return unchanged if type is not right - using desc()', function () {
    const name = dataField.sort({by: 'isActive', order: 'desc'}).toArray()[0].age
    expect(name).toEqual(41)
  })

  it('should sort data using sort() method', function () {
    const company = dataField.sort({by: 'company', order: 'desc', type: 'string'}).toArray()[0].company
    expect(company).toEqual('ZOLAVO')
  })

  it('should sort data using sort() method, defaulting to "asc" order and "string" type', function () {
    const company = dataField.sort({by: 'company'}).toArray()[0].company
    expect(company).toEqual('ANIVET')
  })

  it('should sort by string type because "date" type is not passed, using desc() method', function () {
    const company = dataField.where('registered').desc().toArray()[0].company
    expect(company).toEqual('EXIAND')
  })

  it('should sort by string type because "date" type is not passed, using asc() method', function () {
    const company = dataField.where('registered').asc().toArray()[0].company
    expect(company).toEqual('BOILCAT')
  })

  it('should sort data by date', function () {
    const company = dataField.sort({by: 'registered', type: 'date'}).toArray()[0].company
    expect(company).toEqual('ISOTRACK')
  })

  it('should sort data by date in descending order', function () {
    const company = dataField.sort({by: 'registered', order: 'desc', type: 'date'}).toArray()[0].company
    expect(company).toEqual('PAPRIKUT')
  })

  it('should sort data by friends array length', function () {
    const company = dataField.where('friends').asc().toArray()[0].company
    expect(company).toEqual('SUREMAX')
  })

  it('should sort data by friends array length in descending order', function () {
    const company = dataField.where('friends').desc().toArray()[0].company
    expect(company).toEqual('COMTENT')
  })

})
