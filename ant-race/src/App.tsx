import { useEffect, useState } from "react";
import "./App.css";
import { getData } from "./services/api";
import { CalculationStates, DataStates, RaceStates } from "./utils/enums";
import { generateAntWinLikelihoodCalculator } from "./utils/generateAntWinLikelihoodCalculator";
import { Ant } from "./utils/types";

function App() {
  const [ants, setAnts] = useState<Ant[]>([]);
  const [dataState, setDataState] = useState<string>(DataStates.initial);
  const [raceState, setRaceState] = useState<string>(RaceStates.notYetRun);
  const [calculationsState, setCalculationsState] = useState<string>(
    CalculationStates.notYetRun
  );
  const [winner, setWinner] = useState<Ant | null>(null);

  const loadData = () => {
    setDataState(DataStates.loading);
    let data = getData();
    setDataState(DataStates.loaded);
    setAnts(data.ants);
  };

  const sortAnts = (ants: any[]) => {
    return ants.sort((a, b) =>
      a.likelihoodOfAntWinning > b.likelihoodOfAntWinning ? -1 : 1
    );
  };

  const startRace = () => {
    setRaceState(RaceStates.inProgress);
    const interval = setInterval(function () {
      let clonedAnts = [...ants];
      clonedAnts.forEach((ant) => {
        let random = Math.floor(Math.random() * 10) + 1;
        ant.progress = Math.round(ant.progress + random / ant.weight);
        setAnts(clonedAnts);
        if (ant.progress >= 100) {
          ant.progress = 100;
          setWinner(ant);
          setRaceState(RaceStates.allCalculated);
          clearInterval(interval);
        }
      });
    }, 500);
  };

  const calculateLikelihood = (antsToCalc: Ant[]) => {
    antsToCalc.forEach((ant) => {
      const generateLikelihoodCalculator = generateAntWinLikelihoodCalculator();
      let name = ant.name;
      ant.calculationState = CalculationStates.inProgress;
      setAnts(antsToCalc);
      return generateLikelihoodCalculator((ant: Ant) => {
        likelihoodCalculatorPromise(ant).then((likelihood) => {
          updateAntLikelihood(likelihood, name);
        });
      });
    });
  };

  const likelihoodCalculatorPromise = (ant: Ant) => {
    return new Promise((resolve) => {
      resolve(ant);
    });
  };

  const updateAntLikelihood = (likelihood: any, antName: string) => {
    console.log("looking for ", antName, ants, likelihood);

    let clonedAnts = [...ants];
    const clonedAnt = clonedAnts.find((ant) => {
      return ant.name === antName;
    });
    if (clonedAnt) {
      clonedAnt.likelihoodOfAntWinning = Math.round(likelihood * 100);
      clonedAnt.calculationState = CalculationStates.allCalculated;
      setAnts(clonedAnts);
    } else {
      throw new Error("antName not found");
    }
  };

  //  this is a bit of a hack, wouldn't do this in prod, this should prob be refactored to use redux or similar way of dispatching
  useEffect(() => {
    if (
      dataState === DataStates.loaded &&
      calculationsState === CalculationStates.notYetRun
    ) {
      setCalculationsState(CalculationStates.allCalculated);
      calculateLikelihood(ants);
    }
  });

  //renders *********************

  const renderHeader = () => {
    return <div className="header"><h3>Race Status: {raceState}</h3></div>;
  };

  const renderToolbar = () => {
    return (
      <div className="toolbar">
        <div>
          <button onClick={loadData} disabled={dataState === DataStates.loaded}>
            Load Data
          </button>
        </div>
        <br />
        <div>
          <button
            onClick={startRace}
            disabled={
              dataState !== DataStates.loaded ||
              raceState !== RaceStates.notYetRun
            }
          >
            Start Race
          </button>
        </div>
      </div>
    );
  };

  const renderAntsTable = () => {
    return (
      <div className="ant-table">
        {sortAnts(ants).map((ant: Ant, index: number) => (
          <div className="ant-row" key={"row" + index}>
            <div
              className="ant-col-name"
              style={{ color: ant.color }}
              key={"name" + index}
            >
              {ant.name}
            </div>
            <div className="ant-col-likelihood" key={"likelihood" + index}>
              Likelihood:{" "}
              {ant.calculationState === CalculationStates.notYetRun
                ? "Not yet run"
                : ant.calculationState === CalculationStates.inProgress
                ? "Calculating..."
                : ant.likelihoodOfAntWinning}
            </div>
            <div key={"progress" + index}>
              <b>Progress:</b> {ant.progress}%
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderFooter = () => {
    return (
      <div>
        {winner && (
          <div className="winner">
            <hr />
            <h3>Winner: {winner.name} </h3>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="App">
      {renderHeader()}
      {renderToolbar()}
      <hr />
      {renderAntsTable()}
      {renderFooter()}
    </div>
  );
}

export default App;
