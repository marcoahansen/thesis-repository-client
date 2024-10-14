import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { inputError } from "@/helpers/input-error";
import { useEffect } from "react";
import { removeEmptyFields } from "@/helpers/remove-empty-fields";
import {
  CreateThesisInput,
  createThesisSchema,
  Thesis,
  UpdateThesisInput,
  updateThesisSchema,
  useTheses,
} from "@/hooks/theses-hooks";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Advisor, useAdvisors } from "@/hooks/advisors-hooks";
import { Textarea } from "../ui/textarea";
import { Dropzone, HasFile } from "../dropzone";
import { Separator } from "../ui/separator";
import { Link } from "react-router-dom";

export function ThesisFormSheet({
  onClose,
  thesis,
}: {
  onClose: () => void;
  thesis: Thesis | null;
}) {
  const { createThesis, updateThesis, getThesesById } = useTheses();
  const { getAllAdvisors } = useAdvisors({
    enableGetAdvisors: false,
    enabledGetAllAdvisors: true,
  });
  const { mutate: createThesisMutate } = createThesis();
  const { mutate: updateThesisMutate } = updateThesis();
  const { data: advisors, isLoading: isLoadingAdvisors } = getAllAdvisors;

  const { data: thesisById, isLoading: isLoadingThesisById } = getThesesById(
    thesis?.id
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
    setValue,
    control,
  } = useForm<CreateThesisInput | UpdateThesisInput>({
    resolver: zodResolver(thesis ? updateThesisSchema : createThesisSchema),
  });

  useEffect(() => {
    if (thesis) {
      if (thesisById && !isLoadingThesisById) {
        setValue("title", thesisById.title);
        setValue("year", thesisById.year);
        setValue("abstract", thesisById.abstract);
        setValue("keywords", thesisById.keywords.join(", "));
        setValue("author_name", thesisById.author.name);
        setValue("author_registration", thesisById.author.registration);
        setValue("advisor_id", thesisById.author.advisor.id);
      }
    }
  }, [thesis, getThesesById, setValue]);

  const onSubmit = (data: CreateThesisInput | UpdateThesisInput) => {
    if (thesis) {
      const normalizedData = removeEmptyFields(data) as UpdateThesisInput;
      updateThesisMutate(
        { ...normalizedData, id: thesis.id },
        {
          onSuccess: () => {
            reset();
            onClose();
          },
        }
      );
    }
    createThesisMutate(data as CreateThesisInput, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  return (
    <SheetContent className="min-w-[60rem]">
      <SheetHeader>
        <SheetTitle>
          {thesis ? "Editar Trabalho" : "Criar Novo Trabalho"}
        </SheetTitle>
        <SheetDescription>
          Preencha as informações abaixo para {thesis ? "editar" : "adicionar"}{" "}
          um trabalho ao sistema.
        </SheetDescription>
      </SheetHeader>

      <form
        className="grid grid-cols-2 gap-4 py-3 h-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="col-span-1 flex flex-col gap-2">
          <div>
            <Label htmlFor="title">Título do Trabalho</Label>
            <Input
              placeholder="Digite o título"
              {...register("title")}
              error={inputError(errors, "title")}
            />
          </div>

          <div>
            <Label htmlFor="year">Ano</Label>
            <Input
              type="number"
              placeholder="Digite o ano"
              {...register("year", { required: true })}
              error={inputError(errors, "year")}
            />
          </div>

          <div>
            <Label htmlFor="author_name">Nome do Autor</Label>
            <Input
              placeholder="Digite o nome do autor"
              {...register("author_name")}
              error={inputError(errors, "author_name")}
            />
          </div>
          <div>
            <Label htmlFor="author_registration">Matrícula do Autor</Label>
            <Input
              placeholder="Digite o nome do autor"
              {...register("author_registration")}
              error={inputError(errors, "author_registration")}
            />
          </div>
          <div>
            <Controller
              name="file"
              control={control}
              render={({ field }) => (
                <>
                  <Label htmlFor="file">Arquivo</Label>
                  {field.value ? (
                    <HasFile
                      file={field.value}
                      removeFile={() => field.onChange(null)}
                    />
                  ) : (
                    <Dropzone
                      onChange={(e) => {
                        if (e.target.files) {
                          field.onChange(e.target.files[0]);
                        }
                      }}
                    />
                  )}
                  {errors.file && (
                    <span className="text-red-600 text-xs">
                      {String(errors.file.message)}
                    </span>
                  )}
                </>
              )}
            />
          </div>
        </div>
        <div className="flex col-span-1">
          <Separator className="h-auto mr-4" orientation="vertical" />
          <div className="flex flex-col gap-3 w-full">
            <div>
              <Controller
                name="advisor_id"
                control={control}
                render={({ field }) => (
                  <>
                    <Label htmlFor="advisor_id">Orientador</Label>
                    <p className="text-xs my-1">
                      Se o orientador não estiver na lista, cadastre-o na aba{" "}
                      <Link
                        className="text-blue-700 cursor-pointer hover:underline"
                        to={"advisors"}
                        target="_blank"
                      >
                        orientadores
                      </Link>
                    </p>
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      value={field.value || ""}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            isLoadingAdvisors
                              ? "Carregando orientadores..."
                              : "Selecione um orientador"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {advisors?.map(
                          (advisor: Pick<Advisor, "name" | "id">) => (
                            <SelectItem key={advisor.id} value={advisor.id}>
                              {advisor.name}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </>
                )}
              />
              {errors.advisor_id && (
                <span className="text-red-600 text-xs">
                  {errors.advisor_id.message}
                </span>
              )}
            </div>
            <div>
              <Label htmlFor="abstract">Resumo</Label>
              <Textarea
                className="h-40"
                placeholder="Digite o resumo"
                {...register("abstract")}
                error={inputError(errors, "abstract")}
              />
            </div>

            <div>
              <Label htmlFor="keywords">Palavras-chave</Label>
              <Input
                placeholder="Digite as palavras-chave separadas por vírgula"
                {...register("keywords")}
                error={inputError(errors, "keywords")}
              />
            </div>
          </div>
        </div>

        <SheetFooter className="col-span-2 flex justify-end gap-4 mt-4">
          <Button
            variant="outline"
            type="reset"
            onClick={() => {
              onClose();
              reset();
            }}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            className="grid col-span-2"
            type="submit"
            disabled={isSubmitting || !isDirty}
          >
            {isSubmitting ? "Salvando..." : "Salvar trabalho"}
          </Button>
        </SheetFooter>
      </form>
    </SheetContent>
  );
}
