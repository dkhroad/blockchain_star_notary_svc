pragma solidity ^0.4.23;

import  "./ERC721Token.sol";

contract StarNotary is ERC721Token {
    struct Star {
        string name;
    }

    mapping(uint256 => Star) public tokenIdToStarInfo; 
  
    mapping(uint256 => uint256) public starForSale; 

    function createStar(string _name,uint256 _tokenId) public {
        Star memory NewStar = Star(_name);
        tokenIdToStarInfo[_tokenId] = NewStar;
        ERC721Token.mint(_tokenId);
    }

    function putStarUpForSale(uint256 _tokenId, uint256 _price) public {
        require(this.ownerOf(_tokenId) == msg.sender,"Only owner can put a star up for sale");
        starForSale[_tokenId] = _price;
    }

    function buyStar(uint256 _tokenId) public payable {
        require(starForSale[_tokenId] > 0,"Star must be for sale");
        uint256 starCost  = starForSale[_tokenId];
        require(msg.value >= starCost);
        address starOwner = this.ownerOf(_tokenId);

        clearPreviousStarState(_tokenId);
        ERC721Token.transferFromHelper(starOwner,msg.sender,_tokenId);

        starOwner.transfer(starCost);
        // return overpaid amount 
        if (msg.value > starCost) {
            msg.sender.transfer(msg.value - starCost);
        }

    }

    function clearPreviousStarState(uint256 _tokenId) private {
        tokenToApproved[_tokenId] = address(0);
        starForSale[_tokenId] = uint256(0);
    }
}
