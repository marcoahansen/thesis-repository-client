import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/axios";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";

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

export const createUserSchema = z
  .object({
    email: z
      .string({
        required_error: "Email é obrigatório",
        invalid_type_error: "Email deve ser uma string",
      })
      .email("Email inválido"),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
    confirmPassword: z
      .string()
      .min(6, "A senha deve ter no mínimo 6 caracteres"),
    registration: z.string().min(1, "A matrícula é obrigatória"),
    name: z.string().min(1, "O nome é obrigatório"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export const updateUserSchema = z
  .object({
    id: z.string().uuid().optional(),
    email: z.string().optional(),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
    registration: z.string().optional(),
    name: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export function useUsers() {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const currentPage = Number(searchParams.get("page") || 1);
  const take = Number(searchParams.get("take") || 10);
  const skip = (currentPage - 1) * take;
  const search = searchParams.get("search") || "";
  const orderBy = searchParams.get("orderBy") || "name";
  const sort = searchParams.get("sort") || "asc";

  const getUsers = useQuery<UsersResponse>({
    queryKey: ["users", currentPage, take, search, orderBy, sort],
    queryFn: async () => {
      const response = await api.get(
        `/users?skip=${skip}&take=${take}&search=${search}&orderBy=${orderBy}&sort=${sort}`
      );
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
    mutationFn: async (user: UpdateUserInput) => {
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
      toast.success("Usuário deletado com sucesso");
    },
    onError: (error) => {
      console.error("Erro ao deletar usuário:", error);
    },
  });

  return { getUsers, createUser, deleteUser, updateUser };
}
