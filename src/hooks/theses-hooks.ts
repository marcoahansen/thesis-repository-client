import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/axios";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Advisor } from "./advisors-hooks";
import { z } from "zod";
import { uploadThesis } from "@/helpers/upload-file";
import { useState } from "react";
import { AxiosResponse } from "axios";

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

export interface ThesisById {
  id: string;
  title: string;
  year: number;
  fileUrl: string;
  keywords: string[];
  abstract: string;
  author: Author;
}

export interface Author {
  name: string;
  registration: string;
  advisor: Pick<Advisor, "name" | "id">;
}
export interface ThesisResponse {
  title: string;
  year: number;
  fileUrl: string;
  abstract: string;
  keywords: string[];
  author_name: string;
  author_registration: string;
  advisor_id: string;
}

const MAX_FILE_SIZE = 15000000;

function checkFileType(file: File) {
  if (file?.name) {
    const fileType = file.name.split(".").pop();
    if (fileType === "pdf") return true;
  }
  return false;
}

const currentYear = new Date().getFullYear();

const validateYearRange = (year: number) => {
  return year >= 2005 && year <= currentYear;
};

const thesisBaseSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  year: z.coerce
    .number()
    .int()
    .refine((year) => year.toString().length === 4, {
      message: "O ano deve ter 4 dígitos.",
    })
    .refine(validateYearRange, {
      message: `O ano deve estar entre 2005 e ${currentYear}.`,
    }),
  abstract: z.string().min(1, "O resumo é obrigatório"),
  keywords: z.string().min(1, "As palavras-chave são obrigatórias"),
  author_name: z.string().min(1, "O nome do autor é obrigatório"),
  author_registration: z.string().min(1, "A matrícula do autor é obrigatória"),
  advisor_id: z
    .string({
      required_error: "O orientador é obrigatório",
    })
    .uuid("O orientador é obrigatório"),
});

export const createThesisSchema = thesisBaseSchema.extend({
  file: z
    .instanceof(File, {
      message: "O arquivo é obrigatório",
    })
    .refine(
      (file) => file.size < MAX_FILE_SIZE,
      "O arquivo deve ter no máximo 15MB."
    )
    .refine((file) => checkFileType(file), "O arquivo deve ser um PDF."),
});

export const updateThesisSchema = thesisBaseSchema.extend({
  id: z.string().uuid().optional(),
  file: z.instanceof(File).optional(),
});

export type CreateThesisInput = z.infer<typeof createThesisSchema>;
export type UpdateThesisInput = z.infer<typeof updateThesisSchema>;

export function useTheses() {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const currentPage = Number(searchParams.get("page") || 1);
  const take = Number(searchParams.get("take") || 10);
  const skip = (currentPage - 1) * take;
  const search = searchParams.get("search") || "";
  const orderBy = searchParams.get("orderBy") || "year";
  const sort = searchParams.get("sort") || "asc";
  const [progress, setProgress] = useState<number>(0);

  const onProgress = (percentCompleted: number) => {
    setProgress(percentCompleted);
  };

  const getTheses = () =>
    useQuery<ThesisResponse>({
      queryKey: ["theses", currentPage, take, search, orderBy, sort],
      queryFn: async () => {
        const response = await api.get(
          `/theses?skip=${skip}&take=${take}&search=${search}&orderBy=${orderBy}&sort=${sort}`
        );
        return response.data;
      },
    });

  const getThesesById = (id: string | undefined) =>
    useQuery<ThesisById>({
      queryKey: ["theses", id],
      queryFn: async () => {
        const response = await api.get(`/theses/${id}`);
        return response.data;
      },
      enabled: !!id,
    });

  // const removeSpaces = (str: string) => str.replace(/\s/g, "");

  const createThesis = () =>
    useMutation<AxiosResponse<ThesisResponse>, Error, CreateThesisInput>({
      mutationFn: async (thesis: CreateThesisInput) => {
        const keyName = await uploadThesis(thesis.file, onProgress);

        return await api.post("/theses/register", {
          title: thesis.title,
          year: thesis.year,
          fileUrl: keyName,
          abstract: thesis.abstract,
          keywords: thesis.keywords.trim().split(","),
          author_name: thesis.author_name,
          author_registration: thesis.author_registration,
          advisor_id: thesis.advisor_id,
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["theses", currentPage, take],
        });
        toast.success("trabalho cadastrada com sucesso");
      },
      onError: (error) => {
        console.error("Erro ao cadastrar trabalho:", error);
      },
      onSettled: () => {
        setProgress(0);
      },
    });

  const updateThesis = () =>
    useMutation<AxiosResponse<ThesisResponse>, Error, UpdateThesisInput>({
      mutationFn: async (thesis: UpdateThesisInput) => {
        let fileUrl = "";

        if (thesis.file) {
          fileUrl = await uploadThesis(thesis.file, onProgress);
        }

        return api.put(`/theses/${thesis.id}/update`, {
          title: thesis.title,
          year: thesis.year,
          fileUrl: fileUrl || undefined,
          abstract: thesis.abstract,
          keywords: thesis.keywords.trim().split(","),
          author_name: thesis.author_name,
          author_registration: thesis.author_registration,
          advisor_id: thesis.advisor_id,
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["theses", currentPage, take],
        });
        toast.success("trabalho atualizado com sucesso");
      },
      onError: (error) => {
        console.error("Erro ao cadastrar trabalho:", error);
      },
      onSettled: () => {
        setProgress(0);
      },
    });

  const deleteThesis = () =>
    useMutation({
      mutationFn: async (id: string) => {
        await api.delete(`/theses/${id}/delete`);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["theses", currentPage, take],
        });
        toast.success("Trabalho deletado com sucesso");
      },
      onError: (error) => {
        console.error("Erro ao deletar trabalho:", error);
        toast.error("Erro ao deletar trabalho");
      },
    });

  const getThesesByYear = () => {
    return useQuery({
      queryKey: ["thesesByYear"],
      queryFn: async () => {
        const response = await api.get(`/theses/year`);
        return response.data;
      },
    });
  };

  const getTopKeywords = () => {
    return useQuery({
      queryKey: ["topKeywords"],
      queryFn: async () => {
        const response = await api.get(`/theses/keywords`);
        return response.data;
      },
    });
  };

  return {
    getTheses,
    deleteThesis,
    createThesis,
    updateThesis,
    getThesesById,
    getThesesByYear,
    getTopKeywords,
    progress,
  };
}
