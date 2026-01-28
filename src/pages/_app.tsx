import "@/styles/globals.scss";
import ChatWidget from "@/_components/chatwidget";

import { Toaster } from 'sonner';
import type { AppProps, AppContext } from "next/app";
import { CartProvider } from "@/context/CartContext";
import { CheckoutProvider } from "@/context/CheckoutContext";
import Layout from "@/_components/layout";
import { fetchCategories } from "@/utils/categories";
import { appWithTranslation } from 'next-i18next';

function App({ Component, pageProps }: AppProps) {
  const { categories = [] } = pageProps; // categories is now in pageProps

  return (
    <CartProvider>
      <CheckoutProvider>
        <Layout categories={categories}>
          <Toaster richColors position="top-right" />
          <Component {...pageProps} />
          
        </Layout>
      </CheckoutProvider>
    </CartProvider>
  );
}

App.getInitialProps = async (appContext: AppContext) => {
  const { Component, ctx } = appContext;

  // Fetch categories from your API
  const categories = await fetchCategories();

  // Get current locale (default to 'en')
  const locale = ctx.locale || 'en';

  // Dynamically import serverSideTranslations to avoid fs bundling issues
 // const { serverSideTranslations } = await import('next-i18next/serverSideTranslations');

  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  return {
    pageProps: {
      ...pageProps,
      categories,
       // load translations
    },
  };
};

export default appWithTranslation(App);
