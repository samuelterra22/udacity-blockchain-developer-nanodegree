pragma solidity ^0.4.23;

// CRITERION: Smart contract contains required functions / OpenZeppelin implements all requested methods

import 'openzeppelin-solidity/contracts/token/ERC721/ERC721.sol';

// CRITERION: Define and implement interface / Smart contract implements the ERC-721 or ERC721Token interface
contract StarNotary is ERC721 {

    uint256 public numTokens;

    // CRITERION: Add metadata to the star token

    /* Star struct */
    struct Star {
        string name;
        string story;
        Coordinates coordinates;
    }

    /* Star coordinates struct */
    struct Coordinates {
        string ra;
        string dec;
        string mag;
    }

    mapping(uint256 => Star) public tokenIdToStarInfo;
    mapping(uint256 => uint256) public starsForSale;

    function createStar(string _name, string _story, string ra, string dec, string mag) public {

        numTokens++;
        uint256 _tokenId = numTokens;

        // add coordinates in struct
        Coordinates memory coordinates = Coordinates(ra, dec, mag);
        Star memory newStar = Star(_name, _story, coordinates);

        tokenIdToStarInfo[_tokenId] = newStar;

        _mint(msg.sender, _tokenId);
    }

    function putStarUpForSale(uint256 _tokenId, uint256 _price) public {
        require(this.ownerOf(_tokenId) == msg.sender);

        starsForSale[_tokenId] = _price;
    }

    function buyStar(uint256 _tokenId) public payable {
        require(starsForSale[_tokenId] > 0);

        uint256 starCost = starsForSale[_tokenId];
        address starOwner = this.ownerOf(_tokenId);
        require(msg.value >= starCost);

        _removeTokenFrom(starOwner, _tokenId);
        _addTokenTo(msg.sender, _tokenId);

        starOwner.transfer(starCost);

        if (msg.value > starCost) {
            msg.sender.transfer(msg.value - starCost);
        }
    }
}