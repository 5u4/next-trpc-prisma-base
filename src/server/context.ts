import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { getSession } from "next-auth/react";
import { prisma } from "~/prisma/client";

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export const createContext = async ({ req, res }: trpcNext.CreateNextContextOptions) => {
  const session = await getSession({ req });
  return { req, res, prisma, session };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
