import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCurrentUser,
  login,
  registerUser,
  forgotPassword,
  resetPassword
} from "../actions/api"; // Adjust relative path to your api.ts

// 1. Fetch Current User (Query)
export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    staleTime: 1000 * 60 * 60,
    retry: false // Don't retry endlessly if the user isn't authenticated
  });
}

// 2. Login (Mutation)
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: () => {
      // Invalidate currentUser query so TanStack Query automatically refetches
      // the new user's profile immediately after login succeeds
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    }
  });
}

// 3. Register (Mutation)
export function useRegister() {
  return useMutation({
    mutationFn: (userData: any) => registerUser(userData)
  });
}

// 4. Forgot Password (Mutation)
export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => forgotPassword(email)
  });
}

// 5. Reset Password (Mutation)
export function useResetPassword() {
  return useMutation({
    mutationFn: ({
      token,
      newPassword
    }: {
      token: string;
      newPassword: string;
    }) => resetPassword(token, newPassword)
  });
}
