"use client";

import { createTRPCReact } from "@trpc/react-query";

import type { AppRouter } from "@aniways/trpc";

export const api = createTRPCReact<AppRouter>();
