import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../actions/api";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"], // Unique key to identify this query in cache
    queryFn: getCurrentUser, // Calls your existing function from api.ts!
    retry: false
  });
}
