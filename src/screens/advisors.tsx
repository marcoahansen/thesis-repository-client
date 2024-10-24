import { GraduationCap, Pencil, PlusCircle, Trash } from "lucide-react";

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
import { Loading } from "@/components/loading";
import { Advisor, useAdvisors } from "@/hooks/advisors-hooks";
import { navLinks } from "./theses";
import { Pagination } from "@/components/pagination";
import { useState } from "react";
import { AdvisorFormSheet } from "@/components/advisor-form-sheet";
import { ConfirmationDialog } from "@/components/confirm-dialog";
import { EmptyResult } from "@/components/empty-result";
import { SearchBar } from "@/components/search-bar";

const orderByOptions = [
  { value: "name", label: "Nome" },
  { value: "email", label: "E-mail" },
  { value: "registration", label: "Matrícula" },
];

export function Advisors() {
  const { getAdvisors, deleteAdvisor } = useAdvisors();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingAdvisor, setEditingAdvisor] = useState<Advisor | null>(null);
  const [deletingAdvisor, setDeletingAdvisor] = useState<string>("");
  const [openDialog, setOpenDialog] = useState(false);

  const { data: advisorsResponse, isLoading } = getAdvisors();
  const { mutate: deleteAdvisorMutate } = deleteAdvisor();

  function onCloseSheet() {
    setIsSheetOpen(false);
    setEditingAdvisor(null);
  }

  function openAdvisorSheet(advisor: Advisor | null) {
    setEditingAdvisor(advisor);
    setIsSheetOpen(true);
  }

  function onDeleteAdvisor(id: string) {
    setDeletingAdvisor(id);
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
              <div className="flex items-center gap-2">
                <GraduationCap stroke="#014065" size={35} />
                <CardTitle className="text-primary">Orientadores</CardTitle>
                <div className="ml-auto flex items-center gap-2">
                  <Button
                    onClick={() => openAdvisorSheet(null)}
                    size="sm"
                    className="h-8 gap-1"
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Adicionar Orientador
                    </span>
                  </Button>
                  <AdvisorFormSheet
                    open={isSheetOpen}
                    advisor={editingAdvisor}
                    onClose={onCloseSheet}
                  />
                </div>
              </div>
              <CardDescription>
                Faça a gestão dos orientadores do sistema
              </CardDescription>
              <SearchBar
                orderByOptions={orderByOptions}
                placeholder="Procure por nome, e-mail ou matrícula"
              />
            </CardHeader>
            <CardContent>
              {advisorsResponse && advisorsResponse?.advisors.length === 0 ? (
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
                    {advisorsResponse?.advisors.map((advisor) => (
                      <TableRow key={advisor.id}>
                        <TableCell className="font-medium">
                          {advisor.name}
                        </TableCell>
                        <TableCell>{advisor.email}</TableCell>
                        <TableCell>{advisor.registration}</TableCell>
                        <TableCell className="flex">
                          <Button
                            onClick={() => openAdvisorSheet(advisor)}
                            size="icon"
                            aria-label="Editar"
                            variant="link"
                            className="h-8"
                          >
                            <Pencil />
                          </Button>
                          <Button
                            size="icon"
                            variant="link"
                            aria-label="Excluir"
                            className="h-8"
                            onClick={() => {
                              onDeleteAdvisor(advisor.id);
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
              {advisorsResponse && (
                <Pagination
                  totalPages={advisorsResponse.totalPages}
                  total={advisorsResponse.total}
                />
              )}
            </CardFooter>
          </Card>
        </main>
        <ConfirmationDialog
          open={openDialog}
          onDelete={() => deleteAdvisorMutate(deletingAdvisor)}
          setOpen={setOpenDialog}
          item="orientador"
        />
      </div>
    </div>
  );
}
