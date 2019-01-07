import 'babel-polyfill';
// import { default as web3 } from 'web3'
const StarNotary = artifacts.require('./starNotary.sol')


contract('StarNotary', async (accs) => {
  let accounts = accs;
  let user0 = accs[0];
  let user1 = accs[1];
  let instance;

  beforeEach(async () => {
    instance = await StarNotary.deployed();
  });

  it('The token name and token symbol are added properly', async() => {
    assert.equal(await instance.name(), 'CDC Star Notary')
    assert.equal(await instance.symbol(), 'CSN')
  });

  it('2 users can exchange their stars', async() => {
    let tokenId1 = 1;
    let tokenId2 = 2;
    let tokenId3 = 3;

    await instance.createStar('awesome star 1', tokenId1, {from: user0})
    await instance.createStar('awesome star 2', tokenId2, {from: user0})
    await instance.createStar('awesome star 3', tokenId3, {from: user1})

    assert.equal(await instance.ownerOf.call(tokenId1), user0)
    assert.equal(await instance.ownerOf.call(tokenId2), user0)
    assert.equal(await instance.ownerOf.call(tokenId3), user1)

    await instance.exchangeStars(tokenId1, tokenId3, {from: user0});

    assert.equal(await instance.ownerOf.call(tokenId1), user1)
    assert.equal(await instance.ownerOf.call(tokenId3), user0)

    await instance.exchangeStars(tokenId1, tokenId2, {from: user1});

    assert.equal(await instance.ownerOf.call(tokenId1), user0)
    assert.equal(await instance.ownerOf.call(tokenId2), user1)
  });

  it('Stars Tokens can be transferred from one address to another.', async() => {
    let tokenId1 = 10;
    let tokenId2 = 11;
  
    await instance.createStar('awesome star 10', tokenId1, {from: user0})
    await instance.createStar('awesome star 11', tokenId2, {from: user0})

    assert.equal(await instance.ownerOf.call(tokenId1), user0)
    assert.equal(await instance.ownerOf.call(tokenId2), user0)

    instance.transferStar(user1, tokenId1);
    instance.transferStar(user1, tokenId2);

    assert.equal(await instance.ownerOf.call(tokenId1), user1)
    assert.equal(await instance.ownerOf.call(tokenId2), user1)
  })

  it('can Create a Star', async() => {
    let tokenId = 1000;
    await instance.createStar('Awesome Star!', tokenId, {from: accounts[0]})
    assert.equal(await instance.tokenIdToStarInfo.call(tokenId), 'Awesome Star!')
  });

  it('lets user1 put up their star for sale', async() => {
    let user1 = accounts[1]
    let starId = 10001;
    let starPrice = web3.utils.toWei('.01', "ether")
    await instance.createStar('awesome star', starId, {from: user1})
    await instance.putStarUpForSale(starId, starPrice, {from: user1})
    assert.equal(await instance.starsForSale.call(starId), starPrice)
  });

  // NOT WORKING
  // it('lets user1 get the funds after the sale', async() => {
  //   let user1 = accounts[1]
  //   let user2 = accounts[2]
  //   let starId = 3
  //   let starPrice = web3.utils.toWei('.01', "ether")
  //   await instance.createStar('awesome star', starId, {from: user1})
  //   await instance.putStarUpForSale(starId, starPrice, {from: user1})
  //   let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user1)
  //   console.log("balanceOfUser1BeforeTransaction: ", balanceOfUser1BeforeTransaction)

  //   await instance.buyStar(starId, {from: user2, value: starPrice})
  //   let balanceOfUser1AfterTransaction = await web3.eth.getBalance(user1)
  //   console.log("balanceOfUser1AfterTransaction : ", balanceOfUser1AfterTransaction)
  //   assert.equal(balanceOfUser1BeforeTransaction.add(starPrice).toNumber(), balanceOfUser1AfterTransaction.toNumber());
  // });

  it('lets user2 buy a star, if it is put up for sale', async() => {
    let user1 = accounts[1]
    let user2 = accounts[2]
    let starId = 10002;
    let starPrice = web3.utils.toWei('.01', "ether")
    await instance.createStar('awesome star', starId, {from: user1})
    await instance.putStarUpForSale(starId, starPrice, {from: user1})
    await instance.buyStar(starId, {from: user2, value: starPrice});
    assert.equal(await instance.ownerOf.call(starId), user2);
  });

  // NOT WORKING
  // it('lets user2 buy a star and decreases its balance in ether', async() => {
  //   let user1 = accounts[1]
  //   let user2 = accounts[2]
  //   let starId = 5
  //   let starPrice = web3.utils.toWei('.01', "ether")
  //   await instance.createStar('awesome star', starId, {from: user1})
  //   await instance.putStarUpForSale(starId, starPrice, {from: user1})
  //   let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2)
  //   const balanceOfUser2BeforeTransaction = await web3.eth.getBalance(user2)
  //   await instance.buyStar(starId, {from: user2, value: starPrice, gasPrice:0})
  //   const balanceAfterUser2BuysStar = await web3.eth.getBalance(user2)
  //   assert.equal(balanceOfUser2BeforeTransaction.sub(balanceAfterUser2BuysStar), starPrice);
  // });
});
