import NextDocument, { Html, Head, Main, NextScript } from 'next/document';

import { DocumentBody } from 'components/BodyProps';

class Document extends NextDocument {
  static async getInitialProps(ctx) {
    const initialProps = await NextDocument.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
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
