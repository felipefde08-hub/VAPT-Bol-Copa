import React, { useState } from "react";
import { EntryData } from "@/pages/bolao";
import { GROUPS, ALL_TEAMS } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function PredictionsStep({ 
  onNext, 
  initialData 
}: { 
  onNext: (data: Partial<EntryData>) => void;
  initialData: Partial<EntryData>;
}) {
  const [groupPicks, setGroupPicks] = useState<Record<string, string[]>>(initialData.groupPicks || {});
  const [champion, setChampion] = useState(initialData.champion || "");
  const [runnerUp, setRunnerUp] = useState(initialData.runnerUp || "");
  const [topScorer, setTopScorer] = useState(initialData.topScorer || "");
  const [bestPlayer, setBestPlayer] = useState(initialData.bestPlayer || "");
  const [bestGoalkeeper, setBestGoalkeeper] = useState(initialData.bestGoalkeeper || "");

  const handleGroupToggle = (groupName: string, teamName: string) => {
    setGroupPicks(prev => {
      const currentPicks = prev[groupName] || [];
      if (currentPicks.includes(teamName)) {
        return { ...prev, [groupName]: currentPicks.filter(t => t !== teamName) };
      } else if (currentPicks.length < 2) {
        return { ...prev, [groupName]: [...currentPicks, teamName] };
      }
      return prev;
    });
  };

  const isFormValid = () => {
    const groupsValid = Object.keys(GROUPS).every(group => groupPicks[group]?.length === 2);
    return groupsValid && champion && runnerUp && topScorer && bestPlayer && bestGoalkeeper;
  };

  const handleSubmit = () => {
    if (isFormValid()) {
      onNext({
        groupPicks,
        champion,
        runnerUp,
        topScorer,
        bestPlayer,
        bestGoalkeeper
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-display mb-2">Fase de Grupos</h2>
        <p className="text-muted-foreground text-sm">Selecione os 2 times que avançam em cada grupo.</p>
      </div>

      <div className="grid gap-6">
        {Object.entries(GROUPS).map(([groupName, teams]) => {
          const picks = groupPicks[groupName] || [];
          const isComplete = picks.length === 2;

          return (
            <Card key={groupName} className={`border-2 transition-colors ${isComplete ? 'border-secondary/50' : 'border-transparent'}`}>
              <CardHeader className="py-4 bg-muted/50 border-b">
                <CardTitle className="text-lg font-display flex justify-between items-center">
                  <span>{groupName}</span>
                  <span className={`text-sm ${isComplete ? 'text-secondary font-bold' : 'text-muted-foreground font-sans'}`}>
                    {picks.length}/2
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 grid gap-2">
                {teams.map(team => {
                  const isSelected = picks.includes(team.name);
                  const disabled = !isSelected && picks.length >= 2;
                  
                  return (
                    <button
                      key={team.name}
                      type="button"
                      disabled={disabled}
                      onClick={() => handleGroupToggle(groupName, team.name)}
                      className={`flex items-center justify-between p-3 rounded-lg border-2 text-left transition-all ${
                        isSelected 
                          ? 'border-primary bg-primary/5 shadow-sm' 
                          : disabled 
                            ? 'border-transparent opacity-50 bg-muted/30 cursor-not-allowed' 
                            : 'border-border bg-background hover:border-primary/30'
                      }`}
                    >
                      <span className="font-semibold text-foreground flex items-center gap-2">
                        <span className="text-xl">{team.flag}</span>
                        {team.name}
                      </span>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs">
                          ✓
                        </div>
                      )}
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="border-t pt-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-display mb-2">Apostas Especiais</h2>
          <p className="text-muted-foreground text-sm">Quem vai brilhar na Copa?</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-5 space-y-5">
              <div className="space-y-2">
                <Label className="text-base font-bold text-primary">🏆 Campeão (Cupom R$150)</Label>
                <Select value={champion} onValueChange={setChampion}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Selecione o campeão" />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_TEAMS.map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-base font-bold">🥈 Vice-campeão (Cupom R$80)</Label>
                <Select value={runnerUp} onValueChange={setRunnerUp}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Selecione o vice" />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_TEAMS.map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-base font-bold">⚽ Artilheiro (Cupom R$50)</Label>
                <Input 
                  value={topScorer} 
                  onChange={e => setTopScorer(e.target.value)} 
                  placeholder="Ex: Vini Jr" 
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base font-bold">⭐ Melhor Jogador (Cupom R$50)</Label>
                <Input 
                  value={bestPlayer} 
                  onChange={e => setBestPlayer(e.target.value)} 
                  placeholder="Nome do jogador" 
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base font-bold">🧤 Melhor Goleiro (Cupom R$30)</Label>
                <Input 
                  value={bestGoalkeeper} 
                  onChange={e => setBestGoalkeeper(e.target.value)} 
                  placeholder="Nome do goleiro" 
                  className="h-12"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="pt-4 sticky bottom-4 z-20">
        <Button 
          size="lg" 
          className="w-full h-14 text-lg font-bold shadow-xl" 
          disabled={!isFormValid()}
          onClick={handleSubmit}
        >
          Finalizar Palpites
        </Button>
      </div>
    </div>
  );
}
