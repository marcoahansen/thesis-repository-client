import { Loading } from "@/components/loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useTheses } from "@/hooks/theses-hooks";
import {
  User,
  GraduationCap,
  ArrowLeft,
  BookOpenCheck,
  CalendarDays,
  BookText,
  Download,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

export function ThesisDetails() {
  const { getThesesById } = useTheses();
  const { thesisId } = useParams();

  const { data: thesis, isLoading: isLoadingThesis } = getThesesById(thesisId);

  return (
    <section id="thesis-details" className="container py-10 sm:py-10 ">
      <div className="flex flex-1 flex-col gap-1 p-4 lg:gap-2 lg:p-6">
        {isLoadingThesis || !thesis ? (
          <Loading />
        ) : (
          <div className="w-full bg-background px-0 py-2">
            <Card className="w-full mx-auto rounded-lg border border-dashed shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-primary flex gap-2 font-bold">
                  <BookOpenCheck className="h-8 w-8" />
                  {thesis.title}
                </CardTitle>
                <CardDescription className="text-md">
                  <span className="font-semibold">Ano:</span> {thesis.year}
                </CardDescription>
                <Separator />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 items-end ">
                  <div className="flex items-center space-x-2 text-xl">
                    <User className="h-4 w-4" />
                    <span className="font-semibold">Autor:</span>
                    <span>{thesis.author.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="h-4 w-4" />
                    <span className="font-semibold">Orientador:</span>
                    <span>{thesis.author.advisor.name}</span>
                  </div>
                  <Separator />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-primary flex gap-2">
                    <CalendarDays className="h-6 w-6" />
                    Palavras Chaves
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {thesis.keywords.map((keyword, index) => (
                      <Badge key={index} className="text-sm" variant="outline">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-primary flex gap-2">
                    <BookText />
                    Resumo
                  </h3>
                  <p className="text-muted-foreground">{thesis.abstract}</p>
                </div>
                <Separator />
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button asChild>
                  <a
                    href={thesis.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="mr-2 h-4 w-4" /> Baixar o PDF
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
        <div className="text-center">
          <Button variant="link" className="text-xl" asChild>
            <Link to={"/"}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para a Home
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
