pragma solidity ^0.8.20;
contract AssetRegistry{
    struct Asset {
        string cid;
        address creator;
        address owner;
        uint price;
        string name;
        bool exists;
    }
    mapping(uint256 => Asset) public assets;
    uint256 public assetCount;


    // UPLOADING ASSET :
    function uploadAsset(
        string memory cid,
        string memory name,
        uint256 price
    )public returns(uint256){
        require(bytes(cid).length > 0, "CID cannot be EMPTY!");
        require(bytes(name).length > 0, "NAME cannot be EMPTY!");
        require(price > 0, "Price cannot be ZERO!");
        assetCount++;
        assets[assetCount] = Asset({
            cid: cid,
            owner : msg.sender,
            creator : msg.sender,
            price : price,
            name : name,
            exists : true
        });
        emit AssetUploaded(assetCount, msg.sender, cid, name, price); // for the event
        return assetCount;
    }

    // Getting Asset (Details) :
    function getAsset(uint256 id)
                public
                view
                returns(
                    string memory,
                    address,
                    address,
                    uint256,
                    string memory
                )
            {
                require(assets[id].exists, "Asset does not exist!");
                Asset memory a = assets[id];
                return(
                    a.cid,
                    a.owner,
                    a.creator,
                    a.price,
                    a.name
                );
            }
    
    // EVENT : LOGS ON BLOCKCHAIN
    event AssetUploaded(
        uint256 id, 
        address creator,
        string cid,
        string name,
        uint256 price
    );
}