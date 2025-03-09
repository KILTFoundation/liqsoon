import { useState, useEffect } from "react";
import { ConnectWallet, useNetwork, useAddress, useContract } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [{ data: network }, switchNetwork] = useNetwork();
  const address = useAddress(); // Wallet address
  const [amount, setAmount] = useState(""); // Amount to approve
  const [balance, setBalance] = useState(null); // oldKILT balance

  // oldKILT token contract
  const { contract: oldKiltContract } = useContract("0x944f601b4b0edb54ad3c15d76cd9ec4c3df7b24b", "token");
  // Migration contract (to approve spending)
  const migrationContractAddress = "0x322422335ea70370557d475e94d85cfd0ec15637";

  // Auto-switch to Base Sepolia
  useEffect(() => {
    if (network?.chain?.id !== 84532) {
      if (switchNetwork) {
        switchNetwork(84532); // Base Sepolia
      } else {
        window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x14a34" }], // Base Sepolia
        });
      }
    }
  }, [network, switchNetwork]);

  // Fetch oldKILT balance
  useEffect(() => {
    if (address && oldKiltContract) {
      oldKiltContract.call("balanceOf", [address]).then((bal) => {
        setBalance(bal.toString()); // Raw balance (wei-like units)
      }).catch((err) => console.error("Balance fetch failed:", err));
    }
  }, [address, oldKiltContract]);

  // Approve function
  const handleApprove = async () => {
    if (!oldKiltContract || !amount || !address) return;
    try {
      const tx = await oldKiltContract.call("approve", [migrationContractAddress, amount]);
      console.log("Approval successful:", tx);
      alert("Approval successful!");
    } catch (err) {
      console.error("Approval failed:", err);
      alert("Approval failed. Check console.");
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.connect}>
            <ConnectWallet />
          </div>

          {/* Display balance */}
          {address ? (
            <div>
              <p>Wallet: {address}</p>
              <p>oldKILT Balance: {balance ? balance : "Loading..."}</p>
            </div>
          ) : (
            <p>Connect your wallet to view balance.</p>
          )}

          {/* Amount input and approve button */}
          <div className={styles.grid}>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount to migrate"
              className={styles.code}
            />
            <button
              onClick={handleApprove}
              disabled={!amount || !address}
              className={styles.card}
            >
              Approve Migration
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
