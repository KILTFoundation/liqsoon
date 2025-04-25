import { useState, useEffect, useRef } from "react";
import { ConnectWallet, useNetwork, useAddress, useContract } from "@thirdweb-dev/react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import styles from "../styles/Home.module.css";

const OLD_KILT_ABI = [
  // ... (unchanged)
];

const MIGRATION_ABI = [
  // ... (unchanged)
];

export default function Home() {
  const [{ data: network }, switchNetwork] = useNetwork();
  const address = useAddress();
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(null);
  const [isApproved, setIsApproved] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const [termsContent, setTermsContent] = useState("Loading terms...");
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(true); // New state for network check
  const scrollRef = useRef(null);

  const { contract: oldKiltContract, isLoading: contractLoading } = useContract(
    "0x944f601b4b0edb54ad3c15d76cd9ec4c3df7b24b",
    OLD_KILT_ABI
  );
  const { contract: migrationContract } = useContract(
    "0xF92e735Fd5410Ccd7710Af0C0897F7389A39C303",
    MIGRATION_ABI
  );

  // Check network status without auto-switching
  useEffect(() => {
    if (network?.chain?.id) {
      setIsCorrectNetwork(network.chain.id === 84532);
    }
  }, [network]);

  // Balance fetch (unchanged)
  useEffect(() => {
    if (!address || !oldKiltContract) {
      setBalance(null);
      return;
    }
    const fetchBalance = async () => {
      try {
        const bal = await oldKiltContract.call("balanceOf", [address]);
        const balanceValue = bal?._hex ? BigInt(bal._hex) : BigInt(bal);
        const normalized = Number(balanceValue) / 10 ** 18;
        setBalance(normalized);
      } catch (err) {
        console.error("Balance fetch error:", err.message);
        setBalance("Error");
      }
    };
    fetchBalance();
  }, [address, oldKiltContract]);

  // Scroll handling (unchanged)
  useEffect(() => {
    const handleScroll = () => {
      const element = scrollRef.current;
      if (element) {
        const isBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 1;
        setScrolledToBottom(isBottom);
      }
    };
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
      return () => scrollElement.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Terms fetch (unchanged)
  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const response = await fetch("/terms.md");
        if (!response.ok) throw new Error("Failed to fetch terms");
        const text = await response.text();
        setTermsContent(text);
      } catch (err) {
        console.error("Failed to load terms:", err);
        setTermsContent("Failed to load terms and conditions.");
      }
    };
    fetchTerms();
  }, []);

  // Allowance check (unchanged)
  useEffect(() => {
    if (!oldKiltContract || !address || !amount) {
      setIsApproved(false);
      return;
    }
    const checkAllowance = async () => {
      try {
        const allowance = await oldKiltContract.call("allowance", [
          address,
          "0xF92e735Fd5410Ccd7710Af0C0897F7389A39C303"
        ]);
        const weiAmount = BigInt(Math.floor(Number(amount) * 10 ** 18));
        setIsApproved(BigInt(allowance) >= weiAmount);
      } catch (err) {
        console.error("Allowance check error:", err.message);
        setIsApproved(false);
      }
    };
    checkAllowance();
  }, [address, oldKiltContract, amount]);

  const handleApprove = async () => {
    if (!oldKiltContract || !amount || !address) return;
    const weiAmount = BigInt(Math.floor(Number(amount) * 10 ** 18)).toString();
    setIsProcessing(true);
    try {
      const tx = await oldKiltContract.call("approve", [
        "0xF92e735Fd5410Ccd7710Af0C0897F7389A39C303",
        weiAmount
      ]);
      console.log("Approval tx:", tx);
      alert("Approval successful!");
      setIsApproved(true);
    } catch (err) {
      console.error("Approval error:", err.message);
      alert("Approval failed: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMigrate = async () => {
    if (!migrationContract || !amount || !address) return;
    const weiAmount = BigInt(Math.floor(Number(amount) * 10 ** 18)).toString();
    setIsProcessing(true);
    try {
      const tx = await migrationContract.call("migrate", [weiAmount]);
      console.log("Migration tx:", tx);
      alert("Migration successful!");
      setIsApproved(false);
    } catch (err) {
      console.error("Migration error:", err.message);
      if (err.message.includes("Insufficient allowance")) {
        alert("Please approve the amount first.");
      } else if (err.message.includes("Pausable: paused")) {
        alert("Migration is paused. Please try later.");
      } else {
        alert("Migration failed: " + err.message);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleButtonClick = (e) => {
    // Input validation
    if (Number(amount) <= 0 || Number(amount) > balance) {
      alert("Amount must be positive and less than or equal to your balance.");
      return;
    }
    e.currentTarget.classList.remove("bounce");
    void e.currentTarget.offsetWidth;
    e.currentTarget.classList.add("bounce");
    if (isApproved) {
      handleMigrate();
    } else {
      handleApprove();
    }
  };

  const handleProceed = () => {
    if (isChecked && scrolledToBottom) {
      setShowOverlay(false);
    }
  };

  const handleCheckboxChange = (e) => {
    if (scrolledToBottom) {
      setIsChecked(e.target.checked);
    }
  };

  // New: Handle network switch on user action
  const handleSwitchNetwork = async () => {
    if (switchNetwork) {
      try {
        await switchNetwork(84532);
        setIsCorrectNetwork(true);
      } catch (err) {
        console.error("Network switch error:", err.message);
        alert("Failed to switch network: " + err.message);
      }
    }
  };

  return (
    <div style={{ 
      backgroundImage: "url('/tartanbackground.png')",
      backgroundColor: "#000",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed",
      minHeight: "100vh",
      fontFamily: "Arial, sans-serif",
      position: "relative"
    }}>
      {showOverlay && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          zIndex: 1000,
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <div style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "8px",
            width: "500px",
            maxWidth: "90%",
            textAlign: "center"
          }}>
            <h2 style={{ marginBottom: "20px", color: "#000" }}>
              Migration Terms & Conditions
            </h2>
            <div
              ref={scrollRef}
              style={{
                maxHeight: "200px",
                overflowY: "auto",
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "20px",
                textAlign: "left",
                color: "#000"
              }}
            >
              <ReactMarkdown>{termsContent}</ReactMarkdown>
            </div>
            <div style={{ 
              marginBottom: "20px", 
              textAlign: "left", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center" 
            }}>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
                disabled={!scrolledToBottom}
                style={{ marginRight: "10px" }}
              />
              <label style={{ color: "#000" }}>I agree</label>
            </div>
            <button
              onClick={handleProceed}
              disabled={!isChecked || !scrolledToBottom}
              style={{
                padding: "10px 20px",
                backgroundColor: isChecked && scrolledToBottom ? "#D73D80" : "#ccc",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: isChecked && scrolledToBottom ? "pointer" : "not-allowed",
                fontSize: "16px",
                opacity: isChecked && scrolledToBottom ? 1 : 0.6
              }}
            >
              Proceed
            </button>
          </div>
        </div>
      )}

      <header style={{ padding: "20px", textAlign: "center", backgroundColor: "#D73D80", color: "#fff" }}>
        <img
          src="/KILT-Horizontal-black.png"
          alt="KILT Logo"
          style={{ width: "200px", height: "auto" }}
        />
      </header>

      <main>
        <div className={styles.container}>
          <div style={{ textAlign: "center", margin: "20px 0" }}>
            <p style={{ fontSize: "32px", fontWeight: "bold" }}>Migration Portal</p>
            <p>Migrate KILT on the BASE Network from</p>
            <p style={{ fontSize: "18px" }}><code>0x944f601b4b0edb54ad3c15d76cd9ec4c3df7b24b</code></p>
            <p>to</p>
            <p style={{ fontSize: "18px" }}><code>0xc400539b5e08bce7866574d5fe26814e942c0f3e</code></p>
            <hr style={{ border: "1px solid #D73D80", margin: "20px auto", width: "400px" }} />
            <div style={{
              background: "rgba(19, 87, 187, 0.8)",
              padding: "15px",
              borderRadius: "8px",
              margin: "20px auto",
              width: "200px",
              textAlign: "center",
              color: "#fff"
            }}>
              <div>
                <span style={{ fontWeight: "bold" }}>Migration Ratio</span>
                <br />
                <br />
                <span>1:1.75</span>
              </div>
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <div style={{ marginBottom: "2rem" }}>
              <ConnectWallet />
            </div>

            {/* New: Network warning prompt */}
            {!isCorrectNetwork && address && (
              <div style={{
                background: "rgba(255, 0, 0, 0.8)",
                padding: "15px",
                borderRadius: "8px",
                margin: "20px auto",
                width: "500px",
                textAlign: "center",
                color: "#fff"
              }}>
                <p style={{ fontWeight: "bold" }}>
                  Wrong Network Detected
                </p>
                <p>
                  Please switch to Base Sepolia (Chain ID: 84532) to proceed with migration.
                </p>
                <button
                  onClick={handleSwitchNetwork}
                  style={{
                    margin: "10px",
                    padding: "10px 20px",
                    backgroundColor: "#DAF525",
                    color: "#000",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "16px"
                  }}
                >
                  Switch to Base Sepolia
                </button>
              </div>
            )}

            {address ? (
              <div style={{ 
                background: "rgba(19, 87, 187, 0.8)",
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
                    {contractLoading
                      ? "Contract loading..."
                      : balance === null
                      ? "Loading..."
                      : balance === "Error"
                      ? "Failed to load"
                      : `${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })} Migrateable KILT`}
                  </span>
                </div>
              </div>
            ) : (
              <p>Connect your wallet to view balance.</p>
            )}

            <div style={{ margin: "20px 0" }}>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                style={{ margin: "10px", padding: "8px", width: "200px" }}
              />
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button
                  onClick={handleButtonClick}
                  disabled={!amount || !address || isProcessing || !isCorrectNetwork}
                  className={styles.card}
                  style={{
                    margin: "10px",
                    padding: "10px 20px",
                    width: "180px",
                    height: "40px",
                    backgroundColor: isApproved ? "#D73D80" : "#DAF525",
                    fontSize: "18px",
                    fontWeight: isApproved ? "bold" : "normal",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                    opacity: !amount || !address || isProcessing || !isCorrectNetwork ? 0.6 : 1,
                    cursor: !amount || !address || isProcessing || !isCorrectNetwork ? "not-allowed" : "pointer"
                  }}
                >
                  {isProcessing ? (
                    <span
                      style={{
                        display: "inline-block",
                        width: "20px",
                        height: "20px",
                        border: `3px solid ${isApproved ? "#fff" : "#000"}`,
                        borderTop: "3px solid transparent",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite"
                      }}
                    />
                  ) : (
                    isApproved ? "Migrate" : "Approve"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer style={{ padding: "10px", textAlign: "center", color: "#666", fontSize: "14px" }}>
        <div>
          <div style={{ marginBottom: "10px" }}>
            <Link
              href="/dashboard"
              className={styles.footerLink2}
              style={{ fontSize: "28px" }}
            >
              →Dashboard
            </Link>
          </div>
          <a href="https://www.kilt.io/imprintBVI" className={styles.footerLink}>Imprint</a>
          {" | "}
          <a href="https://www.kilt.io/privacy-policyBVI" className={styles.footerLink}>Privacy Policy</a>
          {" | "}
          <a href="https://www.kilt.io/disclaimerBVI" className={styles.footerLink}>Disclaimer</a>
          {" | "}
          <a href="https://www.kilt.io" className={styles.footerLink}>Homepage</a>
          {" | "}
          <a href="https://www.kilt.io" className={styles.footerLink}>Security Audit</a>
        </div>
      </footer>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes bounce {
          0% { transform: scale(1); }
          50% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
        .bounce {
          animation: bounce 0.2s ease-in-out;
        }
      `}</style>
    </div>
  );
}
