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

    event AssetSold(
        uint256 id,
        address buyer,
        address seller,
        uint256 price
    );

// GETTING ALL ASSETS :

    function getAllAssets() public view returns (Asset[] memory){
        Asset[] memory allAssets = new Asset[](assetCount);
        for(uint256 i = 1; i <= assetCount; i++){
            allAssets[i-1] = assets[i];
        } 
        return allAssets;
    }

// BUYING ASSETS *****************************************************

    function buyAsset(uint256 id) public payable{
        Asset storage asset = assets[id];

        require(asset.exists, "Asset Does Not Exist!!");
        require(msg.sender != asset.owner, "Cannot Buy Your Own Asset!!");
        uint256 price = asset.price;
        require(msg.value>=price, "Not enough ETH");
        address seller = asset.owner;
        uint256 sellerAmout = price/2;

    // PAY SELLER : 
        (bool sent,) = payable(seller).call{value : sellerAmout}("");
        require(sent, "Payment to seller failed!!");

    // UPDATE OWNER : 
        asset.owner = msg.sender;

    // INCREASE PRICE :
        asset.price = price + (price/2);

    // REFUND EXTRA :
        if(msg.value > price){
            uint256 refund = msg.value-price;
            (bool refunded, ) = payable(msg.sender).call{value : refund}("");
            require(refunded, "Refund FAILED!!");
        }

        emit AssetSold(id, msg.sender , seller, price);
    }

}