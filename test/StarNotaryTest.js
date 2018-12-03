const StarNotary = artifacts.require('StarNotary');

contract('StarNotary Tests', (accounts) => {
  let owner = accounts[0];
  let instance;

  beforeEach(async () => {
    instance = await StarNotary.new({from: owner});
  });

  describe('basic tests', () => {
    it('has correct name', async () => {
      assert.equal(await instance.starName.call(),"My Awesome Star");
    });

    it('can be claimed', async() => {
      assert.equal(await instance.starOwner(), 0);
      instance.claimStar({from: owner});
      assert.equal(await instance.starOwner(), owner);
    });
  });

  describe('Stars can change owners',() => {
    beforeEach(async () => {
      assert.equal(await instance.starOwner(), 0);
      instance.claimStar({from: owner});
      assert.equal(await instance.starOwner(), owner);
    });

    it('can be claimed by other user', async () => {
      instance.claimStar({from: accounts[1]});
      assert.equal(await instance.starOwner(), accounts[1]);
    });
  });
});
