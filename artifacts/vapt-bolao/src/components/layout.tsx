import React from "react";
import { Progress } from "@/components/ui/progress";
import vaptLogo from "@assets/WhatsApp_Image_2026-03-09_at_11.37.13_1778335683435.jpeg";

export default function Layout({ children, step }: { children: React.ReactNode; step: number }) {
  const progressValue = step === 1 ? 33 : step === 2 ? 66 : 100;

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background relative overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-full h-1 bg-primary z-50">
        <Progress value={progressValue} className="h-1 rounded-none bg-primary/20" />
      </div>

      <header className="pt-8 pb-6 px-4 text-center relative z-10">
        <div className="flex justify-center mb-3">
          <img
            src={vaptLogo}
            alt="VAPT"
            className="h-14 w-auto rounded-xl"
          />
        </div>
        <h1 className="text-3xl font-display mt-1 uppercase tracking-wide text-foreground">
          Bolão Copa by VAPT
        </h1>
        {step < 3 && (
          <p className="text-muted-foreground mt-2 font-medium max-w-sm mx-auto">
            Participe, faça seus palpites e ganhe cupons de desconto exclusivos no app VAPT!
          </p>
        )}
      </header>

      <main className="flex-1 flex flex-col px-4 pb-20 relative z-10">
        {children}
      </main>

      <footer className="mt-auto py-8 bg-card border-t border-border text-center px-4 relative z-10">
        <div className="flex justify-center mb-2">
          <img src={vaptLogo} alt="VAPT" className="h-8 w-auto rounded-lg" />
        </div>
        <p className="text-sm font-medium text-foreground mb-1">Pediu, chegou em até 1 hora · vaptbr.com</p>
        <p className="text-xs text-muted-foreground">São José do Rio Preto, SP</p>
      </footer>
    </div>
  );
}
