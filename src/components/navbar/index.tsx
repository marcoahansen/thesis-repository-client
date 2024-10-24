import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { buttonVariants } from "../ui/button";
import { ExternalLink, Menu } from "lucide-react";
import faeterj from "../../assets/faeterj.png";

interface RouteProps {
  href: string;
  label: string;
}

const routeList: RouteProps[] = [
  {
    href: "#theses",
    label: "TCCs",
  },
  {
    href: "#statistics",
    label: "Estatísticas",
  },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <header className="sticky border-b-[1px] top-0 z-40 w-full bg-muted drop-shadow-md shadow-black/10">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container h-14 px-4 w-screen flex justify-between ">
          <NavigationMenuItem className="font-bold flex">
            <a
              rel="noreferrer noopener"
              href="/"
              className="ml-2 font-bold text-xl text-primary flex items-center gap-3"
            >
              <img src={faeterj} className="w-12" alt="faeterj-petropolis" />
              <p className="flex flex-col">
                Faeterj Petrópolis
                <span className="text-sm font-medium">
                  Trabalhos de Conclusão de Curso
                </span>
              </p>
            </a>
          </NavigationMenuItem>

          {/* mobile */}
          <NavigationMenuItem>
            <span className="flex md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger className="px-2">
                  <Menu
                    className="flex md:hidden h-5 w-5"
                    onClick={() => setIsOpen(true)}
                  >
                    <span className="sr-only">Menu Icon</span>
                  </Menu>
                </SheetTrigger>

                <SheetContent side={"left"}>
                  <nav className="flex flex-col justify-center items-center gap-2 mt-4">
                    {routeList.map(({ href, label }: RouteProps) => (
                      <a
                        rel="noreferrer noopener"
                        key={label}
                        href={href}
                        onClick={() => setIsOpen(false)}
                        className={buttonVariants({ variant: "ghost" })}
                      >
                        {label}
                      </a>
                    ))}
                    <a
                      rel="noreferrer noopener"
                      href="https://faeterj-petropolis.edu.br/"
                      target="_blank"
                      className={`w-[110px] border ${buttonVariants({
                        variant: "default",
                      })}`}
                    >
                      <ExternalLink className="mr-2 w-5 h-5" />
                      Faeterj
                    </a>
                  </nav>
                </SheetContent>
              </Sheet>
            </span>
          </NavigationMenuItem>

          {/* desktop */}
          <NavigationMenuItem>
            <nav className="hidden md:flex gap-4">
              {routeList.map((route: RouteProps, i) => (
                <a
                  key={i}
                  rel="noreferrer noopener"
                  href={route.href}
                  className={`text-[17px] ${buttonVariants({
                    variant: "link",
                  })}`}
                >
                  {route.label}
                </a>
              ))}
              <a
                rel="noreferrer noopener"
                href="https://faeterj-petropolis.edu.br/"
                target="_blank"
                className={`${buttonVariants({ variant: "link" })}`}
              >
                Faeterj Petrópolis
                <ExternalLink className="ml-2 w-4 h-4" />
              </a>
            </nav>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};
