async function main(){
    const Contract = await ethers.getContractFactory("AssetRegistry");
    const contract = await Contract.deploy();
    await contract.deployed(); // ETHERS V5
    console.log("Contract Deployed No. ", contract.address);
}

main().catch((error)=> {
    console.error(error);
    process.exit(1);
})