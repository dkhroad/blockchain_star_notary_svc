const StarNotary = artifacts.require('StarNotary');

contract('StarNotary Tests', accounts => {
  let owner = accounts[0];

  beforeEach(async () => {
    this.contract = await StarNotary.new({from: owner});
  });

  describe("can create a star",() => {
    it("can create a star and gets its name", async () => {
      let tokenId = 1;
      await this.contract.createStar("My Awesome Star!", tokenId, {from: owner});
      assert.equal(await this.contract.tokenIdToStarInfo(tokenId),"My Awesome Star!");
    })
  })

  describe("buying and selling stars", () => {
      let user1 = accounts[1];
      let user2 = accounts[2];
      let starId = 1;
      let starPrice = web3.toWei(.01,"ether");

      beforeEach(async () => {
        await  this.contract.createStar("The awesome star!", starId, {from: user1});
      });

      describe("user1 can sell a star", () => {
        beforeEach(async () => {
         await this.contract.putStarUpForSale(starId, starPrice, { from: user1 });
        });
        it("can be put for sale by the owner", async () => {
          assert.equal(await this.contract.starForSale(starId), starPrice);
        });

        it("user1 gets paid after selling the star", async () =>  { 
          const user1BalanceBeforeTransaction = web3.eth.getBalance(user1);
          await this.contract.buyStar(starId, { from: user2, value: starPrice });
          const user1BalanceAfterTransaction = web3.eth.getBalance(user1);
          assert.equal(user1BalanceBeforeTransaction.add(starPrice).toNumber(),user1BalanceAfterTransaction.toNumber());

        });
      });

      describe("user2 can buy stars put up for sale", async () => {
        beforeEach(async () => {
         await this.contract.putStarUpForSale(starId, starPrice, { from: user1 });
        })
        it("user2 is the new owner after buying a star", async () => {
            await this.contract.buyStar(starId, {from: user2, value: starPrice});
            assert.equal(await this.contract.ownerOf(starId),user2);
        });

        it("user2 has his balance changed accordingly", async () => {
          let overPaidAmmount = web3.toWei(.05,"ether");
          const user2BalanceBeforTransaction = web3.eth.getBalance(user2);
          await this.contract.buyStar(starId, { from: user2, value: overPaidAmmount, gasPrice: 0 });
          const user2BalanceAfterTransaction = web3.eth.getBalance(user2);
          assert.equal(user2BalanceBeforTransaction.sub(user2BalanceAfterTransaction),starPrice);
        });
      });

  });
});
