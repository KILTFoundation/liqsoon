import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div
      className={styles.backgroundGlitch}
      style={{
        backgroundImage: "url('/bg1.png')",
        backgroundColor: "#000",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
        fontFamily: "'Courier New', monospace",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header
        style={{
          padding: "20px",
          minHeight: "80px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "10px 20px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Image
            src="/KILT-Horizontal-white.png"
            alt="KILT Logo"
            width={300}
            height={60}
            style={{ height: "auto" }}
          />
        </div>
      </header>
      <main
        style={{
          maxWidth: "1200px",
          margin: "5px auto",
          padding: "0 20px",
          textAlign: "center",
          position: "relative",
          zIndex: 2,
          flex: "1 0 auto",
        }}
      >
        <h1 className={styles.glitch} data-glitch="Liquidity Portal">
          Liquidity Portal
        </h1>
        <p style={{ fontSize: "30px", margin: "20px 0", fontWeight: "bold" }}>
          [Beta Testing]
        </p>
        <p
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            fontSize: "20px",
            fontWeight: "bold",
          }}
        >
          The KILT Liquidity Portal is coming soon.
          <br />
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSdSqL2YkEFt1ER6KkbTaFpjGsSydPMLVZ5j_zKkOFOVH7Po7w/viewform?usp=dialog"
            style={{ color: "#f0f", textDecoration: "underline", fontWeight: "bold" }}
          >
            Sign up
          </a>{" "}
          for beta testing.
        </p>
      </main>
      <div className={styles.staticOverlay}></div>
      <footer
        style={{
          padding: "10px",
          textAlign: "center",
          color: "#fff",
          fontSize: "14px",
          position: "relative",
          zIndex: 2,
          flexShrink: 0,
        }}
      >
        <div>
          <a href="https://www.kilt.io" className={styles.footerLink} style={{ color: "#fff" }}>
            Home
          </a>
          {" | "}
          <a href="https://www.kilt.io/imprint" className={styles.footerLink} style={{ color: "#fff" }}>
            Imprint
          </a>
          {" | "}
          <a
            href="/pp"
            className={styles.footerLink}
            style={{ color: "#fff" }}
          >
            Privacy Policy
          </a>
          {" | "}
          <a
            href="/terms"
            className={styles.footerLink}
            style={{ color: "#fff" }}
          >
            Terms & Conditions
          </a>
          {" | "}
          <a
            href="https://www.kilt.io/disclaimer"
            className={styles.footerLink}
            style={{ color: "#fff" }}
          >
            Disclaimer
          </a>
        </div>
      </footer>
    </div>
  );
}
