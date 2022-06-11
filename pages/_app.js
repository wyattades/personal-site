import Head from 'next/head';
import Script from 'next/script';
import { DefaultSeo } from 'next-seo';

import { ThemeProvider } from 'components/StyleTheme';

import 'styles/global.scss';

const HOST_URL = process.env.HOST_URL;

const getDefaultLayout = (p) => p.children;

const App = ({ Component, pageProps }) => {
  const renderLayout = Component.getLayout || getDefaultLayout;

  return (
    <>
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
      </Head>
      {process.env.NODE_ENV === 'production' ? (
        <Script
          data-website-id="583e2bc6-8606-4c14-a2be-70612377adff"
          src="https://sip-umami.vercel.app/umami.js"
        />
      ) : null}

      <DefaultSeo
        title="Wyatt Ades - Portfolio"
        description="A website for my projects and contact information"
        openGraph={{
          type: 'website',
          locale: 'en_US',
          url: HOST_URL,
          site_name: 'Wyatt Ades Portfolio',
          images: [
            {
              url: HOST_URL + '/cover-1200x630.png',
              width: 1200,
              height: 630,
              alt: 'Wyatt Ades portfolio cover',
            },
          ],
        }}
        twitter={{
          handle: '@wyattades',
          cardType: 'summary_large_image',
        }}
      />

      <ThemeProvider>
        {
          // render with function to prevent unmount/remount of `Layout`
          renderLayout({ children: <Component {...pageProps} /> })
        }
      </ThemeProvider>
    </>
  );
};

export default App;
