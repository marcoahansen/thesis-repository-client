import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  totalPages: number;
  total: number;
  isHome?: boolean;
}

export function Pagination({ totalPages, total, isHome }: PaginationProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page") || 1);
  const take = Number(searchParams.get("take") || 10);
  const search = searchParams.get("search") || "";
  const orderBy = searchParams.get("orderBy") || "year";
  const sort = searchParams.get("sort") || "asc";

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setSearchParams({
        page: String(newPage),
        take: String(take),
        search,
        orderBy,
        sort,
      });
    }
  };

  const handleTakeChange = (newTake: string) => {
    setSearchParams({ page: "1", take: newTake, search, orderBy, sort });
  };

  return (
    <div className="flex justify-between items-center w-full">
      <div className="text-xs text-muted-foreground">
        mostrando <strong>{total < 10 || total < take ? total : take}</strong>{" "}
        de <strong>{total}</strong> itens
      </div>

      <div className="md:flex items-center gap-2 hidden">
        <label
          htmlFor="rows-per-page"
          className="text-xs text-muted-foreground"
        >
          {isHome ? "Trabalhos por página:" : "Linhas por página:"}
        </label>
        <Select onValueChange={handleTakeChange} defaultValue={String(take)}>
          <SelectTrigger className="w-[80px]" aria-label="Trabalhos por página">
            <SelectValue placeholder={String(take)} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="30">30</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="outline"
          aria-label="Página anterior"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft />
        </Button>
        <span className="text-xs text-muted-foreground">
          {currentPage} de {totalPages}
        </span>
        <Button
          size="icon"
          variant="outline"
          aria-label="Próxima página"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
