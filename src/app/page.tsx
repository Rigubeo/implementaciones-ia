import { Benefits } from "@/components/landing/Benefits";
import { FinalCta } from "@/components/landing/FinalCta";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { Integrations } from "@/components/landing/Integrations";
import { Navbar } from "@/components/landing/Navbar";
import { NodoChat } from "@/components/landing/NodoChat";
import { NodoTelegram } from "@/components/landing/NodoTelegram";
import { PaymentsPortal } from "@/components/landing/PaymentsPortal";
import { ProblemSolution } from "@/components/landing/ProblemSolution";
import { Process } from "@/components/landing/Process";
import { Services } from "@/components/landing/Services";
import { UseCases } from "@/components/landing/UseCases";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Integrations />
        <NodoTelegram />
        <Services />
        <ProblemSolution />
        <UseCases />
        <Process />
        <PaymentsPortal />
        <Benefits />
        <FinalCta />
      </main>
      <NodoChat />
      <Footer />
    </>
  );
}
