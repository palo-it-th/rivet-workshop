import { LooseDataValue } from '@ironclad/rivet-node'

export function createRivetInputs(input: string): Record<string, LooseDataValue> {
  return {
    input: {
      type: 'string',
      value: input,
    },
  }
}
