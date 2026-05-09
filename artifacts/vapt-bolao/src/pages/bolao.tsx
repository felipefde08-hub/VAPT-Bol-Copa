import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RegistrationStep from "@/components/steps/registration";
import PredictionsStep from "@/components/steps/predictions";
import ConfirmationStep from "@/components/steps/confirmation";
import Layout from "@/components/layout";
import { saveEntry } from "@/lib/supabase";

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

export default function BolaoApp() {
  const [step, setStep] = useState(1);
  const [entryData, setEntryData] = useState<Partial<EntryData>>({});

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.couponCode) {
          setEntryData(parsed);
          setStep(parsed.groupPicks && Object.keys(parsed.groupPicks).length > 0 ? 3 : 2);
        }
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }
  }, []);

  const updateData = (data: Partial<EntryData>) => {
    const newData = { ...entryData, ...data };
    setEntryData(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    return newData;
  };

  const handleNextStep = (data: Partial<EntryData>) => {
    const newData = updateData(data);

    // Passo 1 → salva lead imediatamente (parcial)
    if (step === 1 && newData.email) {
      saveEntry({
        name: newData.name!,
        email: newData.email!,
        whatsapp: newData.whatsapp!,
        coupon_code: newData.couponCode!,
        timestamp: newData.timestamp!,
        completed: false,
      });
    }

    // Passo 2 → salva palpite completo
    if (step === 2 && newData.email) {
      saveEntry({
        name: newData.name!,
        email: newData.email!,
        whatsapp: newData.whatsapp!,
        coupon_code: newData.couponCode!,
        timestamp: newData.timestamp!,
        group_picks: newData.groupPicks,
        champion: newData.champion,
        runner_up: newData.runnerUp,
        top_scorer: newData.topScorer,
        best_player: newData.bestPlayer,
        best_goalkeeper: newData.bestGoalkeeper,
        neymar_goes_copa: newData.neymarGoesCopa ?? null,
        completed: true,
      });
    }

    setStep(step + 1);
    window.scrollTo(0, 0);
  };

  return (
    <Layout step={step}>
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
