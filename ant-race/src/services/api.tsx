import { CalculationStates } from "../utils/enums";
import { Ant } from "../utils/types";

export const getData = (): {ants: Ant[]} => {
  return {
    ants: [
      {
        name: "Flamin’ Pincers",
        length: 11,
        color: "RED",
        weight: 2,
        likelihoodOfAntWinning: null,
        progress: 0,
        calculationState: CalculationStates.notYetRun
      },
      {
        name: "AuNT Sarathi",
        length: 20,
        color: "BLACK",
        weight: 5,
        likelihoodOfAntWinning: null,
        progress: 0,
        calculationState: CalculationStates.notYetRun
      },
      {
        name: "The Unbeareable Lightness of Being",
        length: 5,
        color: "SILVER",
        weight: 1,
        likelihoodOfAntWinning: null,
        progress: 0,
        calculationState: CalculationStates.notYetRun
      },
      {
        name: "‘The Duke’",
        length: 17,
        color: "RED",
        weight: 3,
        likelihoodOfAntWinning: null,
        progress: 0,
        calculationState: CalculationStates.notYetRun
      },
    ],
  };
};
