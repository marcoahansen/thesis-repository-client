import { Pencil, PlusCircle, Trash, Users2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Aside } from "@/components/aside";
import { MobileAside } from "@/components/mobile-aside";
import { User, useUsers } from "@/hooks/users-hooks";
import { Loading } from "@/components/loading";
import { navLinks } from "./theses";
import { Pagination } from "@/components/pagination";
import { UserFormSheet } from "@/components/user-form-sheet";
import { useState } from "react";
import { ConfirmationDialog } from "@/components/confirm-dialog";
import { SearchBar } from "@/components/search-bar";
import { EmptyResult } from "@/components/empty-result";

const orderByOptions = [
  { value: "name", label: "Nome" },
  { value: "email", label: "E-mail" },
  { value: "registration", label: "Matrícula" },
];

export function Users() {
  const { getUsers, deleteUser } = useUsers();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<string>("");
  const [openDialog, setOpenDialog] = useState(false);

  const { data: usersResponse, isLoading } = getUsers;
  const { mutate: deleteUserMutate } = deleteUser;

  function onCloseSheet() {
    setIsSheetOpen(false);
    setEditingUser(null);
  }

  function openUserSheet(user: User | null) {
    setEditingUser(user);
    setIsSheetOpen(true);
  }

  function onDeleteUser(id: string) {
    setDeletingUser(id);
    setOpenDialog(true);
  }

  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 mt-3">
      <Aside links={navLinks} />
      <MobileAside links={navLinks} />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-5">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <div className="flex gap-2 items-center">
                <Users2 stroke="#014065" size={32} />
                <CardTitle className="text-primary">Usuários</CardTitle>
                <div className="ml-auto flex items-center gap-2">
                  <Button
                    onClick={() => openUserSheet(null)}
                    size="sm"
                    className="h-8 gap-1"
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Adicionar Usuário
                    </span>
                  </Button>
                  <UserFormSheet
                    open={isSheetOpen}
                    user={editingUser}
                    onClose={onCloseSheet}
                  />
                </div>
              </div>
              <CardDescription>
                Faça a gestão dos usuários do sistema
              </CardDescription>
              <SearchBar
                orderByOptions={orderByOptions}
                placeholder="Procure por nome, e-mail ou matrícula"
              />
            </CardHeader>
            <CardContent>
              {usersResponse && usersResponse.users.length === 0 ? (
                <EmptyResult />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>E-mail</TableHead>
                      <TableHead>Matrícula</TableHead>
                      <TableHead>
                        <span className="sr-only">Ações</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usersResponse?.users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.name}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.registration}</TableCell>
                        <TableCell>
                          <Button
                            onClick={() => openUserSheet(user)}
                            size="icon"
                            variant="link"
                            className="h-8"
                          >
                            <Pencil />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8"
                            onClick={() => {
                              onDeleteUser(user.id);
                            }}
                          >
                            <Trash color="red" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
            <CardFooter>
              {usersResponse && (
                <Pagination
                  totalPages={usersResponse.totalPages}
                  total={usersResponse.total}
                />
              )}
            </CardFooter>
          </Card>
        </main>
      </div>
      <ConfirmationDialog
        open={openDialog}
        onDelete={() => deleteUserMutate(deletingUser)}
        setOpen={setOpenDialog}
        item="usuário"
      />
    </div>
  );
}
