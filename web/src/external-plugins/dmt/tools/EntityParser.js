class EntityParser extends Object {
  constructor(props) {
    super(props)
  }
  /* ******* model identifies ******* */

  isArray = prop => {
    if (prop instanceof Array) {
      return true
    }
    return false
  }

  isAtomicSingle = prop => {
    if (!this.isArray(prop) && !this.isObject(prop)) {
      return true
    }
    return false
  }

  isObject = prop => {
    if (typeof prop === 'object' && prop !== null) {
      return true
    }
    return false
  }

  /* ******* type parsers ******* */
  isOfType = (prop, ptype) => {
    if (this.isObject(prop)) {
      if (prop.type.indexOf(ptype) != -1) {
        return true
      }
    } else {
      return false
    }
  }

  translateType = prop => {
    if (this.isOfType(prop, 'DimensionalScalar'))
      return 'marmo:containers:DimensionalScalar'
    else if (this.isOfType(prop, 'SimpleString'))
      return 'marmo:containers:SimpleString'
    else return prop.type
  }
}

export { EntityParser }
