import { GetStaticProps } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { trpc } from "~/utils/trpc";

export default function IndexPage() {
  const { t } = useTranslation("common");
  const { data: session } = useSession();
  const { data } = trpc.useQuery(["ping"]);

  return (
    <div>
      {session ? (
        <div>
          <p>signed in as {session.user?.email}</p>
          <button onClick={() => signOut()}>sign out</button>
        </div>
      ) : (
        <div>
          <p>not signed in</p>
          <button onClick={() => signIn()}>sign in</button>
        </div>
      )}

      <span>
        {t("hello-world")}; ping {data?.pong}
      </span>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale, defaultLocale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? defaultLocale!, ["common"])),
    },
  };
};

/**
 * If you want to statically render this page
 * - Export `appRouter` & `createContext` from [trpc].ts
 * - Make the `opts` object optional on `createContext()`
 *
 * @link https://trpc.io/docs/ssg
 */
// export const getStaticProps = async (
//   context: GetStaticPropsContext<{ filter: string }>,
// ) => {
//   const ssg = createSSGHelpers({
//     router: appRouter,
//     ctx: await createContext(),
//   });
//
//   await ssg.fetchQuery('post.all');
//
//   return {
//     props: {
//       trpcState: ssg.dehydrate(),
//       filter: context.params?.filter ?? 'all',
//     },
//     revalidate: 1,
//   };
// };
