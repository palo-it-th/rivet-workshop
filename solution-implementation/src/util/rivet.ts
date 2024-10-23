import { LooseDataValue } from '@ironclad/rivet-node'
import { GraphResultValue } from '../types/rivet'

export function createRivetInputs(input: string): Record<string, LooseDataValue> {
  return {
    input: {
      type: 'string',
      value: input,
    },
  }
}
export function createLoopRivetInputs(input: string, solutions: GraphResultValue[]): Record<string, LooseDataValue> {
  return {
    input: {
      type: 'string',
      value: input,
    },
    previousSolutions: {
      type: 'string',
      value: solutions.map((e) => e.solution).join('\n'),
    },
  }
}
