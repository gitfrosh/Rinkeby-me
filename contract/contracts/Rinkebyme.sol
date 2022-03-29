pragma solidity 0.8.1;


import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

// We need to import the helper functions from the contract that we copy/pasted.
import { Base64 } from "./libraries/Base64.sol";

contract Rinkebyme is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  string baseSvg = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: monospace; font-size: 26px; }</style><rect width='100%' height='100%' fill='purple' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";
  event NewEpicNFTMinted(address sender, uint256 tokenId);

  constructor() ERC721 ("RinkebymeNFT", "RINKEBYME") {
    console.log("Rinkebyme, yeah!");
  }


    function makeAnEpicNFT() public {
    uint256 newItemId = _tokenIds.current();

    string memory finalSvg = string(abi.encodePacked(baseSvg, "RINKEBY ROCKS", "</text></svg>"));

    // Get all the JSON metadata in place and base64 encode it.
    string memory json = Base64.encode(
        bytes(
            string(
                abi.encodePacked(
                    '{"name": "RINKEBY ROCKS!", "description": "A friendly NFT living on Rinkeby.", "image": "data:image/svg+xml;base64,',
                    // We add data:image/svg+xml;base64 and then append our base64 encode our svg.
                    Base64.encode(bytes(finalSvg)),
                    '"}'
                )
            )
        )
    );

    // Just like before, we prepend data:application/json;base64, to our data.
    string memory finalTokenUri = string(
        abi.encodePacked("data:application/json;base64,", json)
    );

    console.log("\n--------------------");
    console.log(finalTokenUri);
    console.log("--------------------\n");

    _safeMint(msg.sender, newItemId);
    
    // Update your URI!!!
    _setTokenURI(newItemId, finalTokenUri);
  
    _tokenIds.increment();
    console.log("An NFT w/ ID %s has been minted to %s", newItemId, msg.sender);
  
    emit NewEpicNFTMinted(msg.sender, newItemId);
  }
}