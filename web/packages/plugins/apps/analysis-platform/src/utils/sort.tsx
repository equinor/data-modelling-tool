import { TReference } from '../Types'

export function sortSimulationsByNewest(
  simulationResults: TReference[]
): TReference[] {
  //assume that new simulations are appended to the back of the list
  return [].concat(simulationResults).reverse()
}
