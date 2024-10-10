import {
  BookCopy,
  BookOpenCheck,
  MoreHorizontal,
  Pencil,
  PlusCircle,
  SquareArrowOutUpRight,
  Trash,
  Trash2Icon,
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
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Aside } from "@/components/aside";
import { MobileAside } from "@/components/mobile-aside";
import { Loading } from "@/components/loading";
import { useDeleteThesis, useTheses } from "@/hooks/theses-hooks";
import { Pagination } from "@/components/pagination";

export const navLinks = [
  { icon: <BookOpenCheck />, label: "Trabalhos", to: "/admin" },
  { icon: <BookCopy />, label: "Orientadores", to: "/admin/advisors" },
  { icon: <Users2 />, label: "Usuários", to: "/admin/users" },
];

export function Theses() {
  const { data: thesesResponse, isLoading } = useTheses();
  const { mutate } = useDeleteThesis();

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
                <Button size="sm" className="h-8 gap-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Novo Trabalho
                  </span>
                </Button>
              </div>
            </div>
            <TabsContent value="all">
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle>Trabalhos de Conclusão</CardTitle>
                  <CardDescription>
                    Faça a gestão dos trabalhos do sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
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
                      {thesesResponse &&
                        thesesResponse.thesis.map((thesis) => (
                          <TableRow key={thesis.id}>
                            <TableCell className="font-medium">
                              {thesis.title}
                            </TableCell>
                            <TableCell>{thesis.year}</TableCell>
                            <TableCell>{thesis.author.name}</TableCell>
                            <TableCell>{thesis.author.advisor.name}</TableCell>
                            <TableCell>
                              <Button
                                size="icon"
                                variant="link"
                                className="h-8"
                              >
                                <SquareArrowOutUpRight />
                              </Button>
                              <Button
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
                                  mutate(thesis.id);
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
                  {thesesResponse && (
                    <Pagination
                      totalPages={thesesResponse.totalPages}
                      total={thesesResponse.total}
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
