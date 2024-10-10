import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  CreateUserInput,
  createUserSchema,
  useUserActions,
} from "@/hooks/users-hooks";
import { inputError } from "@/helpers/input-error";
import { X } from "lucide-react";

export function CreateUserFormSheet({ onClose }: { onClose: () => void }) {
  const { createUser } = useUserActions();

  const { mutate: createUserMutate } = createUser;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
  });

  const onSubmit = (data: CreateUserInput) => {
    createUserMutate(data, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  return (
    <SheetContent>
      <SheetClose
        onClick={() => {
          onClose();
          reset();
        }}
        className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </SheetClose>
      <SheetHeader>
        <SheetTitle>Criar Novo Usuário</SheetTitle>
        <SheetDescription>
          Preencha as informações abaixo para adicionar um novo usuário ao
          sistema.
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
