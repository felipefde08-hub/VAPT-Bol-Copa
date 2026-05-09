import React from "react";
import { Progress } from "@/components/ui/progress";

export default function Layout({ children, step }: { children: React.ReactNode; step: number }) {
  const progressValue = step === 1 ? 33 : step === 2 ? 66 : 100;

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background relative overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-full h-1 bg-primary z-50">
        <Progress value={progressValue} className="h-1 rounded-none bg-primary/20" />
      </div>

      <header className="pt-8 pb-6 px-4 text-center relative z-10">
        <div className="text-4xl font-display text-primary tracking-tight font-bold">VAPT</div>
        <h1 className="text-3xl font-display mt-2 uppercase tracking-wide text-foreground">
          Bolão Copa 2026
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
        <div className="text-xl font-display text-primary tracking-wide font-bold mb-2">VAPT</div>
        <p className="text-sm font-medium text-foreground mb-1">Pediu, chegou em até 1 hora · vaptbr.com</p>
        <p className="text-xs text-muted-foreground">São José do Rio Preto, SP</p>
      </footer>
    </div>
  );
}
