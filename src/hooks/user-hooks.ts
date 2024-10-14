import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";

export interface User {
  id: string;
  name: string;
  registration: string;
  email: string;
}

export function useUserHook() {
  const login = () =>
    useMutation({
      mutationFn: async (data: { email: string; password: string }) => {
        const response = await api.post("/users/login", data);
        return response.data;
      },
    });

  const logout = () =>
    useMutation({
      mutationFn: async () => {
        await api.delete("/users/logout");
      },
    });

  const me = () =>
    useQuery<User>({
      queryKey: ["user"],
      queryFn: async () => {
        const response = await api.get("/users/me");
        return response.data;
      },
      retry: 1,
    });

  return { login, logout, me };
}
