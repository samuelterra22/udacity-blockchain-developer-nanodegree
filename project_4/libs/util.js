const util = {

  /**
   * Verify if the object is empty
   *
   * @param  {Object} obj
   * @return {Boolean}
   */
  empty: (obj) => {
    if (obj === true) return false
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) return false
    }
    return true
  },

  isASCII: (str) => {
    return /^[\x00-\x7F]*$/.test(str)
  }

}

module.exports = util