import { Footer } from "@/components/footer";
import { ScrollToTop } from "@/components/scroll-to-top";
import { Statistics } from "@/components/statistics";
import { ThesesCardList } from "@/components/theses-card-list";

export function Home() {
  return (
    <>
      <ThesesCardList />
      <Statistics />
      <Footer />
      <ScrollToTop />
    </>
  );
}
