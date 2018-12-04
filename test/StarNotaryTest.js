const StarNotary = artifacts.require('StarNotary');

contract('StarNotary Tests', accounts => {
  let owner = accounts[0];
  let starId = 1;
  let name = "My Awesome Star!";
  let ra = "032.155";
  let dec = "121.874";
  let mag = "245.978";
  let starStory = "I bought this star for my dog's birthday";
  let tokenId = 1;
  let user1 = accounts[1];
  let user2 = accounts[2];

  beforeEach(async () => {
    this.contract = await StarNotary.new({from: owner});
  });

  describe("checkIfStarExist",() => {
    it("returns true when a star exists", async () => {
      await this.contract.createStar(name,ra,dec,mag,starStory, tokenId, {from: owner});
      assert.equal(await this.contract.checkIfStarExist(ra,dec,mag),true);
    });
    it("returns false when a star does not exist", async () => {
      assert.equal(await this.contract.checkIfStarExist(ra,dec,mag),false);
    });
  });

  describe("can create a star",() => {
    it("can create a star and gets its name", async () => {
      await this.contract.createStar(name,ra,dec,mag,starStory, tokenId, {from: owner});
      let starInfo = await this.contract.tokenIdToStarInfo(tokenId);
      assert.equal(starInfo[0],name);
      assert.equal(starInfo[1],starStory);
      assert.equal(starInfo[2],"ra_"+ra);
      assert.equal(starInfo[3],"dec_"+dec);
      assert.equal(starInfo[4],"mag_"+mag);
    });
  });

  describe('star uniqueness', () => { 
    it('only stars unique stars can be minted', async () => { 
      // first we mint our first star
      await this.contract.createStar(name,ra,dec,mag,starStory, tokenId, {from: owner});
      // then we try to mint the same star, and we expect an error
      await expectThrow(this.contract.createStar(name,ra,dec,mag,starStory, tokenId, {from: owner}) );
    })

    it('only stars unique stars can be minted even if their ID is different', async () => { 
      // first we mint our first star
      // then we try to mint the same star, and we expect an error
    })

    it('minting unique stars does not fail', async () => { 
      for(let i = 1; i < 10; i ++) { 
        let id = i
        let newRa = i.toString()
        let newDec = i.toString()
        let newMag = i.toString()

        await this.contract.createStar(name, starStory, newRa, newDec, newMag, id, {from: user1})

        let starInfo = await this.contract.tokenIdToStarInfo(id)
        assert.equal(starInfo[0], name)
      }
    })
  });

  describe("buying and selling stars", () => {
      let starPrice = web3.toWei(.01,"ether");

      beforeEach(async () => {
        await this.contract.createStar(name,ra,dec,mag,starStory, tokenId, {from: user1});
        // await  this.contract.createStar("The awesome star!", starId, {from: user1});
      });

      describe("owner can sell a star", () => {
        beforeEach(async () => {
         await this.contract.putStarUpForSale(starId, starPrice, { from: user1 });
        });
        it("can be put for sale by the owner", async () => {
          assert.equal(await this.contract.starForSale(starId), starPrice);
        });

        it("owner gets paid after selling the star", async () =>  { 
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

var expectThrow = async function(promise) { 
    try { 
        await promise
    } catch (error) { 
        assert.exists(error)
        return 
    }

    assert.fail('expected an error, but none was found')
}
