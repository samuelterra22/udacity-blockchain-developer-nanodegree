const StarNotary = artifacts.require('StarNotary')

contract('StarNotary', accounts => {

  beforeEach(async function() {
    this.contract = await StarNotary.new({ from: accounts[0] })
  })

  describe('can create a star', () => {
    it('can create a star and get its name', async function() {

      await this.contract.createStar('Star power 103!', 'I love my wonderful star', 'ra_032.155', 'dec_121.874', 'mag_245.978', { from: accounts[0] })

      assert.deepEqual(await this.contract.tokenIdToStarInfo(1), ['Star power 103!', 'I love my wonderful star', 'ra_032.155', 'dec_121.874', 'mag_245.978'])
    })
  })

  describe('buying and selling stars', () => {
    let user1 = accounts[1]
    let user2 = accounts[2]
    let randomMaliciousUser = accounts[3]

    let starId = 1
    let starPrice = web3.toWei(.01, 'ether')

    it('user1 can put up their star for sale', async function() {
      await this.contract.createStar('Star power 103!', 'I love my wonderful star', 'ra_032.155', 'dec_121.874', 'mag_245.978', { from: user1 })

      assert.equal(await this.contract.ownerOf(starId), user1)
      await this.contract.putStarUpForSale(starId, starPrice, { from: user1 })

      assert.equal(await this.contract.starsForSale(starId), starPrice)
    })

    it('star exists', async function() {
      await this.contract.createStar('Star power 103!', 'I love my wonderful star', 'ra_032.155', 'dec_121.874', 'mag_245.978', { from: user1 })

      assert.equal(await this.contract.checkIfStarExist('ra_032.155', 'dec_121.874', 'mag_245.978'), true)
    })

    it('star has correct owner after created', async function() {
      await this.contract.createStar('Star power 103!', 'I love my wonderful star', 'ra_032.155', 'dec_121.874', 'mag_245.978', { from: user1 })

      const starOwner = await this.contract.ownerOf(1, { from: user1 })

      assert.equal(starOwner, user1)
    })

    it('user2 is the owner of the star after they buy it', async function() {
      await this.contract.createStar('Star power 103!', 'I love my wonderful star', 'ra_032.155', 'dec_121.874', 'mag_245.978', { from: user1 })

      await this.contract.putStarUpForSale(starId, starPrice, { from: user1 })

      await this.contract.buyStar(starId, { from: user2, value: starPrice, gasPrice: 0 })
      assert.equal(await this.contract.ownerOf(starId), user2)
    })

    it('user2 ether balance changed correctly', async function() {
      await this.contract.createStar('Star power 103!', 'I love my wonderful star', 'ra_032.155', 'dec_121.874', 'mag_245.978', { from: user1 })

      await this.contract.putStarUpForSale(starId, starPrice, { from: user1 })

      let overpaidAmount = web3.toWei(.05, 'ether')
      const balanceBeforeTransaction = web3.eth.getBalance(user2)
      await this.contract.buyStar(starId, { from: user2, value: overpaidAmount, gasPrice: 0 })
      const balanceAfterTransaction = web3.eth.getBalance(user2)

      assert.equal(balanceBeforeTransaction.sub(balanceAfterTransaction), starPrice)
    })

  })
})