import "../styles/globals.css";
import { setGlobalGqlOptions } from "../../dist";

setGlobalGqlOptions({
  endpoint: "https://countries.trevorblades.com",
});

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
