import { ConnectWallet, useNetwork } from "@thirdweb-dev/react";
import { useEffect } from "react";

export default function Home() {
  const [{ data: network }, switchNetwork] = useNetwork();

  useEffect(() => {
    if (network?.chain?.id !== 11155111) {
      // Try thirdweb switch, fallback to MetaMask
      if (switchNetwork) {
        switchNetwork(11155111); // Sepolia
      } else {
        window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x" + (11155111).toString(16) }], // Hex 11155111 = 0xaa36a7
        });
      }
    }
  }, [network, switchNetwork]);

  return (
    <div>
      <ConnectWallet />
    </div>
  );
}
