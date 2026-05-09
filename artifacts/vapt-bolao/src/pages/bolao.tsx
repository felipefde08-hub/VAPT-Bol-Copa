import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RegistrationStep from "@/components/steps/registration";
import PredictionsStep from "@/components/steps/predictions";
import ConfirmationStep from "@/components/steps/confirmation";
import Layout from "@/components/layout";
import { saveEntry, supabase } from "@/lib/supabase";

export type EntryData = {
  name: string;
  email: string;
  whatsapp: string;
  couponCode: string;
  timestamp: number;
  groupPicks: Record<string, string[]>;
  champion: string;
  runnerUp: string;
  topScorer: string;
  bestPlayer: string;
  bestGoalkeeper: string;
  neymarGoesCopa: boolean | null;
};

const STORAGE_KEY = "vapt-bolao-entry";

function rowToEntryData(row: Record<string, unknown>): Partial<EntryData> {
  return {
    name:            row.name as string,
    email:           row.email as string,
    whatsapp:        row.whatsapp as string,
    couponCode:      row.coupon_code as string,
    timestamp:       row.timestamp as number,
    groupPicks:      (row.group_picks as Record<string, string[]>) || {},
    champion:        (row.champion as string) || "",
    runnerUp:        (row.runner_up as string) || "",
    topScorer:       (row.top_scorer as string) || "",
    bestPlayer:      (row.best_player as string) || "",
    bestGoalkeeper:  (row.best_goalkeeper as string) || "",
    neymarGoesCopa:  row.neymar_goes_copa as boolean | null,
  };
}

export default function BolaoApp() {
  const [step, setStep] = useState(1);
  const [entryData, setEntryData] = useState<Partial<EntryData>>({});

  /* Restaura sessão existente ao abrir o app */
  useEffect(() => {
    async function restoreSession() {
      /* 1. Tenta Supabase (usuário já logado em outro dispositivo) */
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.email) {
          const { data: row } = await supabase
            .from("bolao_entries")
            .select("*")
            .eq("email", session.user.email)
            .maybeSingle();
          if (row) {
            const entry = rowToEntryData(row);
            setEntryData(entry);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(entry));
            setStep((row.completed && Object.keys(row.group_picks || {}).length > 0) ? 3 : 2);
            return;
          }
        }
      }

      /* 2. Fallback: localStorage */
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.couponCode) {
            setEntryData(parsed);
            setStep(parsed.groupPicks && Object.keys(parsed.groupPicks).length > 0 ? 3 : 2);
          }
        } catch { /* ignore */ }
      }
    }
    restoreSession();
  }, []);

  const updateData = (data: Partial<EntryData>) => {
    const newData = { ...entryData, ...data };
    setEntryData(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    return newData;
  };

  const handlePrevStep = () => {
    setStep(s => Math.max(1, s - 1));
    window.scrollTo(0, 0);
  };

  /* targetStep permite pular direto pro passo certo (ex: já completou tudo) */
  const handleNextStep = (data: Partial<EntryData>, targetStep?: number) => {
    const newData = updateData(data);
    const nextStep = targetStep ?? step + 1;

    if (step === 1 && newData.email) {
      saveEntry({
        name:        newData.name!,
        email:       newData.email!,
        whatsapp:    newData.whatsapp!,
        coupon_code: newData.couponCode!,
        timestamp:   newData.timestamp!,
        completed:   false,
      });
    }

    if (step === 2 && newData.email) {
      saveEntry({
        name:             newData.name!,
        email:            newData.email!,
        whatsapp:         newData.whatsapp!,
        coupon_code:      newData.couponCode!,
        timestamp:        newData.timestamp!,
        group_picks:      newData.groupPicks,
        champion:         newData.champion,
        runner_up:        newData.runnerUp,
        top_scorer:       newData.topScorer,
        best_player:      newData.bestPlayer,
        best_goalkeeper:  newData.bestGoalkeeper,
        neymar_goes_copa: newData.neymarGoesCopa ?? null,
        completed:        true,
      });
    }

    setStep(nextStep);
    window.scrollTo(0, 0);
  };

  return (
    <Layout step={step} onBack={step > 1 ? handlePrevStep : undefined}>
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-xl mx-auto"
        >
          {step === 1 && <RegistrationStep onNext={handleNextStep} initialData={entryData} />}
          {step === 2 && <PredictionsStep onNext={handleNextStep} initialData={entryData} />}
          {step === 3 && <ConfirmationStep data={entryData as EntryData} />}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}
