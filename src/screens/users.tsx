import { Pencil, PlusCircle, Trash } from "lucide-react";

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
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Aside } from "@/components/aside";
import { MobileAside } from "@/components/mobile-aside";
import { User, useUserActions } from "@/hooks/users-hooks";
import { Loading } from "@/components/loading";
import { navLinks } from "./theses";
import { Pagination } from "@/components/pagination";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { CreateUserFormSheet } from "@/components/create-user-form-sheet";
import { useState } from "react";

export function Users() {
  const { getUsers } = useUserActions();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const { data: usersResponse, isLoading } = getUsers;

  function onCloseSheet() {
    setIsSheetOpen(false);
  }

  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 mt-3">
      <Aside links={navLinks} />
      <MobileAside links={navLinks} />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            <div className="flex items-center">
              <div className="ml-auto flex items-center gap-2">
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                  <SheetTrigger asChild>
                    <Button size="sm" className="h-8 gap-1">
                      <PlusCircle className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Adicionar Usuário
                      </span>
                    </Button>
                  </SheetTrigger>
                  <CreateUserFormSheet onClose={onCloseSheet} />
                </Sheet>
              </div>
            </div>
            <TabsContent value="all">
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle>Usuários</CardTitle>
                  <CardDescription>
                    Faça a gestão dos usuários do sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
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
                              // onClick={() => openUserSheet(user)}
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
                                console.log("delete", user.id);
                              }}
                            >
                              <Trash color="red" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      ;
                    </TableBody>
                  </Table>
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
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
