import { useState, useEffect } from "react"; // React hooks for state management and side effects
import { ConnectWallet, useNetwork, useAddress, useContract } from "@thirdweb-dev/react"; // Thirdweb components/hooks for wallet and contract interaction
import Link from "next/link"; // Next.js component for client-side routing
import styles from "../styles/Home.module.css"; // CSS module for shared styles across pages

// ABI for the old KILT token contract, defining balance checks and approval
const OLD_KILT_ABI = [
  {
    constant: true, // Read-only function
    inputs: [{ name: "owner", type: "address" }], // Address to check balance for
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }], // Returns balance in wei
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { name: "spender", type: "address" }, // Address allowed to spend tokens
      { name: "amount", type: "uint256" } // Amount to approve in wei
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }], // Returns success status
    stateMutability: "nonpayable", // Modifies state, requires gas
    type: "function"
  }
];

// ABI for the migration contract, defining the migrate function
const MIGRATION_ABI = [
  {
    inputs: [{ name: "amount", type: "uint256" }], // Amount of old tokens to migrate
    name: "migrate",
    outputs: [], // No return value
    stateMutability: "nonpayable", // Modifies state, requires gas
    type: "function"
  }
];

// Main Home component for the migration portal
export default function Home() {
  // Network state and switcher from Thirdweb, ensures BASE chain (ID 84532)
  const [{ data: network }, switchNetwork] = useNetwork();
  const address = useAddress(); // Current connected wallet address
  // State for user input and UI feedback
  const [amount, setAmount] = useState(""); // Amount of KILT to migrate, input by user
  const [balance, setBalance] = useState(null); // User's old KILT balance
  const [isApproved, setIsApproved] = useState(false); // Tracks if approval is done
  const [isProcessing, setIsProcessing] = useState(false); // Tracks transaction processing for spinner

  // Thirdweb hooks to connect to smart contracts
  const { contract: oldKiltContract, isLoading: contractLoading } = useContract(
    "0x944f601b4b0edb54ad3c15d76cd9ec4c3df7b24b", // Old KILT token contract address
    OLD_KILT_ABI
  );
  const { contract: migrationContract } = useContract(
    "0xE9a37BDe0B9dAa20e226608d04AEC6358928c82b", // Migration contract address
    MIGRATION_ABI
  );

  // Effect to switch network to BASE (chain ID 84532) if not already connected
  useEffect(() => {
    if (network?.chain?.id !== 84532 && switchNetwork) { // Check if not on BASE
      switchNetwork(84532); // Switch to BASE chain
    }
  }, [network, switchNetwork]); // Runs when network or switcher changes

  // Effect to fetch user's old KILT balance when address or contract changes
  useEffect(() => {
    if (!address || !oldKiltContract) { // Skip if no wallet or contract
      setBalance(null); // Reset balance to null
      return;
    }

    // Async function to fetch balance
    const fetchBalance = async () => {
      try {
        const bal = await oldKiltContract.call("balanceOf", [address]); // Call balanceOf for user
        const balanceValue = bal?._hex ? BigInt(bal._hex) : BigInt(bal); // Handle hex or bigint output
        const normalized = Number(balanceValue) / 10 ** 18; // Convert from wei to KILT
        setBalance(normalized); // Update state with normalized balance
      } catch (err) {
        console.error("Balance fetch error:", err.message); // Log error for debugging
        setBalance("Error"); // Show error state to user
      }
    };

    fetchBalance(); // Execute balance fetch
  }, [address, oldKiltContract]); // Dependencies trigger re-fetch on change

  // Function to approve migration contract to spend old KILT tokens
  const handleApprove = async () => {
    if (!oldKiltContract || !amount || !address) return; // Skip if prerequisites missing
    const weiAmount = BigInt(Math.floor(Number(amount) * 10 ** 18)).toString(); // Convert input to wei
    setIsProcessing(true); // Show spinner during transaction
    try {
      const tx = await oldKiltContract.call("approve", [
        "0xE9a37BDe0B9dAa20e226608d04AEC6358928c82b", // Migration contract address
        weiAmount // Amount to approve
      ]);
      console.log("Approval tx:", tx); // Log transaction details
      alert("Approval successful!"); // Notify user of success
      setIsApproved(true); // Mark approval as complete
    } catch (err) {
      console.error("Approval error:", err.message); // Log error for debugging
      alert("Approval failed. Check console."); // Notify user of failure
    } finally {
      setIsProcessing(false); // Hide spinner regardless of outcome
    }
  };

  // Function to migrate old KILT tokens to new ones
  const handleMigrate = async () => {
    if (!migrationContract || !amount || !address) return; // Skip if prerequisites missing
    const weiAmount = BigInt(Math.floor(Number(amount) * 10 ** 18)).toString(); // Convert input to wei
    setIsProcessing(true); // Show spinner during transaction
    try {
      const tx = await migrationContract.call("migrate", [weiAmount]); // Call migrate function
      console.log("Migration tx:", tx); // Log transaction details
      alert("Migration successful!"); // Notify user of success
      setIsApproved(false); // Reset approval state for next cycle
    } catch (err) {
      console.error("Migration error:", err.message); // Log error for debugging
      alert("Migration failed. Check console."); // Notify user of failure
    } finally {
      setIsProcessing(false); // Hide spinner regardless of outcome
    }
  };

  // Handler for button clicks, triggers bounce animation and approve/migrate logic
  const handleButtonClick = (e) => {
    e.currentTarget.classList.remove("bounce"); // Remove bounce class to reset animation
    void e.currentTarget.offsetWidth; // Force reflow to restart animation
    e.currentTarget.classList.add("bounce"); // Add bounce class to trigger animation
    if (isApproved) {
      handleMigrate(); // Migrate if already approved
    } else {
      handleApprove(); // Approve if not yet approved
    }
  };

  // Render the migration portal UI
  return (
    <div style={{ 
      backgroundImage: "url('/tartanbackground.png')", // Tartan background pattern
      backgroundColor: "#000", // Black fallback if image fails
      backgroundSize: "cover", // Cover entire viewport
      backgroundPosition: "center", // Center the image
      backgroundRepeat: "no-repeat", // Prevent tiling
      backgroundAttachment: "fixed", // Fixed position for parallax effect
      minHeight: "100vh", // Full viewport height
      fontFamily: "Arial, sans-serif" // Consistent font
    }}>
      {/* Header with KILT logo */}
      <header style={{ padding: "20px", textAlign: "center", backgroundColor: "#D73D80", color: "#fff" }}>
        <img
          src="/KILT-Horizontal-black.png"
          alt="KILT Logo"
          style={{ width: "200px", height: "auto" }} // Responsive logo size
        />
      </header>

      <main>
        <div className={styles.container}> {/* Container for layout consistency */}
          {/* Intro section with migration details */}
          <div style={{ textAlign: "center", margin: "20px 0" }}>
            <p style={{ fontSize: "32px", fontWeight: "bold" }}>Migration Portal</p>
            <p>Migrate KILT on the BASE Network from</p>
            <p style={{ fontSize: "18px" }}><code>0x944f601b4b0edb54ad3c15d76cd9ec4c3df7b24b</code></p> {/* Old token address */}
            <p>to</p>
            <p style={{ fontSize: "18px" }}><code>0x634390EE30d03f26ac8575e830724b349625b65d</code></p> {/* New token address */}
            <hr style={{ border: "1px solid #D73D80", margin: "20px auto", width: "400px" }} /> {/* Pink divider */}
            {/* Migration ratio display */}
            <div style={{
              background: "rgba(19, 87, 187, 0.8)", // Blue semi-transparent background
              padding: "15px",
              borderRadius: "8px",
              margin: "20px auto", // Center horizontally
              width: "200px",
              textAlign: "center",
              color: "#fff"
            }}>
              <div>
                <span style={{ fontWeight: "bold" }}>Migration Ratio</span>
                <br />
                <br />
                <span>1:1.75</span> {/* Fixed ratio of old to new tokens */}
              </div>
            </div>
          </div>

          {/* Wallet and action section */}
          <div style={{ textAlign: "center" }}>
            {/* Wallet connection button */}
            <div style={{ marginBottom: "2rem" }}>
              <ConnectWallet /> {/* Thirdweb component for wallet connect */}
            </div>

            {/* Display wallet info if connected */}
            {address ? (
              <div style={{ 
                background: "rgba(19, 87, 187, 0.8)", // Blue card background
                padding: "15px",
                borderRadius: "8px",
                margin: "20px auto", // Center horizontally
                width: "500px",
                textAlign: "left"
              }}>
                <div style={{ marginBottom: "10px" }}>
                  <span style={{ fontWeight: "bold", color: "#fff" }}>Wallet: </span>
                  <span style={{ color: "#fff" }}>{address}</span> {/* Show connected address */}
                </div>
                <div>
                  <span style={{ fontWeight: "bold", color: "#fff" }}>Balance: </span>
                  <span style={{ color: "#fff" }}>
                    {contractLoading
                      ? "Contract loading..." // Show while contract loads
                      : balance === null
                      ? "Loading..." // Initial load state
                      : balance === "Error"
                      ? "Failed to load" // Error state
                      : `${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })} Migrateable KILT`} {/* Formatted balance */}
                  </span>
                </div>
              </div>
            ) : (
              <p>Connect your wallet to view balance.</p> // Prompt to connect if no address
            )}

            {/* Input and action button */}
            <div style={{ margin: "20px 0" }}>
              {/* Input for amount to migrate */}
              <input
                type="number" // Restrict to numeric input
                value={amount}
                onChange={(e) => setAmount(e.target.value)} // Update state on change
                placeholder="0" // Default placeholder
                style={{ margin: "10px", padding: "8px", width: "200px" }} // Fixed width
              />
              <div style={{ display: "flex", justifyContent: "center" }}>
                {/* Button to approve or migrate */}
                <button
                  onClick={handleButtonClick} // Trigger bounce and action
                  disabled={!amount || !address || isProcessing} // Disable if invalid state
                  className={styles.card} // Apply card styles
                  style={{
                    margin: "10px",
                    padding: "10px 20px",
                    width: "180px", // Fixed width
                    height: "40px", // Fixed height to prevent collapse
                    backgroundColor: isApproved ? "#D73D80" : "#DAF525", // Pink for migrate, yellow for approve
                    fontSize: "18px",
                    fontWeight: isApproved ? "bold" : "normal", // Bold for migrate
                    textAlign: "center",
                    display: "flex", // Flex for centering content
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative" // For spinner positioning
                  }}
                >
                  {isProcessing ? ( // Show spinner during processing
                    <span
                      style={{
                        display: "inline-block",
                        width: "20px",
                        height: "20px",
                        border: `3px solid ${isApproved ? "#fff" : "#000"}`, // White for migrate, black for approve
                        borderTop: "3px solid transparent", // Transparent top for spin effect
                        borderRadius: "50%", // Circular shape
                        animation: "spin 1s linear infinite" // Continuous spin animation
                      }}
                    />
                  ) : (
                    isApproved ? "Migrate" : "Approve" // Text based on approval state
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer with navigation and links */}
      <footer style={{ padding: "10px", textAlign: "center", color: "#666", fontSize: "14px" }}>
        <div>
          <div style={{ marginBottom: "10px" }}>
            <Link
              href="/dashboard" // Link to Dashboard page
              className={styles.footerLink2}
              style={{ fontSize: "28px" }}
            >
              →Dashboard
            </Link>
          </div>
          <a href="https://www.kilt.io/imprint" className={styles.footerLink}>Imprint</a>
          {" | "}
          <a href="https://www.kilt.io/privacy-policy" className={styles.footerLink}>Privacy Policy</a>
          {" | "}
          <a href="https://www.kilt.io/disclaimer" className={styles.footerLink}>Disclaimer</a>
          {" | "}
          <a href="https://www.kilt.io" className={styles.footerLink}>Homepage</a>
          {" | "}
          <a href="https://www.kilt.io" className={styles.footerLink}>Security Audit</a>
        </div>
      </footer>

      {/* CSS-in-JS for spinner and bounce animations */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); } /* Start at 0 degrees */
          100% { transform: rotate(360deg); } /* Full rotation */
        }
        @keyframes bounce {
          0% { transform: scale(1); } /* Normal size */
          50% { transform: scale(0.95); } /* Shrink to 95% */
          100% { transform: scale(1); } /* Back to normal */
        }
        .bounce {
          animation: bounce 0.2s ease-in-out; /* 0.2s bounce with smooth easing */
        }
      `}</style>
    </div>
  );
}
