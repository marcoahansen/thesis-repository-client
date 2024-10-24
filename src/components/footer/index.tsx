import faeterj from "../../assets/faeterj.png";

export const Footer = () => {
  return (
    <footer id="footer">
      <hr className="w-11/12 mx-auto" />

      <section className="container py-20 grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-12 gap-y-8">
        <div className="col-span-full xl:col-span-2">
          <div className="flex items-center justify-center font-bold text-xl gap-2 text-primary">
            <img src={faeterj} alt="faeterj-petropolis" />
            Faeterj Petrópolis
          </div>
        </div>

        <div className="flex flex-col gap-2 col-span-2">
          <h3 className="font-bold text-lg text-primary">Endereço</h3>
          <div>
            <a
              rel="noreferrer noopener"
              href="https://maps.app.goo.gl/duYBNQSB8sDyUnih7"
              className="text-gray-700 hover:text-primary border-primary hover:border-b-2"
              target="_blank"
            >
              Av. Getúlio Vargas 335, Quitandinha, Petrópolis, RJ, 25651-075
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-2 col-span-2">
          <h3 className="font-bold text-lg text-primary">Contato</h3>
          <div>
            <a
              rel="noreferrer noopener"
              href="mailto:contato@faeterj-petropolis.edu.br"
              className="text-gray-700 hover:text-primary border-primary hover:border-b-2"
              target="_blank"
            >
              contato@faeterj-petropolis.edu.br
            </a>
          </div>
        </div>
      </section>

      <section className="container pb-14 text-center">
        <h3>
          &copy; 2024 Plataforma Desenvolvida por{" "}
          <a
            rel="noreferrer noopener"
            target="_blank"
            href="https://www.linkedin.com/in/marco-a-hansen/"
            className="text-primary font-bold transition-all border-primary hover:border-b-2"
          >
            Marco Hansen
          </a>
        </h3>
      </section>
    </footer>
  );
};
