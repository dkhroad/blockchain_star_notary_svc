pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";

contract StarNotary is ERC721 {
    struct Star {
        string name;
        string ra;
        string dec;
        string mag;
        string starStory;
    }

    mapping(uint256 => Star) public tokenIdToStarMapping; 
  
    mapping(uint256 => uint256) public starForSale; 

    mapping(bytes32 => bool) public starExists;

    function createStar(string _name, 
                        string _ra,
                        string _dec,
                        string _mag,
                        string _starStory,
                        uint256 _tokenId) public {
        // input parameter valiadation
        require(bytes(_dec).length > 0 &&
                bytes(_ra).length > 0  && 
                bytes(_mag).length > 0 &&
                _tokenId != 0,
                "missing args");

        // ensure token id doesn't already exist
        require(bytes(tokenIdToStarMapping[_tokenId].dec).length == 0 && 
                bytes(tokenIdToStarMapping[_tokenId].ra).length == 0,
                "token id already exists");

        // ensure star doesn't exist 
        bytes32  hash = uniqueHash(_ra,_dec,_mag);

        // intentionally not calling checkIfStarExist()
        // because calling that function requires computing hash twice 
        // which is not economical (would cause more gas)
        require(starExists[hash] == false,"Star is already claimed");

        Star memory NewStar = Star(_name,_ra,_dec,_mag,_starStory);
        starExists[hash]  = true;
        tokenIdToStarMapping[_tokenId] = NewStar;
        _mint(msg.sender,_tokenId);
    }

    function putStarUpForSale(uint256 _tokenId, uint256 _price) public {
        require(this.ownerOf(_tokenId) == msg.sender,"Only owner can put a star up for sale");
        starForSale[_tokenId] = _price;
    }

    function buyStar(uint256 _tokenId) public payable {
        require(starForSale[_tokenId] > 0,"Star must be for sale");
        uint256 starCost  = starForSale[_tokenId];
        require(msg.value >= starCost,"insufficient funds");
        address starOwner = this.ownerOf(_tokenId);

        _removeTokenFrom(starOwner, _tokenId);
        _addTokenTo(msg.sender,_tokenId);

        starOwner.transfer(starCost);
        
        // return overpaid amount 
        if (msg.value > starCost) {
            msg.sender.transfer(msg.value - starCost);
        }

    }

    function checkIfStarExist(string _ra, string _dec, string _mag) public view returns(bool) {
        return starExists[uniqueHash(_ra,_dec,_mag)];
    }
    function uniqueHash(string _ra,string _dec, string _mag) private pure returns(bytes32) {
        return keccak256(abi.encodePacked(_ra,_dec,_mag));
    }

    function tokenIdToStarInfo(uint256 _tokenId) public view returns(string,string,string,string,string) {
        require(bytes(tokenIdToStarMapping[_tokenId].dec).length != 0,"invalid tokenId??");
        Star memory star = tokenIdToStarMapping[_tokenId];
        return (star.name,
                star.starStory,
                string(abi.encodePacked("ra_",star.ra)),
                string(abi.encodePacked("dec_",star.dec)),
                string(abi.encodePacked("mag_",star.mag)));
        

    }

}
