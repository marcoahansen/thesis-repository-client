import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/axios";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";

// Define User interfaces and validation schema
export interface User {
  id: string;
  name: string;
  email: string;
  registration: string;
}

export interface UsersResponse {
  users: User[];
  total: number;
  totalPages: number;
}

export const createUserSchema = z.object({
  email: z
    .string({
      required_error: "Email é obrigatório",
      invalid_type_error: "Email deve ser uma string",
    })
    .email("Email inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  registration: z.string().min(1, "A matrícula é obrigatória"),
  name: z.string().min(1, "O nome é obrigatório"),
});
export const updateUserSchema = z.object({
  id: z.string().uuid(),
  email: z
    .string({
      required_error: "Email é obrigatório",
      invalid_type_error: "Email deve ser uma string",
    })
    .email("Email inválido"),
  password: z.string().optional(),
  registration: z.string().min(1, "A matrícula é obrigatória"),
  name: z.string().min(1, "O nome é obrigatório"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export function useUserActions() {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const currentPage = Number(searchParams.get("page") || 1);
  const take = Number(searchParams.get("take") || 10);
  const skip = (currentPage - 1) * take;

  const getUsers = useQuery<UsersResponse>({
    queryKey: ["users", currentPage, take],
    queryFn: async () => {
      const response = await api.get(`/users?skip=${skip}&take=${take}`);
      return response.data;
    },
  });

  const createUser = useMutation({
    mutationFn: async (newUser: CreateUserInput) => {
      const response = await api.post("/users/register", newUser);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", currentPage, take] });
      toast.success("Usuário criado com sucesso");
    },
    onError: (error) => {
      console.error("Erro ao criar usuário:", error);
      toast.error("Erro ao criar usuário");
    },
  });

  const updateUser = useMutation({
    mutationFn: async (user: User) => {
      await api.put(`/users/${user.id}/update`, user);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", currentPage, take] });
      toast.success("Usuário atualizado com sucesso");
    },
    onError: (error) => {
      console.error("Erro ao atualizar usuário:", error);
      toast.error("Erro ao atualizar usuário");
    },
  });

  const deleteUser = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/users/${id}/delete`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", currentPage, take] });
    },
    onError: (error) => {
      console.error("Erro ao deletar usuário:", error);
    },
  });

  return { getUsers, createUser, deleteUser, updateUser };
}
