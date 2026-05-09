import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EntryData } from "@/pages/bolao";

const schema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  whatsapp: z.string().min(10, "WhatsApp deve ter pelo menos 10 dígitos").regex(/^[0-9]+$/, "Apenas números"),
});

export default function RegistrationStep({ 
  onNext, 
  initialData 
}: { 
  onNext: (data: Partial<EntryData>) => void;
  initialData: Partial<EntryData>;
}) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialData.name || "",
      email: initialData.email || "",
      whatsapp: initialData.whatsapp || "",
    },
  });

  const generateCoupon = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `VAPT-COPA-${code}`;
  };

  const onSubmit = (values: z.infer<typeof schema>) => {
    const couponCode = initialData.couponCode || generateCoupon();
    onNext({
      ...values,
      couponCode,
      timestamp: initialData.timestamp || Date.now()
    });
  };

  return (
    <div className="space-y-6">
      <Card className="border-secondary/20 shadow-lg bg-card">
        <CardContent className="p-6">
          <div className="mb-6 bg-secondary/10 text-secondary p-4 rounded-xl text-center border border-secondary/20">
            <p className="font-bold text-lg">Cadastro = Frete Grátis!</p>
            <p className="text-sm mt-1 opacity-90">Preencha seus dados para garantir seu primeiro cupom imediatamente.</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome" {...field} className="h-12 bg-background" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="seu@email.com" {...field} className="h-12 bg-background" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp (Apenas números)</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="17999999999" {...field} className="h-12 bg-background" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" size="lg" className="w-full h-14 text-lg font-bold mt-4 shadow-md bg-primary hover:bg-primary/90 text-primary-foreground">
                Garantir Frete Grátis & Iniciar Palpites
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="grid gap-3 text-sm">
        <div className="p-3 bg-muted rounded-lg flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-full text-primary">🏆</div>
          <div>Acertar o Campeão: <span className="font-bold">Cupom R$150</span></div>
        </div>
        <div className="p-3 bg-muted rounded-lg flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-full text-primary">🥈</div>
          <div>Acertar o Vice: <span className="font-bold">Cupom R$80</span></div>
        </div>
        <div className="p-3 bg-muted rounded-lg flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-full text-primary">⚽</div>
          <div>Artilheiro / Melhor Jogador: <span className="font-bold">Cupom R$50</span></div>
        </div>
      </div>
    </div>
  );
}
