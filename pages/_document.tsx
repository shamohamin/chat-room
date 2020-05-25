import Document, { NextScript, Head, Main } from "next/document";

export default class CustomDocument extends Document {
  render() {
    return (
      <html lang="eng">
        <Head></Head>
        <body>
          <NextScript />
          <Main />
        </body>
      </html>
    );
  }
}
