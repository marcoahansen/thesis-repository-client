import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { inputError } from "@/helpers/input-error";
import { useEffect, useState } from "react";
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
import { Progress } from "../ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  FileSymlink,
  FileText,
  Loader2,
  RotateCcwIcon,
  Trash,
} from "lucide-react";
import { ConfirmationDialog } from "../confirm-dialog";

const BUCKET_URL = import.meta.env.VITE_BUCKET_URL;

export function ThesisFormSheet({
  onClose,
  thesis,
  open,
}: {
  onClose: () => void;
  thesis: Thesis | null;
  open: boolean;
}) {
  const { createThesis, updateThesis, getThesesById, progress, deleteFile } =
    useTheses();
  const { getAllAdvisors } = useAdvisors({
    enableGetAdvisors: false,
    enabledGetAllAdvisors: true,
  });
  const { mutate: createThesisMutate, isPending: isCreating } = createThesis();
  const { mutate: updateThesisMutate, isPending: isUpdating } = updateThesis();
  const { mutate: deleteFileMutate, isPending: isDeletingFile } = deleteFile();
  const {
    data: advisors,
    isLoading: isLoadingAdvisors,
    refetch: refetchAdvisors,
  } = getAllAdvisors();

  const [openDialog, setOpenDialog] = useState(false);
  const [deletingFile, setDeletingFile] = useState<string>("");

  function onDeleteFile(fileKey: string) {
    setDeletingFile(fileKey);
    setOpenDialog(true);
  }

  const { data: thesisById, isLoading: isLoadingThesisById } = getThesesById(
    thesis?.id
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setValue,
    control,
    watch,
    trigger,
  } = useForm<CreateThesisInput | UpdateThesisInput>({
    resolver: zodResolver(thesis ? updateThesisSchema : createThesisSchema),
    defaultValues: {
      fileKey: undefined,
    },
  });

  const fileKey = watch("fileKey");

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
        setValue("fileKey", thesisById.fileUrl);
      }
    }
  }, [thesis, thesisById, isLoadingThesisById, setValue]);

  const onSubmit = async (data: CreateThesisInput | UpdateThesisInput) => {
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
    } else {
      createThesisMutate(data as CreateThesisInput, {
        onSuccess: () => {
          reset();
          onClose();
        },
      });
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      onClose();
      reset();
    }
  };

  const disabled = isCreating || isUpdating;

  const renderFileField = () => (
    <div>
      <Controller
        name="file"
        control={control}
        rules={{
          validate: (value) => {
            if (!fileKey && !value) {
              return "É necessário fazer upload de um novo arquivo";
            }
            return true;
          },
        }}
        render={({ field }) => (
          <>
            <Label htmlFor="file">Arquivo</Label>
            {thesisById && fileKey ? (
              <div className="flex items-center space-x-4 rounded-md border p-4">
                <FileText stroke="#014065" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm leading-none">
                    {thesisById.fileUrl.slice(16)}
                  </p>
                </div>
                <div>
                  <Button
                    size="icon"
                    variant="link"
                    type="button"
                    className="h-8"
                    aria-label="Ver arquivo"
                    asChild
                  >
                    <a
                      href={`${BUCKET_URL}${thesisById.fileUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FileSymlink />
                    </a>
                  </Button>
                  <Button
                    size="icon"
                    variant="link"
                    type="button"
                    className="h-8"
                    aria-label="Excluir"
                    onClick={() => {
                      onDeleteFile(thesisById.fileUrl);
                    }}
                  >
                    {isDeletingFile ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <Trash color="red" />
                    )}
                  </Button>
                </div>
              </div>
            ) : field.value ? (
              <HasFile
                file={field.value}
                removeFile={() => {
                  field.onChange(null);
                  setValue("file", undefined, { shouldValidate: true });
                }}
              />
            ) : (
              <Dropzone
                onChange={(e) => {
                  if (e.target.files) {
                    field.onChange(e.target.files[0]);
                    setValue("file", e.target.files[0], {
                      shouldValidate: true,
                    });
                  }
                }}
              />
            )}
            {errors.file && (
              <span className="text-red-600 text-xs">
                {String(errors.file.message)}
              </span>
            )}
            {progress > 0 && (
              <div className="flex-col items-center justify-between mt-6">
                <span className="text-sm text-gray-500">
                  Fazendo upload do arquivo...
                </span>
                <Progress className="mt-2" value={progress} max={100} />
              </div>
            )}
          </>
        )}
      />
    </div>
  );

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="min-w-[60rem]">
        <SheetHeader>
          <SheetTitle>
            {thesis ? "Editar Trabalho" : "Criar Novo Trabalho"}
          </SheetTitle>
          <SheetDescription>
            Preencha as informações abaixo para{" "}
            {thesis ? "editar" : "adicionar"} um trabalho ao sistema.
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
                min={2005}
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
            {renderFileField()}
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
                      <div className="flex items-center justify-between">
                        <p className="text-xs my-1">
                          Se o orientador não estiver na lista, cadastre-o na
                          aba{" "}
                          <Link
                            className="text-blue-700 cursor-pointer hover:underline"
                            to={"advisors"}
                            target="_blank"
                          >
                            orientadores
                          </Link>
                        </p>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="link"
                                size="icon"
                                onClick={() => refetchAdvisors()}
                              >
                                <RotateCcwIcon className="w-4 h-4 hover:to-blue-500" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              Recarregar orientadores
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>

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
                  className="h-40 textarea-no-break"
                  placeholder="Digite o resumo"
                  {...register("abstract", {
                    onChange: (e) =>
                      setValue("abstract", e.target.value, {
                        shouldValidate: true,
                      }),
                  })}
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
              disabled={disabled}
            >
              Cancelar
            </Button>
            <Button
              className="grid col-span-2"
              type="submit"
              disabled={disabled || !isDirty}
            >
              {disabled ? "Salvando..." : "Salvar trabalho"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
      <ConfirmationDialog
        open={openDialog}
        onDelete={() =>
          deleteFileMutate(deletingFile, {
            onSuccess: () => {
              setValue("fileKey", undefined);
              trigger("file");
            },
          })
        }
        setOpen={setOpenDialog}
        item="arquivo"
      />
    </Sheet>
  );
}
