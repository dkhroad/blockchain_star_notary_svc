const ERC721Token = artifacts.require("./contracts/ERC721Token");


contract("ERC721Token", accounts => {
  let defaultAccount = accounts[0];
  let user1 = accounts[1];
  let user2 = accounts[2];
  let operator = accounts[3];

  beforeEach(async () => {
    this.contract = await ERC721Token.new({from: defaultAccount});
  });

  describe('can create a token', () => {
    let tokenId = 1;
    let tx;
    beforeEach( async () => {
      tx = await this.contract.mint(tokenId, {from: user1});
    });

    it('had the right owner', async () => { 
      assert.equal(await this.contract.ownerOf(tokenId),user1);
    });

    it("increments balanceOf user1 by 1", async () => {
      let balance = await this.contract.balanceOf(user1);
      assert.equal(balance.toNumber(), 1);
    });

    it('emits the Transfer event during creation of the token with correct addresses', async () =>  {
      assert.equal(tx.logs[0].event,'Transfer');
      assert.equal(tx.logs[0].args._to,user1);
      assert.equal(tx.logs[0].args._from,'0x0000000000000000000000000000000000000000');
    });
  });

  describe('Owner Transfer', () => {
    let tokenId = 1;
    let tx1,tx2;

    beforeEach(async () => {
      tx1 = await this.contract.mint(tokenId,{from: user1});
      tx2 = await this.contract.transferFrom(user1,user2,tokenId,{from: user1});
    });

    it('emits the Transfer event', async () => {
      assert.equal(tx2.logs[0].event,'Transfer');
      assert.equal(tx2.logs[0].args._to,user2);
      assert.equal(tx2.logs[0].args._from,user1);
    });

    it('has a new owner',async () => {
      let owner = await this.contract.ownerOf(tokenId); 
      assert.equal(owner,user2);
    });

    it('only permissioned users can transfer tokens', async () => {
      let randomPersonTryingToStealToken = accounts[4];
      await expectThrow(this.contract.transferFrom(user2,randomPersonTryingToStealToken,tokenId,{from: randomPersonTryingToStealToken}));
      
    });
  });

  describe('Approval', () => {
    let tokenId = 1;
    let tx1,tx2;
  

    beforeEach(async () => {
      tx1 = await this.contract.mint(tokenId,{from: user1});
      tx2 = await this.contract.approve(user2,tokenId,{from: user1});
    });

    it("can approve another user for transfer", async () => {
      let approved_user = await this.contract.getApproved(tokenId, {from: user2});
      assert.equal(approved_user,user2);
    });

    it("emits Approve event",async () => {
      assert.equal(tx2.logs[0].event,'Approval');
      assert.equal(tx2.logs[0].args._owner,user1);
      assert.equal(tx2.logs[0].args._approved,user2);
    });
     
    it("be transferred by an approved user", async () => {
      let tx3 = await this.contract.transferFrom(user1,user2,tokenId,{from: user2});
      let owner = await this.contract.ownerOf(tokenId); 
      assert.equal(owner,user2);
    });
  });


  describe("can set an operator", () => {
    let tokenId = 1;
    let tx;

    beforeEach(async () => {
      await this.contract.mint(tokenId,{from: user1});
      tx = await this.contract.setApprovalForAll(operator,true,{from: user1});
    });

    it('is approvedForAll tokens', async () => {
      let approved = await this.contract.isApprovedForAll(user1,operator, {from: user2});
      assert.equal(approved,true);
    });

    it ('emits ApprovalForAll event', async () => { 
      assert.equal(tx.logs[0].event,'ApprovalForAll');
      assert.equal(tx.logs[0].args._owner,user1);
      assert.equal(tx.logs[0].args._operator,operator);
    });

    it('allows operator to transfer ownership', async ()  => {
      let tx3 = await this.contract.transferFrom(user1,user2,tokenId,{from: operator});
      let owner = await this.contract.ownerOf(tokenId); 
      assert.equal(owner,user2);

    });

  });
});


var expectThrow = async function(promise) {
  try {
    await promise;
  } catch(err) {
    assert.exists(err);
    return;
  }
  assert.fail("Expected an error but didn\'t see one!");
}
