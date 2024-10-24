import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Button } from "../ui/button";
import { useSearchParams } from "react-router-dom";
import { Input } from "../ui/input";
import { Search } from "lucide-react";

const searchSchema = z.string();

interface SearchBarProps {
  placeholder?: string;
  orderByOptions?: Array<{
    value: string;
    label: string;
  }>;
}

export function SearchInput({ placeholder, orderByOptions }: SearchBarProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page") || 1);
  const take = Number(searchParams.get("take") || 10);
  const search = searchParams.get("search") || "";
  const orderBy =
    searchParams.get("orderBy") || (orderByOptions?.[0]?.value ?? "");
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
  return (
    <form
      onSubmit={handleSearchChange}
      className="flex gap-2 w-full md:w-[60%]"
    >
      <Input
        {...register("search")}
        placeholder={placeholder ? placeholder : "Buscar..."}
      />
      <Button aria-label="Buscar" type="submit" size="icon">
        <Search />
      </Button>
    </form>
  );
}
