import { useTheses } from "@/hooks/theses-hooks";
import { Loading } from "../loading";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pagination } from "../pagination";
import { Button } from "../ui/button";
import { SearchInput } from "../search-input";
import { Link } from "react-router-dom";

export function ThesesCardList() {
  const { getTheses } = useTheses();
  const { data: thesesResponse, isLoading } = getTheses();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <section id="theses" className="container py-10 sm:py-10">
      <div className="flex flex-col justify-center items-center gap-4 pt-3 pb-8">
        <h2 className="text-3xl md:text-4xl font-bold">
          Acesse os
          <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
            {" "}
            Trabalhos de Conclusão de Curso{" "}
          </span>
          Apresentados na Instituição
        </h2>
        <p className="text-xl text-muted-foreground ">
          Utilize a barra de pesquisa para encontrar trabalhos, busque por
          título, autor ou orientador e palavras-chave
        </p>
        <SearchInput placeholder="Buscar Trabalhos" />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-5 lg:gap-6 grid-flow-row-dense mb-4 gap-3">
        {thesesResponse?.thesis.map((thesis) => (
          <Card
            key={thesis.id}
            className="md:break-inside-avoid overflow-hidden bg-muted/50 min-h-64 drop-shadow-md shadow-black/10 flex flex-col justify-between"
          >
            <CardHeader className="flex flex-row items-center gap-4 pb-0">
              <div className="flex flex-col ">
                <CardTitle className="text-lg">{thesis.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm">Autor: {thesis.author.name}</div>
              <div className="text-xs">
                Orientador: {thesis.author.advisor.name}
              </div>
            </CardContent>

            <CardFooter className="self-end">
              <Link to={`/thesis/${thesis.id}`}>
                <Button>Ver mais</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
      {thesesResponse && (
        <Pagination
          totalPages={thesesResponse.totalPages}
          total={thesesResponse.total}
          isHome
        />
      )}
    </section>
  );
}
