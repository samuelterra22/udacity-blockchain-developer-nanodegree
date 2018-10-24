const StarNotary = artifacts.require('StarNotary')

contract('StarNotary', accounts => {

  let user1 = accounts[0]
  let user2 = accounts[1]
  let randomMaliciousUser = accounts[2]

  let starId = 1
  let starPrice = web3.toWei(.01, 'ether')

  beforeEach(async function() {
    this.contract = await StarNotary.new({ from: user1 })
  })

  it('can create a star and get its name', async function() {

    await this.contract.createStar('Star power 103!', 'I love my wonderful star', 'ra_032.155', 'dec_121.874', 'mag_245.978', { from: user1 })

    assert.deepEqual(await this.contract.tokenIdToStarInfo(1), ['Star power 103!', 'I love my wonderful star', 'ra_032.155', 'dec_121.874', 'mag_245.978'])
  })

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

  it('token belong to the right owner', async function() {
    await this.contract.mint(starId, { from: user1 })

    var owner = await this.contract.ownerOf(1, { from: user1 })
    assert.equal(owner, user1)
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

  it('approve address', async function() {
    await this.contract.createStar('Star power 103!', 'I love my wonderful star', 'ra_032.155', 'dec_121.874', 'mag_245.978', { from: user1 })

    await this.contract.approve(user2, starId, { from: user1 })

    assert.equal(await this.contract.getApproved(starId, { from: user1 }), user2)
  })

  it('approve all address', async function() {
    await this.contract.createStar('Star power 103!', 'I love my wonderful star', 'ra_032.155', 'dec_121.874', 'mag_245.978', { from: user1 })
    await this.contract.setApprovalForAll(user2, starId)

    assert.equal(await this.contract.isApprovedForAll(user1, user2, { from: user1 }), true)
  })

  // ownerOf test
  it('user is the star owner', async function() {
    await this.contract.createStar('Star power 103!', 'I love my wonderful star', 'ra_032.155', 'dec_121.874', 'mag_245.978', { from: user1 })
    await this.contract.safeTransferFrom(user1, user2, starId)

    assert.equal(await this.contract.ownerOf(starId, { from: user1 }), user2)
  })

  // ownerOf test
  it('user is no more the star owner', async function() {
    await this.contract.createStar('Star power 103!', 'I love my wonderful star', 'ra_032.155', 'dec_121.874', 'mag_245.978', { from: user1 })
    await this.contract.safeTransferFrom(user1, user2, starId)

    assert.notEqual(await this.contract.ownerOf(starId, { from: user1 }), user1)
  })

})