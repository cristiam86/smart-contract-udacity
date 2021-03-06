pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";

contract StarNotary is ERC721 {

    struct Star {
        string name;
    }

//  Add a name and a symbol for your starNotary tokens
    string public constant name = "CDC Star Notary";
    string public constant symbol = "CSN";
//

    mapping(uint256 => Star) public tokenIdToStarInfo;
    mapping(uint256 => uint256) public starsForSale;

    // uint256[] public tokenIds;

    // function getTokenIds() public view returns (uint256[]){
    //     return tokenIds;
    // }

    function createStar(string memory _name, uint256 _tokenId) public {
        Star memory newStar = Star(_name);

        tokenIdToStarInfo[_tokenId] = newStar;
        // tokenIds.push(_tokenId);

        _mint(msg.sender, _tokenId);
    }


// Add a function lookUptokenIdToStarInfo, that looks up the stars using the Token ID, and then returns the name of the star.
    function lookUptokenIdToStarInfo(uint256 _tokenId) public view returns (string memory) {
        return tokenIdToStarInfo[_tokenId].name;
    }
//

    function putStarUpForSale(uint256 _tokenId, uint256 _price) public {
        require(ownerOf(_tokenId) == msg.sender);

        starsForSale[_tokenId] = _price;
    }

    function buyStar(uint256 _tokenId) public payable {
        require(starsForSale[_tokenId] > 0);

        uint256 starCost = starsForSale[_tokenId];
        address starOwner = ownerOf(_tokenId);
        require(msg.value >= starCost);

        _removeTokenFrom(starOwner, _tokenId);
        _addTokenTo(msg.sender, _tokenId);

        // starOwner.transfer(starCost);

        if(msg.value > starCost) {
            msg.sender.transfer(msg.value - starCost);
        }
        starsForSale[_tokenId] = 0;
    }

// Add a function called exchangeStars, so 2 users can exchange their star tokens...
//Do not worry about the price, just write code to exchange stars between users.
    function exchangeStars(uint256 _token1, uint256 _token2) public {
        require(ownerOf(_token1) == msg.sender);
        require(ownerOf(_token2) != msg.sender);

        address otherParty = ownerOf(_token2);

        require(ownerOf(_token1) != otherParty);

        safeTransferFrom(msg.sender, otherParty, _token1);
        unsafeTransfer(otherParty, msg.sender, _token2);
        
        /*
        for (uint i = 0; i < tokenIds.length; i++) {
            if(ownerOf(tokenIds[i]) == _address1) {
                unsafeTransfer(_address1, _address2, tokenIds[i]);
            } else if(ownerOf(tokenIds[i]) == _address2) {
                unsafeTransfer(_address2, _address1, tokenIds[i]);
            }
        }
        */
        
    }

    function unsafeTransfer(address _from, address _to, uint256 _tokenId) private {
        _removeTokenFrom(_from, _tokenId);
        _addTokenTo(_to, _tokenId);
    }
//

// Write a function to Transfer a Star. The function should transfer a star from the address of the caller.
// The function should accept 2 arguments, the address to transfer the star to, and the token ID of the star.
//
    function transferStar(address _to, uint256 _tokenId) public {
        require(ownerOf(_tokenId) == msg.sender);
        
        safeTransferFrom(msg.sender, _to, _tokenId);
    }
}
