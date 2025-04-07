
import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface LeadScoreSliderProps {
  score: number;
  handleScoreChange: (value: number[]) => void;
}

export const LeadScoreSlider = ({ score, handleScoreChange }: LeadScoreSliderProps) => {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <Label htmlFor="score">Score du lead ({score}%)</Label>
      </div>
      <Slider
        defaultValue={[score]}
        max={100}
        step={1}
        onValueChange={handleScoreChange}
        className="mb-6"
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>Faible intérêt</span>
        <span>Intérêt moyen</span>
        <span>Fort intérêt</span>
      </div>
    </div>
  );
};
