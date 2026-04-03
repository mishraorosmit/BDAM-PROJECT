Contract name : BDAM 
1. uploadAsset - Upload a new Digital Asset to Blockchain
    INPUT : 
        cid(string) : IPFS hash of asset.
        price(uint) : initial price in wei.
    BEHAVIOR : 
        Creates a new asset, sets - creator : msg.sender
                                    owner : msg.sender
                                    price : Given price

2. buyAsset- Buy an Existing Asset
    INPUT : id(uint) : ASSET id
    OUTPUT : NONE
    BEHAVIOR : When called, 
        a. Buyer Sends ETH (msg.Value).
        b. Contract Checks : msg.value >= price.
        c. Transfer ETH to previous owner.
        d. Updates : new owner = Buyer
        e. Updates price : price = price/2
    
3. getAsset : Fetch Asset details
    INPUT : id(uint) 
    OUTPUT : 
        cid(string)
        creator(address)
        owner(address)
        price(uint)
    BEHAVIOR : Return Asset Struct Data

4. getTotalAsset : Get Total no. of Assets
    INPUT : NONE
    OUTPUT : total count(uint)
    BEHAVIOR : Return the length of Asset Array

SOLIDITY STRUCTURE : 
struct Asset{
    string cid;
    address creator;
    address owner;
    uint price;
}