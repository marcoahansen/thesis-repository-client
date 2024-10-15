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
import {
  CreateUserInput,
  createUserSchema,
  UpdateUserInput,
  updateUserSchema,
  User,
  useUsers,
} from "@/hooks/users-hooks";
import { inputError } from "@/helpers/input-error";
import { useEffect } from "react";
import { removeEmptyFields } from "@/helpers/remove-empty-fields";

export function UserFormSheet({
  onClose,
  user,
  open,
}: {
  onClose: () => void;
  user: User | null;
  open: boolean;
}) {
  const { createUser, updateUser } = useUsers();
  const { mutate: createUserMutate } = createUser;
  const { mutate: updateUserMutate } = updateUser;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
    setValue,
    trigger,
  } = useForm<CreateUserInput | UpdateUserInput>({
    resolver: zodResolver(user ? updateUserSchema : createUserSchema),
  });

  useEffect(() => {
    if (user) {
      setValue("name", user.name);
      setValue("email", user.email);
      setValue("registration", user.registration);
      trigger();
    }
  }, [user, setValue, trigger]);

  const onSubmit = (data: CreateUserInput | UpdateUserInput) => {
    if (user) {
      const normalizedData = removeEmptyFields(data) as UpdateUserInput;
      updateUserMutate(
        { ...normalizedData, id: user.id },
        {
          onSuccess: () => {
            reset();
            onClose();
          },
        }
      );
      return;
    }
    createUserMutate(data as CreateUserInput, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      onClose();
      reset();
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            {user ? "Editar Usuário" : "Criar Novo Usuário"}
          </SheetTitle>
          <SheetDescription>
            Preencha as informações abaixo para {user ? "editar" : "adicionar"}{" "}
            um usuário ao sistema.
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
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="****"
                {...register("password")}
                className="col-span-3"
                error={inputError(errors, "password")}
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="password">Confirmação Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="****"
                {...register("confirmPassword")}
                className="col-span-3"
                error={inputError(errors, "confirmPassword")}
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
              {isSubmitting ? "Salvando..." : "Salvar Usuário"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
