import "../styles/globals.css";
import { Nunito_Sans } from "next/font/google";

const nunitoSans = Nunito_Sans({
    subsets: ["latin"],
    variable: "--font-nunito-sans",
});

export default function App({ Component, pageProps }) {
    return (
        <div className={`bg-black text-white ${nunitoSans.variable}`}>
            <Component {...pageProps} />
        </div>
    );
}
