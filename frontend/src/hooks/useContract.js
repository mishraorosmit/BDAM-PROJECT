import { useEffect, useState } from "react";
import { getContract } from "../contract/contract";

export default function useContract() {
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const loadContract = async () => {
      const instance = await getContract();
      setContract(instance);
    };

    loadContract();
  }, []);

  return contract;
}