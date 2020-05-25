import App from "next/app";
import Head from "next/head";
import Layout from "../components/layout";
import Wrapper from "../lib/index";

class CustomApp extends App {
  static async getInitialProps(prop: any) {
    let pageProps = {};

    if (prop.Component.getInitialProps) {
      pageProps = await prop.Component.getInitialProps(prop.ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <div>
        <Head>
          <title>Chat Prop</title>
          <meta name="description" content="Advance chat room" />
          <link rel="icon" href="/favicon.ico" />
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.1/css/all.min.css"
          />
        </Head>
        <div>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </div>
        <style global jsx>{`
          * {
            margin: 0px;
            padding: 0px;
          }
          body {
            background-color: #282c34;
            width: 100%;
            min-height: 100vh;
            color: white;
            font-size: 16px;
          }
        `}</style>
      </div>
    );
  }
}

export default Wrapper.withRedux(CustomApp);
