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
    mapping(bytes32 => bool) public starHashMap;

    // create a star
    function createStar(string _name, string _story, string _ra, string _dec, string _mag) public {

        // block (start) height as a token identify
        numTokens++;
        uint256 _tokenId = numTokens;

        //check if _tokenId already exists
        require(keccak256(abi.encodePacked(tokenIdToStarInfo[_tokenId].coordinates.dec)) == keccak256(""));

        // checks if the coordinates are not empty
        require(keccak256(abi.encodePacked(_ra)) != keccak256(""));
        require(keccak256(abi.encodePacked(_dec)) != keccak256(""));
        require(keccak256(abi.encodePacked(_mag)) != keccak256(""));
        require(_tokenId != 0);
        require(!checkIfStarExist(_ra, _dec, _mag));

        // add coordinates in struct
        Coordinates memory coordinates = Coordinates(_ra, _dec, _mag);
        Star memory newStar = Star(_name, _story, coordinates);

        tokenIdToStarInfo[_tokenId] = newStar;

        // set star hash as true
        starHashMap[keccak256(abi.encodePacked(_ra, _dec, _mag))] = true;

        // Reverts if the given token ID already exists
        _mint(msg.sender, _tokenId);
    }

    // set star for sale
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

    // verify if already exists
    function checkIfStarExist(string _ra, string _dec, string _mag) public view returns (bool) {
        return starHashMap[keccak256(abi.encodePacked(_ra, _dec, _mag))];
    }

    // return star info
    function tokenIdToStarInfo(uint256 _tokenId) public view returns (string, string, string, string, string) {
        return (
        tokenIdToStarInfo[_tokenId].name,
        tokenIdToStarInfo[_tokenId].story,
        tokenIdToStarInfo[_tokenId].coordinates.ra,
        tokenIdToStarInfo[_tokenId].coordinates.dec,
        tokenIdToStarInfo[_tokenId].coordinates.mag);
    }

    // simple override mint method from parent
    function mint(uint256 _tokenId) public {
        // Reverts if the given token ID already exists
        super._mint(msg.sender, _tokenId);
    }
}