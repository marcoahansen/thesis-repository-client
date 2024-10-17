import { ThesisCount } from "../thesis-count";
import { TopAdvisors } from "../top-advisors";
import { TopKeywords } from "../top-keywords";

export function Statistics() {
  return (
    <section id="statistics" className=" bg-muted">
      <div className="container grid lg:grid-cols-3 place-items-center py-20 md:py-32 gap-1">
        <div className="text-center lg:text-start space-y-6">
          <main className="text-5xl md:text-6xl font-bold">
            <h1 className="inline">
              <span className="inline bg-gradient-to-r from-primary via-[#397a8e] to-primary text-transparent bg-clip-text">
                Estatísticas
              </span>{" "}
              da plataforma
            </h1>{" "}
          </main>

          <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
            Acompanhe o crescimento da plataforma, os orientadores mais atuantes
            e as palavras chaves mais utilizadas
          </p>
        </div>

        <div className="flex gap-2 col-span-2 flex-shrink-0 flex-col md:flex-row">
          <ThesisCount />
          <TopAdvisors />
          <TopKeywords />
        </div>
      </div>
    </section>
  );
}
