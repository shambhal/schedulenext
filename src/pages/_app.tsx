import "@/styles/globals.scss";
//import "../styles/globals.css";
import 'flowbite'
import type { AppProps,AppContext } from "next/app";
import Layout from "@/_components/layout";
import { fetchCategories } from "@/utils/categories";
export default function App({ Component, pageProps,categories }: AppProps) {
  return    <Layout categories={categories}>
      <Component {...pageProps} />
    </Layout>
}
App.getInitialProps = async (appContext: AppContext) => {
  const { Component, ctx } = appContext;

  const categories = await fetchCategories();

  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  return { pageProps, categories };
};
