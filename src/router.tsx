import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export interface RouterContext {
  queryClient: QueryClient;
  auth: {
    user: any | null;
    isAuthenticated: boolean;
  };
}

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: {
      queryClient,
      auth: { user: null, isAuthenticated: false } // Initial state, will be updated in __root
    },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
