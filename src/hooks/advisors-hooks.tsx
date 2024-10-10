import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";
import { useSearchParams } from "react-router-dom";

export interface AdvisorsResponse {
  advisors: Advisor[];
  total: number;
  totalPages: number;
}

export interface Advisor {
  id: string;
  name: string;
  registration: string;
}

export function useAdvisors() {
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page") || 1);
  const take = Number(searchParams.get("take") || 10);
  const skip = (currentPage - 1) * take;

  return useQuery<AdvisorsResponse>({
    queryKey: ["advisors", currentPage, take],
    queryFn: async () => {
      const response = await api.get(`/advisors?skip=${skip}&take=${take}`);
      return response.data;
    },
  });
}
