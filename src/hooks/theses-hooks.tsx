import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/axios";
import { useSearchParams } from "react-router-dom";

export interface ThesisResponse {
  thesis: Thesis[];
  total: number;
  totalPages: number;
}

export interface Thesis {
  id: string;
  title: string;
  year: number;
  author: Author;
}

export interface Author {
  name: string;
  advisor: Advisor;
}

export interface Advisor {
  name: string;
}

export function useTheses() {
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page") || 1);
  const take = Number(searchParams.get("take") || 10);
  const skip = (currentPage - 1) * take;

  return useQuery<ThesisResponse>({
    queryKey: ["theses", currentPage, take],
    queryFn: async () => {
      const response = await api.get(`/theses?skip=${skip}&take=${take}`);
      return response.data;
    },
  });
}

export function useDeleteThesis() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/theses/${id}/delete`);
    },
    onSuccess: (_, thesisId) => {
      const currentPage = Number(searchParams.get("page") || 1);
      const take = Number(searchParams.get("take") || 10);

      queryClient.setQueryData<ThesisResponse>(
        ["theses", currentPage, take],
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            thesis: oldData.thesis.filter((thesis) => thesis.id !== thesisId),
          };
        }
      );
    },
    onError: (error) => {
      console.error("Erro ao deletar tese:", error);
    },
  });
}
