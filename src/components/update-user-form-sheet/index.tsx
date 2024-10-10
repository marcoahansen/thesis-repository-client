import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import {
  UpdateUserInput,
  updateUserSchema,
  User,
  useUserActions,
} from "@/hooks/users-hooks";
import { inputError } from "@/helpers/input-error";

export function UpdateUserFormSheet({
  onClose,
  user,
}: {
  onClose: () => void;
  user: User;
}) {
  const { updateUser } = useUserActions();

  const { mutate: updateUserMutate } = updateUser;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user.name,
      // password: undefined,
      email: user.email,
      registration: user?.registration,
    },
  });

  const onSubmit = (data: UpdateUserInput) => {
    updateUserMutate(
      { ...data, id: user.id },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
      }
    );
  };

  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Atualizar Usuário</SheetTitle>
        <SheetDescription>
          Preencha as informações abaixo para atualizar o usuário.
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
            type="button"
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
  );
}
