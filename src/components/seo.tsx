import Head from "next/head";
import {
  generateDefaultSeo,
  generateNextSeo,
  type DefaultSeoProps,
  type NextSeoProps,
} from "next-seo/pages";

export const DefaultSeo = (props: DefaultSeoProps) => {
  return <Head>{generateDefaultSeo(props)}</Head>;
};

export const NextSeo = (props: NextSeoProps) => {
  return <Head>{generateNextSeo(props)}</Head>;
};
