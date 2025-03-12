import { useState, useEffect } from "react";
import { ConnectWallet, useNetwork, useAddress, useContract } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";

const OLD_KILT_ABI = [
  {
    constant: true,
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" }
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function"
  }
];

const MIGRATION_ABI = [
  {
    inputs: [{ name: "amount", type: "uint256" }],
    name: "migrate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "BURN_ADDRESS",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "EXCHANGE_RATE_NUMERATOR",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "EXCHANGE_RATE_DENOMINATOR",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "isMigrationActive",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "newToken",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "oldToken",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "addr", type: "address" }],
    name: "whitelist",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  }
];

export default function Dashboard() {
  const [{ data: network }, switchNetwork] = useNetwork();
  const address = useAddress();
  const [burnAddress, setBurnAddress] = useState(null);
  const [exchangeRateNumerator, setExchangeRateNumerator] = useState(null);
  const [exchangeRateDenominator, setExchangeRateDenominator] = useState(null);
  const [isMigrationActive, setIsMigrationActive] = useState(null);
  const [newToken, setNewToken] = useState(null);
  const [oldToken, setOldToken] = useState(null);
  const [owner, setOwner] = useState(null);
  const [whitelistAddress, setWhitelistAddress] = useState("");
  const [whitelistResult, setWhitelistResult] = useState(null);

  const { contract: oldKiltContract } = useContract(
    "0x944f601b4b0edb54ad3c15d76cd9ec4c3df7b24b",
    OLD_KILT_ABI
  );
  const { contract: migrationContract } = useContract(
    "0xE9a37BDe0B9dAa20e226608d04AEC6358928c82b",
    MIGRATION_ABI
  );

  useEffect(() => {
    if (network?.chain?.id !== 84532 && switchNetwork) {
      switchNetwork(84532);
    }
  }, [network, switchNetwork]);

  const fetchContractData = async () => {
    if (!migrationContract) return;

    try {
      const burnAddr = await migrationContract.call("BURN_ADDRESS");
      setBurnAddress(burnAddr);

      const numerator = await migrationContract.call("EXCHANGE_RATE_NUMERATOR");
      setExchangeRateNumerator(numerator.toString());

      const denominator = await migrationContract.call("EXCHANGE_RATE_DENOMINATOR");
      setExchangeRateDenominator(denominator.toString());

      const migrationActive = await migrationContract.call("isMigrationActive");
      setIsMigrationActive(migrationActive);

      const newTok = await migrationContract.call("newToken");
      setNewToken(newTok);

      const oldTok = await migrationContract.call("oldToken");
      setOldToken(oldTok);

      const own = await migrationContract.call("owner");
      setOwner(own);
    } catch (err) {
      console.error("Data fetch error:", err.message);
      setBurnAddress("Error");
      setExchangeRateNumerator("Error");
      setExchangeRateDenominator("Error");
      setIsMigrationActive("Error");
      setNewToken("Error");
      setOldToken("Error");
      setOwner("Error");
    }
  };

  const fetchWhitelistStatus = async () => {
    if (!migrationContract || !whitelistAddress) return;

    try {
      const result = await migrationContract.call("whitelist", [whitelistAddress]);
      setWhitelistResult(result.toString());
    } catch (err) {
      console.error("Whitelist fetch error:", err.message);
      setWhitelistResult("Error");
    }
  };

  useEffect(() => {
    fetchContractData();
  }, [migrationContract]);

  return (
    <div style={{ backgroundColor: "#13061f", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
      <header style={{ padding: "20px", textAlign: "center", backgroundColor: "#D73D80", color: "#fff" }}>
        <img
          src="/KILT-Horizontal-black.png"
          alt="KILT Logo"
          style={{ width: "200px", height: "auto" }}
        />
      </header>

      <main className={styles.main}>
        <div className={styles.container}>
          <div style={{ textAlign: "center", margin: "20px 0" }}>
            <p style={{ fontSize: "32px", fontWeight: "bold" }}>Migration Dashboard</p>
            <div className={styles.connect} style={{ margin: "10px 0" }}>
              <ConnectWallet />
            </div>
            <p style={{ color: "#fff" }}>
              <span style={{ fontWeight: "bold" }}>Migration Contract: </span>
              0xe9a37bde0b9daa20e226608d04aec6358928c82b
            </p>
          </div>

          <div style={{ textAlign: "center", margin: "20px 0" }}>
            <p style={{ fontSize: "24px", fontWeight: "bold", color: "#fff" }}>Read Contract</p>
          </div>

          {/* BURN_ADDRESS Card */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "20px 0" }}>
            <div style={{
              background: "#1357BB",
              padding: "15px",
              borderRadius: "8px",
              width: "500px",
              textAlign: "left",
              color: "#fff"
            }}>
              <div>
                <span style={{ fontWeight: "bold" }}>BURN_ADDRESS: </span>
                <span>
                  {migrationContract
                    ? burnAddress === null
                      ? "Loading..."
                      : burnAddress === "Error"
                      ? "Failed to load"
                      : burnAddress
                    : "Contract not loaded"}
                </span>
              </div>
            </div>
            <button
              onClick={fetchContractData}
              className={styles.card}
              style={{ marginLeft: "10 Camillepx", padding: "10px 20px" }}
            >
              Query
            </button>
          </div>

          {/* EXCHANGE_RATE_NUMERATOR Card */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "20px 0" }}>
            <div style={{
              background: "#1357BB",
              padding: "15px",
              borderRadius: "8px",
              width: "500px",
              textAlign: "left",
              color: "#fff"
            }}>
              <div>
                <span style={{ fontWeight: "bold" }}>EXCHANGE_RATE_NUMERATOR: </span>
                <span>
                  {migrationContract
                    ? exchangeRateNumerator === null
                      ? "Loading..."
                      : exchangeRateNumerator === "Error"
                      ? "Failed to load"
                      : exchangeRateNumerator
                    : "Contract not loaded"}
                </span>
              </div>
            </div>
            <button
              onClick={fetchContractData}
              className={styles.card}
              style={{ marginLeft: "10px", padding: "10px 20px" }}
            >
              Query
            </button>
          </div>

          {/* EXCHANGE_RATE_DENOMINATOR Card */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "20px 0" }}>
            <div style={{
              background: "#1357BB",
              padding: "15px",
              borderRadius: "8px",
              width: "500px",
              textAlign: "left",
              color: "#fff"
            }}>
              <div>
                <span style={{ fontWeight: "bold" }}>EXCHANGE_RATE_DENOMINATOR: </span>
                <span>
                  {migrationContract
                    ? exchangeRateDenominator === null
                      ? "Loading..."
                      : exchangeRateDenominator === "Error"
                      ? "Failed to load"
                      : exchangeRateDenominator
                    : "Contract not loaded"}
                </span>
              </div>
            </div>
            <button
              onClick={fetchContractData}
              className={styles.card}
              style={{ marginLeft: "10px", padding: "10px 20px" }}
            >
              Query
            </button>
          </div>

          {/* isMigrationActive Card */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "20px 0" }}>
            <div style={{
              background: "#1357BB",
              padding: "15px",
              borderRadius: "8px",
              width: "500px",
              textAlign: "left",
              color: "#fff"
            }}>
              <div>
                <span style={{ fontWeight: "bold" }}>isMigrationActive: </span>
                <span>
                  {migrationContract
                    ? isMigrationActive === null
                      ? "Loading..."
                      : isMigrationActive === "Error"
                      ? "Failed to load"
                      : isMigrationActive.toString()
                    : "Contract not loaded"}
                </span>
              </div>
            </div>
            <button
              onClick={fetchContractData}
              className={styles.card}
              style={{ marginLeft: "10px", padding: "10px 20px" }}
            >
              Query
            </button>
          </div>

          {/* newToken Card */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "20px 0" }}>
            <div style={{
              background: "#1357BB",
              padding: "15px",
              borderRadius: "8px",
              width: "500px",
              textAlign: "left",
              color: "#fff"
            }}>
              <div>
                <span style={{ fontWeight: "bold" }}>newToken: </span>
                <span>
                  {migrationContract
                    ? newToken === null
                      ? "Loading..."
                      : newToken === "Error"
                      ? "Failed to load"
                      : newToken
                    : "Contract not loaded"}
                </span>
              </div>
            </div>
            <button
              onClick={fetchContractData}
              className={styles.card}
              style={{ marginLeft: "10px", padding: "10px 20px" }}
            >
              Query
            </button>
          </div>

          {/* oldToken Card */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "20px 0" }}>
            <div style={{
              background: "#1357BB",
              padding: "15px",
              borderRadius: "8px",
              width: "500px",
              textAlign: "left",
              color: "#fff"
            }}>
              <div>
                <span style={{ fontWeight: "bold" }}>oldToken: </span>
                <span>
                  {migrationContract
                    ? oldToken === null
                      ? "Loading..."
                      : oldToken === "Error"
                      ? "Failed to load"
                      : oldToken
                    : "Contract not loaded"}
                </span>
              </div>
            </div>
            <button
              onClick={fetchContractData}
              className={styles.card}
              style={{ marginLeft: "10px", padding: "10px 20px" }}
            >
              Query
            </button>
          </div>

          {/* Owner Card */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "20px 0" }}>
            <div style={{
              background: "#1357BB",
              padding: "15px",
              borderRadius: "8px",
              width: "500px",
              textAlign: "left",
              color: "#fff"
            }}>
              <div>
                <span style={{ fontWeight: "bold" }}>Owner: </span>
                <span>
                  {migrationContract
                    ? owner === null
                      ? "Loading..."
                      : owner === "Error"
                      ? "Failed to load"
                      : owner
                    : "Contract not loaded"}
                </span>
              </div>
            </div>
            <button
              onClick={fetchContractData}
              className={styles.card}
              style={{ marginLeft: "10px", padding: "10px 20px" }}
            >
              Query
            </button>
          </div>

          {/* Check Whitelist Card */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "20px 0" }}>
            <div style={{
              background: "#1357BB",
              padding: "15px",
              borderRadius: "8px",
              width: "500px",
              textAlign: "left",
              color: "#fff"
            }}>
              <div>
                <span style={{ fontWeight: "bold" }}>Check Whitelist: </span>
                <input
                  type="text"
                  value={whitelistAddress}
                  onChange={(e) => setWhitelistAddress(e.target.value)}
                  placeholder="Enter address"
                  style={{ marginLeft: "10px", padding: "5px", width: "250px" }}
                />
                <span style={{ marginLeft: "10px" }}>
                  {whitelistResult === null
                    ? ""
                    : whitelistResult === "Error"
                    ? "Failed to load"
                    : whitelistResult}
                </span>
              </div>
            </div>
            <button
              onClick={fetchWhitelistStatus}
              className={styles.card}
              style={{ marginLeft: "10px", padding: "10px 20px" }}
            >
              Query
            </button>
          </div>

        </div>
      </main>

      <footer style={{ padding: "10px", textAlign: "center", color: "#666", fontSize: "14px" }}>
        <div>
          <a href="/" className={styles.footerLink} style={{ fontSize: "18px", display: "block", marginBottom: "10px" }}>
            Portal
          </a>
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
  return {
    props: {},
  };
}
