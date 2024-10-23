import { LooseDataValue, runGraphInFile, RunGraphOptions, startDebuggerServer } from '@ironclad/rivet-node'
import path from 'path'
import { createRivetInputs } from '../util/rivet'

const debuggerServer = startDebuggerServer({ port: 21887 })

export async function runRivetGraph(input: string, graphName: string) {
  return await executeGraph(input, graphName)
}

async function executeGraph(input: string, graphName: string) {
  const rivetInputs = createRivetInputs(input)
  const result = await run(rivetInputs, graphName)
  console.log('🤖 Graph result', result)

  return result.output.value
}

async function run(rivetInput: Record<string, LooseDataValue>, graphName: string) {
  const rivetProjPath = path.resolve(process.cwd(), './rivet/exercises.rivet-project')

  return await runGraphInFile(rivetProjPath, {
    graph: graphName,
    remoteDebugger: debuggerServer,
    inputs: rivetInput,
    context: {},
    externalFunctions: {
      calculate: async (_, rivetInput: string) => {
        // todo

        return {
          type: 'string',
          value: 'result',
        }
      },
    },
    onUserEvent: {},
    openAiKey: process.env.OPENAI_API_KEY,
  } as RunGraphOptions)
}
