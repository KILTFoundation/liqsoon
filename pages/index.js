import { ConnectWallet, useNetwork, useSwitchNetwork } from "@thirdweb-dev/react";
import { useEffect } from "react";

export default function Home() {
  const { switchNetwork } = useSwitchNetwork();
  const { chain } = useNetwork();

  useEffect(() => {
    if (chain?.chainId !== 11155111) {
      switchNetwork(11155111); // Sepolia
    }
  }, [chain, switchNetwork]);

  return (
    <div>
      <ConnectWallet />
    </div>
  );
}
