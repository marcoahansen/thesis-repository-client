import { ThesisCount } from "../thesis-count";
import { TopAdvisors } from "../top-advisors";
import { TopKeywords } from "../top-keywords";

export function Statistics() {
  return (
    <section id="statistics" className=" bg-muted">
      <div className="container grid lg:grid-cols-2 place-items-center py-20 md:py-32 gap-1">
        <div className="text-center space-y-6 col-span-2 mb-11">
          <h2 className="inline text-3xl md:text-4xl font-bold">
            <span className="inline bg-gradient-to-r from-primary via-[#397a8e] to-primary text-transparent bg-clip-text">
              Estatísticas
            </span>{" "}
            da plataforma
          </h2>{" "}
          <p className="text-xl text-gray-700 mx-auto lg:mx-0">
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
