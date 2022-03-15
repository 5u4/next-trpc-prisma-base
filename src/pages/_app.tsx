import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import { loggerLink } from "@trpc/client/links/loggerLink";
import { withTRPC } from "@trpc/next";
import { getSession, SessionProvider } from "next-auth/react";
import { appWithTranslation } from "next-i18next";
import { AppType } from "next/dist/shared/lib/utils";
import Head from "next/head";
import superjson from "superjson";
import type { AppRouter } from "~/server/routers/_app";
import { getBaseUrl } from "~/utils/get-base-url";

const App: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#000000" />
      </Head>

      <SessionProvider session={pageProps.session}>
        <Component {...pageProps} />
      </SessionProvider>
    </>
  );
};

App.getInitialProps = async ({ ctx }) => {
  return {
    pageProps: {
      session: await getSession(ctx),
    },
  };
};

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */

    return {
      /**
       * @link https://trpc.io/docs/links
       */
      links: [
        // adds pretty logs to your console in development and logs errors in production
        loggerLink({
          enabled: opts =>
            (process.env.NODE_ENV === "development" && process.browser) ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({ url: `${getBaseUrl()}/api/trpc` }),
      ],

      /**
       * @link https://trpc.io/docs/data-transformers
       */
      transformer: superjson,

      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },

      headers: () => {
        if (ctx?.req) {
          // on ssr, forward client's headers to the server
          return {
            ...ctx.req.headers,
            "x-ssr": "1",
          };
        }
        return {};
      },
    };
  },

  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: true,
})(appWithTranslation(App as any));
