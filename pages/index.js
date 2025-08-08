import Image from "next/image";
     import Link from "next/link";
     import styles from "../styles/Home.module.css";

     export default function Home() {
       return (
         <div className={styles.backgroundGlitch} style={{
           backgroundImage: "url('/tartanbackground.png')",
           backgroundColor: "#000",
           backgroundSize: "cover",
           backgroundPosition: "center",
           backgroundRepeat: "no-repeat",
           backgroundAttachment: "fixed",
           minHeight: "100vh",
           fontFamily: "'Courier New', monospace",
           color: "#fff"
         }}>
           <header style={{
             padding: "20px",
             backgroundColor: "rgba(215, 61, 128, 0.5)"
           }}>
             <div style={{
               maxWidth: "1200px",
               margin: "0 auto",
               padding: "0 20px",
               display: "flex",
               justifyContent: "flex-start"
             }}>
               <Image
                 src="/KILT-Horizontal-white.png"
                 alt="KILT Logo"
                 width={200}
                 height={40}
                 style={{ height: "auto" }}
               />
             </div>
           </header>
           <main style={{
             maxWidth: "1200px",
             margin: "40px auto",
             padding: "0 20px",
             textAlign: "center"
           }}>
             <h1 className={styles.glitch} data-glitch="KILT Liquidity Portal">Liquidity Portal</h1>
             <p style={{ fontSize: "24px", margin: "20px 0" }}>Beta Testing</p>
             <p style={{ maxWidth: "600px", margin: "0 auto" }}>
               The KILT Liquidity Portal is coming soon. Sign up for beta testing <a href="https://docs.google.com/forms/d/e/1FAIpQLSdSqL2YkEFt1ER6KkbTaFpjGsSydPMLVZ5j_zKkOFOVH7Po7w/viewform?usp=dialog" style={{ color: "#f0f", textDecoration: "underline" }}>here</a>.
             </p>
           </main>
           <footer style={{
             padding: "10px",
             textAlign: "center",
             color: "#666",
             fontSize: "14px"
           }}>
             <div>
               <a href="https://www.kilt.io" className={styles.footerLink}>Home</a>
               {" | "}
               <a href="https://www.kilt.io/imprint" className={styles.footerLink}>Imprint</a>
               {" | "}
               <a href="https://www.kilt.io/privacy-policy" className={styles.footerLink}>Privacy Policy</a>
               {" | "}
               <a href="https://www.kilt.io/disclaimer" className={styles.footerLink}>Disclaimer</a>
             </div>
           </footer>
         </div>
       );
     }
