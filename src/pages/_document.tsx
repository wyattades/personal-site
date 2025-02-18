import NextDocument, { Head, Html, Main, NextScript } from "next/document";
import { DocumentBody } from "~/components/body-props";

export default class Document extends NextDocument {
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
