import { ethers } from "ethers";
import abi from "./abi.json";

const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS";

export const getContract = async () => {
  if (!window.ethereum) return null;

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    abi,
    signer
  );

  return contract;
};