import NextDocument, { Head, Html, Main, NextScript } from "next/document";

import { DocumentBody } from "~/components/BodyProps";

class Document extends NextDocument {
  static async getInitialProps(ctx) {
    const initialProps = await NextDocument.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head />
        <DocumentBody>
          <Main />
          <NextScript />
        </DocumentBody>
      </Html>
    );
  }
}

export default Document;
