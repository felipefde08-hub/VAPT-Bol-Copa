import React from "react";
import { EntryData } from "@/pages/bolao";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ConfirmationStep({ data }: { data: EntryData }) {
  const shareMessage = encodeURIComponent(
    `Fiz minha aposta no Bolão Copa 2026 da VAPT! Use meu cupom ${data.couponCode} e ganhe frete grátis no app VAPT! 🏆⚽`
  );
  const shareUrl = `https://wa.me/?text=${shareMessage}`;

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 text-secondary text-3xl mb-2">
          ✓
        </div>
        <h2 className="text-3xl font-display text-primary">Palpites Registrados!</h2>
        <p className="text-muted-foreground text-lg px-4">
          Boa sorte, {data.name.split(' ')[0]}! Aqui está seu prêmio garantido:
        </p>
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-1">
        <div className="absolute top-1/2 -left-3 w-6 h-6 bg-background rounded-full -translate-y-1/2"></div>
        <div className="absolute top-1/2 -right-3 w-6 h-6 bg-background rounded-full -translate-y-1/2"></div>
        
        <div className="bg-card rounded-xl border-2 border-dashed border-primary/30 p-8 text-center relative z-10 h-full flex flex-col justify-center items-center">
          <div className="text-sm font-bold tracking-widest text-muted-foreground uppercase mb-2">Cupom Frete Grátis</div>
          <div className="text-4xl font-display tracking-wider text-primary font-bold bg-primary/5 px-6 py-3 rounded-lg border-2 border-primary/20">
            {data.couponCode}
          </div>
          <p className="text-sm text-muted-foreground mt-4">Válido para 1 pedido no app VAPT</p>
        </div>
      </div>

      <Button asChild size="lg" className="w-full h-14 text-lg font-bold bg-[#25D366] hover:bg-[#1DA851] text-white">
        <a href={shareUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
          Compartilhar no WhatsApp
        </a>
      </Button>

      <div className="pt-8 mt-8 border-t border-border">
        <h3 className="text-xl font-display mb-4">Resumo da sua Aposta</h3>
        
        <Card className="mb-4">
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Campeão</span>
              <span className="font-bold">{data.champion}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Vice</span>
              <span className="font-bold">{data.runnerUp}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Artilheiro</span>
              <span className="font-bold text-right">{data.topScorer}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Melhor Jogador</span>
              <span className="font-bold text-right">{data.bestPlayer}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Melhor Goleiro</span>
              <span className="font-bold text-right">{data.bestGoalkeeper}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
