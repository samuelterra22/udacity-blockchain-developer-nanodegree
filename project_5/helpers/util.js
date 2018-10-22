const util = {
  /**
   * Verify if the object is empty
   *
   * @param {Object} obj  Object to verify
   * @returns {Boolean} Return true if the object is empty
   */
  empty: obj => {
    if (obj === true) return false
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) return false
    }
    return true
  },

  /**
   * Verify if the object is ASCII
   *
   * @param {String} str  String to verify
   * @returns {Boolean} Return true if the object is ASCII
   */
  isASCII: str => {
    return /^[\x00-\x7F]*$/.test(str)
  },

  /**
   * Check if two strings are equal avoiding timing attacks.
   * See more in: https://snyk.io/blog/node-js-timing-attack-ccc-ctf
   *
   * @param {String} a  First string of verification
   * @param {String} b  First string of verification
   * @returns {Boolean} Returns true if the two strings are exactly the same
   */
  isStringChainEquals: (a, b) => {
    let mismatch = 0
    for (let i = 0; i < a.length; ++i) {
      mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i)
    }
    return !mismatch
  }
}

module.exports = util
