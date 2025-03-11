import { useState, useEffect } from "react";
import { ConnectWallet, useNetwork, useAddress, useContract } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";

const OLD_KILT_ABI = [ /* unchanged */ ];
const MIGRATION_ABI = [ /* unchanged */ ];

export default function Home() {
  const [{ data: network }, switchNetwork] = useNetwork();
  const address = useAddress();
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(null);
  const [balanceError, setBalanceError] = useState(null);

  const { contract: oldKiltContract, isLoading: contractLoading, error: contractError } = useContract(
    "0x944f601b4b0edb54ad3c15d76cd9ec4c3df7b24b",
    OLD_KILT_ABI
  );
  const { contract: migrationContract } = useContract(
    "0xE9a37BDe0B9dAa20e226608d04AEC6358928c82b",
    MIGRATION_ABI
  );

  useEffect(() => { /* unchanged */ }, [network, switchNetwork]);
  useEffect(() => { /* unchanged */ }, [address, oldKiltContract]);

  const handleApprove = async () => { /* unchanged */ };
  const handleMigrate = async () => { /* unchanged */ };

  return (
    <div
      style={{
        backgroundImage: "url('/tartan.png')", // Replace with your image path
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed", // Optional: fixed background while scrolling
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <header
        style={{
          padding: "20px",
          textAlign: "center",
          backgroundColor: "rgba(215, 61, 128, 0.8)", // Semi-transparent header
          color: "#fff",
        }}
      >
        <img
          src="/KILT-Horizontal-black.png"
          alt="KILT Logo"
          style={{ width: "200px", height: "auto" }}
        />
      </header>

      <main className={styles.main}>
        <div className={styles.container}>
          <div style={{ textAlign: "center", margin: "20px 0" }}>
            <p style={{ fontSize: "32px", fontWeight: "bold", color: "#fff" }}>Migration Portal</p>
            <p style={{ color: "#fff" }}>Migrate KILT on the BASE Network from</p>
            <p><code>0x944f601b4b0edb54ad3c15d76cd9ec4c3df7b24b</code></p>
            <p style={{ color: "#fff" }}>to</p>
            <p><code>0x634390EE30d03f26ac8575e830724b349625b65d</code></p>
            <hr style={{ border: "1px solid #D73D80", margin: "20px auto", width: "400px" }} />
            <p style={{ color: "#fff" }}>Migration Ratio</p>
            <p style={{ color: "#fff" }}>1:1.75</p>
          </div>

          <div className={styles.header} style={{ textAlign: "center" }}>
            <div className={styles.connect}>
              <ConnectWallet />
            </div>

            {address ? (
              <div style={{ 
                background: "rgba(19, 87, 187, 0.8)", // Semi-transparent wallet box
                padding: "15px",
                borderRadius: "8px",
                margin: "20px auto",
                width: "500px",
                textAlign: "left"
              }}>
                <div style={{ marginBottom: "10px" }}>
                  <span style={{ fontWeight: "bold", color: "#fff" }}>Wallet: </span>
                  <span style={{ color: "#fff" }}>{address}</span>
                </div>
                <div>
                  <span style={{ fontWeight: "bold", color: "#fff" }}>Balance: </span>
                  <span style={{ color: "#fff" }}>
                    {contractLoading ? "Contract loading..." : balance === null ? "Loading..." : balance === "Error" ? "Failed to load" : `${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })} Migrateable KILT`}
                  </span>
                </div>
              </div>
            ) : (
              <p style={{ color: "#fff" }}>Connect your wallet to view balance.</p>
            )}

            <div style={{ margin: "20px 0" }}>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className={styles.code}
                style={{ margin: "10px", padding: "8px", width: "200px" }}
              />
              <div className={styles.grid} style={{ justifyContent: "center" }}>
                <button onClick={handleApprove} disabled={!amount || !address} className={styles.card} style={{ margin: "10px", padding: "10px 20px" }}>
                  Approve
                </button>
                <button onClick={handleMigrate} disabled={!amount || !address} className={styles.card} style={{ margin: "10px", padding: "10px 20px" }}>
                  Migrate
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer
        style={{
          padding: "10px",
          textAlign: "center",
          color: "#fff",
          fontSize: "14px",
          backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent footer
        }}
      >
        <div>
          <a href="https://www.kilt.io/imprint" className={styles.footerLink}>Imprint</a>
          {" | "}
          <a href="https://www.kilt.io/privacy-policy" className={styles.footerLink}>Privacy Policy</a>
          {" | "}
          <a href="https://www.kilt.io/disclaimer" className={styles.footerLink}>Disclaimer</a>
          {" | "}
          <a href="https://www.kilt.io" className={styles.footerLink}>Homepage</a>
        </div>
      </footer>
    </div>
  );
}

export async function getServerSideProps() {
  return { props: {} };
}
