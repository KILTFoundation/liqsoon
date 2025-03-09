import { ConnectWallet, useNetwork } from "@thirdweb-dev/react";
import { useEffect } from "react";
import styles from "../styles/Home.module.css";
import Image from "next/image";

export default function Home() {
  const [{ data: network }, switchNetwork] = useNetwork();

  useEffect(() => {
    if (network?.chain?.id !== 84532) {
      if (switchNetwork) {
        switchNetwork(84532); // Base Sepolia
      } else {
        window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x14a34" }], // Base Sepolia (84532 in hex)
        });
      }
    }
  }, [network, switchNetwork]);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            Welcome to{" "}
            <span className={styles.gradientText0}>
              <a
                href="https://thirdweb.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                thirdweb
              </a>
            </span>
          </h1>

          <p className={styles.description}>
            Get started by configuring your desired network in{" "}
            <code className={styles.code}>pages/_app.js</code>, then modify the
            contents of <code className={styles.code}>pages/index.js</code>!
          </p>

          <div className={styles.connect}>
            <ConnectWallet />
          </div>
        </div>

        <div className={styles.grid}>
          <a
            href="https://portal.thirdweb.com/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.card}
          >
            <h2>Portal</h2>
            <p>Guides, references, and resources to build on thirdweb.</p>
          </a>

          <a
            href="https://thirdweb.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.card}
          >
            <h2>Dashboard</h2>
            <p>Deploy, configure, and manage your smart contracts.</p>
          </a>

          <a
            href="https://feedback.thirdweb.com/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.card}
          >
            <h2>Feedback</h2>
            <p>
              Suggest features or improvements to the thirdweb team directly!
            </p>
          </a>

          <a href="/mint" className={styles.card}>
            <h2>Minting Page &rarr;</h2>
            <p>Mint your own NFT from a deployed NFT Collection contract!</p>
          </a>
        </div>
      </div>
    </main>
  );
}
