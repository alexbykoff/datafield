export default function error (code) {
  switch (code) {
    case 'NO_CONS':
      throw new Error('array should be passed into the DataField constructor')
    case 'NOT_ARRAY':
      throw new Error('DataField can only accept arrays')
    case 'RANGE_ARG':
      throw new Error('DataField range() method accepts 2 arguments of the same type')
    case 'NO_SEL':
      throw new Error('DataField selector not specified, use .where(selector)')
    case 'NO_SEL_OR_VAL':
      throw new Error('DataField selector or value not specified, use .where(selector) and check method arguments')
    case 'NO_MATH_SEL':
      throw new Error('DataField selector should be passed as an argument when using math methods')
    case 'NO_STR_VALUE':
      throw new Error('DataField selector .pick() expects a string')
    case 'BAD_PICK_ARG':
      throw new Error('DataField selector .pick() should have a proper argument value — "even", "odd" or "{number}n" (i.e. 3n for every third element)')
    default:
      throw new Error('DataField error')
  }
}
