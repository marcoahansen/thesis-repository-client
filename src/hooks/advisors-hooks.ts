import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/axios";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";

export interface AdvisorsResponse {
  advisors: Advisor[];
  total: number;
  totalPages: number;
}

export interface Advisor {
  id: string;
  name: string;
  registration: string;
  email: string;
}

export const createAdvisorSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  registration: z.string().optional(),
  email: z.string().optional(),
});

export type CreateAdvisorInput = z.infer<typeof createAdvisorSchema>;

export const updateAdvisorSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().optional(),
  registration: z.string().optional(),
  email: z.string().optional(),
});

export type UpdateAdvisorInput = z.infer<typeof updateAdvisorSchema>;

export function useAdvisors({
  enableGetAdvisors = true,
  enabledGetAllAdvisors = false,
} = {}) {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const currentPage = Number(searchParams.get("page") || 1);
  const take = Number(searchParams.get("take") || 10);
  const skip = (currentPage - 1) * take;
  const search = searchParams.get("search") || "";
  const orderBy = searchParams.get("orderBy") || "name";
  const sort = searchParams.get("sort") || "asc";

  const getAdvisors = () => {
    return useQuery<AdvisorsResponse>({
      queryKey: ["advisors", currentPage, take, search, orderBy, sort],
      queryFn: async () => {
        const response = await api.get(
          `/advisors?skip=${skip}&take=${take}&search=${search}&orderBy=${orderBy}&sort=${sort}`
        );
        return response.data;
      },
      enabled: enableGetAdvisors,
    });
  };

  const getAllAdvisors = () => {
    return useQuery<Pick<Advisor, "name" | "id">[]>({
      queryKey: ["allAdvisors"],
      queryFn: async () => {
        const response = await api.get("/advisors/all");
        return response.data;
      },
      enabled: enabledGetAllAdvisors,
    });
  };

  const createAdvisor = () => {
    return useMutation({
      mutationFn: async (advisor: CreateAdvisorInput) => {
        const response = await api.post("/advisors/register", advisor);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["advisors", currentPage, take],
        });
        toast.success("Orientador criado com sucesso");
      },
      onError: (error) => {
        console.error(error);
        toast.error("Erro ao criar orientador");
      },
    });
  };

  const updateAdvisor = () => {
    return useMutation({
      mutationFn: async (advisor: UpdateAdvisorInput) => {
        await api.put(`/advisors/${advisor.id}/update`, advisor);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["advisors", currentPage, take],
        });
        toast.success("Orientador atualizado com sucesso");
      },
      onError: (error) => {
        console.error(error);
        toast.error("Erro ao atualizar orientador");
      },
    });
  };

  const deleteAdvisor = () => {
    return useMutation({
      mutationFn: async (id: string) => {
        await api.delete(`/advisors/${id}/delete`);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["advisors", currentPage, take],
        });
        toast.success("Orientador deletado com sucesso");
      },
      onError: (error) => {
        console.error(error);
        toast.error("Erro ao deletar orientador");
      },
    });
  };

  const getTopAdvisors = () => {
    return useQuery({
      queryKey: ["topAdvisors"],
      queryFn: async () => {
        const response = await api.get("/advisors/top");
        return response.data;
      },
    });
  };

  return {
    getAdvisors,
    getAllAdvisors,
    createAdvisor,
    updateAdvisor,
    deleteAdvisor,
    getTopAdvisors,
  };
}
