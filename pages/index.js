```jsx
import { useState, useEffect, useRef } from "react";
import { ConnectWallet, useAddress, useContract, useNetworkMismatch, useSwitchChain } from "@thirdweb-dev/react";
import Link from "next/link";
import Image from "next/image"; // Added for optimized image
import ReactMarkdown from "react-markdown";
import styles from "../styles/Home.module.css";

const OLD_KILT_ABI = [
  { constant: true, inputs: [{ name: "owner", type: "address" }], name: "balanceOf", outputs: [{ name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { constant: false, inputs: [{ name: "spender", type: "address" }, { name: "value", type: "uint256" }], name: "approve", outputs: [{ name: "", type: "bool" }], stateMutability: "nonpayable", type: "function" },
  { constant: true, inputs: [{ name: "owner", type: "address" }, { name: "spender", type: "address" }], name: "allowance", outputs: [{ name: "", type: "uint256" }], stateMutability: "view", type: "function" }
];

const MIGRATION_ABI = [
  { constant: true, inputs: [], name: "BURN_ADDRESS", outputs: [{ name: "", type: "address" }], stateMutability: "view", type: "function" },
  { constant: true, inputs: [], name: "EXCHANGE_RATE_NUMERATOR", outputs: [{ name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { constant: true, inputs: [], name: "EXCHANGE_RATE_DENOMINATOR", outputs: [{ name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { constant: true, inputs: [], name: "isMigrationActive", outputs: [{ name: "", type: "bool" }], stateMutability: "view", type: "function" },
  { constant: true, inputs: [], name: "newToken", outputs: [{ name: "", type: "address" }], stateMutability: "view", type: "function" },
  { constant: true, inputs: [], name: "oldToken", outputs: [{ name: "", type: "address" }], stateMutability: "view", type: "function" },
  { constant: true, inputs: [], name: "paused", outputs: [{ name: "", type: "bool" }], stateMutability: "view", type: "function" },
  { constant: true, inputs: [{ name: "addr", type: "address" }], name: "whitelist", outputs: [{ name: "", type: "bool" }], stateMutability: "view", type: "function" },
  { constant: false, inputs: [{ name: "amount", type: "uint256" }], name: "migrate", outputs: [], stateMutability: "nonpayable", type: "function" }
];

export default function Home() {
  const address = useAddress();
  const switchChain = useSwitchChain();
  const isNetworkMismatch = useNetworkMismatch();
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(null);
  const [isApproved, setIsApproved] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const [termsContent, setTermsContent] = useState("Loading terms...");
  const scrollRef = useRef(null);

  const { contract: oldKiltContract, isLoading: contractLoading } = useContract(
    "0x9E5189a77f698305Ef76510AFF1C528cff48779c",
    OLD_KILT_ABI
  );
  const { contract: migrationContract } = useContract(
    "0x4A62F30d95a8350Fc682642A455B299C074B3B8c",
    MIGRATION_ABI
  );

  useEffect(() => {
    console.log("Network mismatch status:", isNetworkMismatch);
  }, [isNetworkMismatch]);

  const fetchBalance = async () => {
    if (!address || !oldKiltContract) {
      setBalance(null);
      return;
    }
    try {
      const bal = await oldKiltContract.call("balanceOf", [address]);
      const balanceValue = bal?._hex ? BigInt(bal._hex) : BigInt(bal);
      const normalized = Number(balanceValue) / 10 ** 15;
      setBalance(normalized);
    } catch (err) {
      console.error("Balance fetch error:", err.message);
      setBalance("Error");
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [address, oldKiltContract]);

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

  useEffect(() => {
    if (!oldKiltContract || !address || !amount || Number(amount) <= 0) {
      setIsApproved(false);
      return;
    }
    const checkAllowance = async () => {
      try {
        const allowance = await oldKiltContract.call("allowance", [
          address,
          "0x4A62F30d95a8350Fc682642A455B299C074B3B8c"
        ]);
        const weiAmount = BigInt(Math.floor(Number(amount) * 10 ** 15));
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
    const weiAmount = BigInt(Math.floor(Number(amount) * 10 ** 15)).toString();
    setIsProcessing(true);
    try {
      const tx = await oldKiltContract.call("approve", [
        "0x4A62F30d95a8350Fc682642A455B299C074B3B8c",
        weiAmount
      ]);
      console.log("Approval tx:", tx);
      await fetchBalance();
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
    const weiAmount = BigInt(Math.floor(Number(amount) * 10 ** 15)).toString();
    setIsProcessing(true);
    try {
      const tx = await migrationContract.call("migrate", [weiAmount]);
      console.log("Migration tx:", tx);
      await fetchBalance();
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

  const handleSwitchNetwork = async () => {
    if (switchChain) {
      try {
        await switchChain(8453);
        console.log("Switched to Base (8453)");
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
              Terms and Conditions of Use
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
        <Image
          src="/KILT-Horizontal-black.png"
          alt="KILT Logo"
          width={200}
          height={40} // Adjust based on actual image aspect ratio
          style={{ height: "auto" }}
        />
      </header>

      <main style={{ display: "flex", maxWidth: "1200px", margin: "20px auto", padding: "0 20px" }}>
        {/* Left Column */}
        <div style={{ flex: "1", paddingRight: "20px", textAlign: "left", color: "#fff" }}>
          <p style={{ fontSize: "32px", fontWeight: "bold" }}>Migration Portal</p>
          <p>Migrate KILT on the BASE Network from</p>
          <p style={{ fontSize: "18px" }}><code>0x9E5189a77f698305Ef76510AFF1C528cff48779c</code></p>
          <p>to</p>
          <p style={{ fontSize: "18px" }}><code>0x5D0DD05bB095fdD6Af4865A1AdF97c39C85ad2d8</code></p>
        </div>

        {/* Right Column */}
        <div style={{ flex: "1", paddingLeft: "20px" }}>
          <div style={{
            background: "rgba(19, 87, 187, 0.8)",
            padding: "20px",
            borderRadius: "8px",
            textAlign: "center",
            color: "#fff",
            position: "relative"
          }}>
            <div style={{ position: "absolute", top: "20px", right: "20px" }}>
              <ConnectWallet />
            </div>

            {address && isNetworkMismatch && (
              <div style={{
                background: "#D73D80",
                padding: "15px",
                borderRadius: "8px",
                margin: "20px 0",
                textAlign: "center",
                color: "#fff"
              }}>
                <p style={{ fontWeight: "bold" }}>
                  Wrong Network Detected
                </p>
                <p>
                  Please switch to Base (Chain ID: 8453) to proceed with migration.
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
                  Switch to Base
                </button>
              </div>
            )}

            <div style={{
              background: "#fff",
              width: "90%",
              margin: "20px auto",
              padding: "20px",
              borderRadius: "8px",
              position: "relative",
              textAlign: "left"
            }}>
              <div style={{ position: "absolute", top: "10px", right: "10px", color: "#000" }}>
                <span style={{ fontWeight: "bold" }}>Balance: </span>
                <span>
                  {contractLoading
                    ? "Contract loading..."
                    : balance === null
                    ? "Loading..."
                    : balance === "Error"
                    ? "Failed to load"
                    : `${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })} KILT`}
                </span>
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount to migrate"
                style={{
                  width: "100%",
                  padding: "12px",
                  fontSize: "16px",
                  border: "none",
                  outline: "none",
                  background: "transparent"
                }}
              />
            </div>

            <div style={{ margin: "20px 0" }}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button
                  onClick={handleButtonClick}
                  disabled={!amount || !address || isProcessing || isNetworkMismatch}
                  className={styles.card}
                  style={{
                    margin: "10px",
                    padding: "10px 20px",
                    width: "180px",
                    height: "40px",
                    backgroundColor: isApproved ? "#D73D80" : "#DAF525",
                    fontSize: "18px",
                    fontWeight: "bold",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "",
                    opacity: !amount || !address || isProcessing || isNetworkMismatch ? 0.6 : 1,
                    cursor: !amount || !address || isProcessing || isNetworkMismatch ? "not-allowed" : "pointer"
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

      <footer style={{ padding: "10px", textAlign: "center", color: "#fff", fontSize: "14px" }}>
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
          <a href="https://www.kilt.io/privacy-policyBVI" className={styles.button} style={{color: "white"}}>Privacy Policy</a>
          {" | "}
          <a href="#" className={styles.button} style={{color: "white"}}>Disclaimer</a>
          {" | "}
          <a href="https://www.kilt.io" className={styles.footerLink}>HOME</a>
          {" | "}
          <a href="#" className={styles.footerLink}>Security Audit</a>
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
```
