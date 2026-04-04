import { ethers } from "ethers";
import ABI from "../contract/AssetRegistry.json";
import CONTRACT_ADDRESS from "../../shared/config";

export function useContract() {
  const getContract = async () => {
    if (!window.ethereum) {
      console.warn("MetaMask not found");
      return null;
    }

    try {
      console.log("Connecting to contract...");
      await window.ethereum.request({ method: "eth_requestAccounts" });
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      
      console.log("Connected successfully");
      return contract;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const uploadAsset = async (cid, name, price) => {
    const contract = await getContract();
    
    if (!contract) {
      console.warn("Contract not available");
      return null;
    }

    try {
      const tx = await contract.uploadAsset(cid, name, price);
      await tx.wait();
      return tx.hash;
    } catch (error) {
      if (
        error?.code === "ACTION_REJECTED" || 
        error?.code === 4001 || 
        error?.message?.toLowerCase().includes("rejected")
      ) {
        console.warn("Transaction rejected");
      } else {
        console.error(error);
      }
      return null;
    }
  };

  const getAllAssets = async () => {
    const contract = await getContract();
    
    if (!contract) {
      return [];
    }

    try {
      const assets = await contract.getAllAssets();
      return assets;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  return { getContract, uploadAsset, getAllAssets };
}