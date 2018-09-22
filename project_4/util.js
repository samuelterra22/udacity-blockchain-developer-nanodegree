/**
 * Verify if the object is empty
 *
 * @param  {Object} obj
 * @return {Boolean}
 */
const utils = {
  empty: (obj) => {
    if (obj === true) return false
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) return false
    }
    return true
  }
}

module.exports = utils