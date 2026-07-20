// hooks/useLogin.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../actions/api";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    }
  });
}
