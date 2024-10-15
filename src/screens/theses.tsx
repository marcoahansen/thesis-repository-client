import {
  BookOpenCheck,
  Pencil,
  PlusCircle,
  SquareUserRound,
  Trash,
  Users2,
} from "lucide-react";
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
import { Thesis, useTheses } from "@/hooks/theses-hooks";
import { Pagination } from "@/components/pagination";
import { ConfirmationDialog } from "@/components/confirm-dialog";
import { useState } from "react";
import { ThesisFormSheet } from "@/components/thesis-form-sheet";
import { SearchBar } from "@/components/search-bar";
import { EmptyResult } from "@/components/empty-result";

export const navLinks = [
  { icon: <BookOpenCheck />, label: "Trabalhos", to: "/admin" },
  { icon: <SquareUserRound />, label: "Orientadores", to: "/admin/advisors" },
  { icon: <Users2 />, label: "Usuários", to: "/admin/users" },
];

const orderByOptions = [
  { value: "year", label: "Ano" },
  { value: "title", label: "Título" },
  { value: "author", label: "Autor" },
  { value: "advisor", label: "Orientador" },
];

export function Theses() {
  const { getTheses, deleteThesis } = useTheses();
  const { data: thesesResponse, isLoading } = getTheses();
  const { mutate: deleteThesisMutate } = deleteThesis();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingThesis, setEditingThesis] = useState<Thesis | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deletingThesis, setDeletingThesis] = useState<string>("");

  function onDeleteThesis(id: string) {
    setDeletingThesis(id);
    setOpenDialog(true);
  }

  function onCloseSheet() {
    setIsSheetOpen(false);
    setEditingThesis(null);
  }

  function openThesisSheet(thesis: Thesis | null) {
    setEditingThesis(thesis);
    setIsSheetOpen(true);
  }

  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 mt-3">
      <Aside links={navLinks} />
      <MobileAside links={navLinks} />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-1 p-4 sm:px-6 sm:py-0 md:gap-5">
          <div className="flex items-center">
            <div className="ml-auto flex items-center gap-2">
              <Button
                onClick={() => openThesisSheet(null)}
                size="sm"
                className="h-8 gap-1"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Novo Trabalho
                </span>
              </Button>
              <ThesisFormSheet
                open={isSheetOpen}
                thesis={editingThesis}
                onClose={onCloseSheet}
              />
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Trabalhos de Conclusão</CardTitle>
              <CardDescription>
                Faça a gestão dos trabalhos do sistema
              </CardDescription>
              <SearchBar
                orderByOptions={orderByOptions}
                placeholder="Procure por título, ano, autor, orientador ou palavra-chave"
              />
            </CardHeader>
            <CardContent>
              {thesesResponse && thesesResponse?.thesis.length === 0 ? (
                <EmptyResult />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Ano</TableHead>
                      <TableHead>Autor</TableHead>
                      <TableHead>Orientador</TableHead>
                      <TableHead>
                        <span className="sr-only">Ações</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {thesesResponse?.thesis.map((thesis) => (
                      <TableRow key={thesis.id}>
                        <TableCell className="font-medium">
                          {thesis.title}
                        </TableCell>
                        <TableCell>{thesis.year}</TableCell>
                        <TableCell>{thesis.author.name}</TableCell>
                        <TableCell>{thesis.author.advisor.name}</TableCell>
                        <TableCell>
                          <Button
                            onClick={() => openThesisSheet(thesis)}
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
                              onDeleteThesis(thesis.id);
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
              {thesesResponse && (
                <Pagination
                  totalPages={thesesResponse.totalPages}
                  total={thesesResponse.total}
                />
              )}
            </CardFooter>
          </Card>
        </main>
      </div>
      <ConfirmationDialog
        open={openDialog}
        onDelete={() => deleteThesisMutate(deletingThesis)}
        setOpen={setOpenDialog}
        item="usuário"
      />
    </div>
  );
}
