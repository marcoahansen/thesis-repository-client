import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { useEffect } from "react";
import {
  Advisor,
  CreateAdvisorInput,
  createAdvisorSchema,
  UpdateAdvisorInput,
  updateAdvisorSchema,
  useAdvisors,
} from "@/hooks/advisors-hooks";
import { removeEmptyFields } from "@/helpers/remove-empty-fields";

export function AdvisorFormSheet({
  open,
  onClose,
  advisor,
}: {
  onClose: () => void;
  advisor: Advisor | null;
  open: boolean;
}) {
  const { createAdvisor, updateAdvisor } = useAdvisors();
  const { mutate: createAdvisorMutate } = createAdvisor();
  const { mutate: updateAdvisorMutate } = updateAdvisor();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
    setValue,
    trigger,
  } = useForm<CreateAdvisorInput | UpdateAdvisorInput>({
    resolver: zodResolver(advisor ? updateAdvisorSchema : createAdvisorSchema),
  });

  useEffect(() => {
    if (advisor) {
      setValue("name", advisor.name);
      setValue("email", advisor.email);
      setValue("registration", advisor.registration);
      trigger();
    }
  }, [advisor, setValue, trigger]);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      onClose();
      reset();
    }
  };

  const onSubmit = (data: CreateAdvisorInput | UpdateAdvisorInput) => {
    if (advisor) {
      const normalizedData = removeEmptyFields(data) as UpdateAdvisorInput;
      updateAdvisorMutate(
        { ...normalizedData, id: advisor.id },
        {
          onSuccess: () => {
            onClose();
            reset();
          },
        }
      );
      return;
    }
    createAdvisorMutate(data as CreateAdvisorInput, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            {advisor ? "Editar Orientador" : "Criar Novo Orientador"}
          </SheetTitle>
          <SheetDescription>
            Preencha as informações abaixo para{" "}
            {advisor ? "editar" : "adicionar"} um orientador ao sistema.
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-4 py-4 h-full"
        >
          <div>
            <div className="grid gap-1">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Nome do usuário"
                error={inputError(errors, "name")}
                className="col-span-3"
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="email">Email</Label>
              <Input
                error={inputError(errors, "email")}
                id="email"
                placeholder="email@email.com"
                {...register("email")}
                className="col-span-3"
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="registration">Matrícula</Label>
              <Input
                id="registration"
                {...register("registration")}
                placeholder="Matrícula do usuário"
                className="col-span-3"
                error={inputError(errors, "registration")}
              />
            </div>
          </div>

          <SheetFooter className="grid grid-cols-3 items-center gap-1">
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
              {isSubmitting ? "Salvando..." : "Salvar Orientador"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
