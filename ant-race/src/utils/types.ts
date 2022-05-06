import { CalculationStates } from "./enums";

export type Ant = {
    name: string;
    length: number;
    color: string;
    weight: number;
    likelihoodOfAntWinning: number | null;
    calculationState: CalculationStates;
    progress: number;
}