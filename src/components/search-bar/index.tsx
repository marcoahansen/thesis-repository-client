import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import { ArrowDownNarrowWide, ArrowUpNarrowWide, Search } from "lucide-react";
import { Label } from "../ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

const searchSchema = z.string();

interface SearchBarProps {
  orderByOptions: Array<{
    value: string;
    label: string;
  }>;
  placeholder?: string;
}

export function SearchBar({ orderByOptions, placeholder }: SearchBarProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page") || 1);
  const take = Number(searchParams.get("take") || 10);
  const search = searchParams.get("search") || "";
  const orderBy = searchParams.get("orderBy") || orderByOptions[0].value;
  const sort = searchParams.get("sort") || "asc";

  const { register, setValue } = useForm({
    mode: "onBlur",
    resolver: zodResolver(searchSchema),
  });

  useEffect(() => {
    setValue("search", search);
  }, [search, setValue]);

  const handleSearchChange = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const searchValue = formData.get("search") as string;
    setSearchParams({
      search: searchValue,
      orderBy,
      sort,
      page: String(currentPage),
      take: String(take),
    });
  };

  function handleOrderChange(value: string) {
    setSearchParams({
      search,
      orderBy: value,
      sort,
      page: String(currentPage),
      take: String(take),
    });
  }

  function toggleSortOrder() {
    setSearchParams({
      search,
      orderBy,
      sort: sort === "asc" ? "desc" : "asc",
      page: String(currentPage),
      take: String(take),
    });
  }

  function handleClearFilters() {
    setSearchParams({
      search: "",
      orderBy: orderByOptions[0].value,
      sort: "asc",
      page: String(currentPage),
      take: String(take),
    });
  }

  return (
    <div className="flex justify-between items-end w-full mb-4">
      <form onSubmit={handleSearchChange} className="flex gap-2 w-[60%]">
        <Input
          {...register("search")}
          placeholder={placeholder ? placeholder : "Buscar..."}
        />
        <Button type="submit" size="icon">
          <Search />
        </Button>
      </form>

      <div className="flex items-end gap-1">
        <div className="flex flex-col">
          <Label htmlFor="orderBy" className="text-xs text-muted-foreground">
            Ordenar por:
          </Label>
          <Select onValueChange={handleOrderChange} defaultValue={orderBy}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              {orderByOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="link" size="icon" onClick={toggleSortOrder}>
          {sort === "asc" ? <ArrowUpNarrowWide /> : <ArrowDownNarrowWide />}
        </Button>
        <Button variant="outline" onClick={handleClearFilters}>
          Limpar filtros
        </Button>
      </div>
    </div>
  );
}
