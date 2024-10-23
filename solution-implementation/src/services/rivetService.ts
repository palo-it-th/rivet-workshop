import { LooseDataValue, runGraphInFile, RunGraphOptions, startDebuggerServer } from '@ironclad/rivet-node'
import path from 'path'
import { GraphResultValue } from '../types/rivet'
import { createLoopRivetInputs, createRivetInputs } from '../util/rivet'
import { evaluateExpression } from './calculate'

const debuggerServer = startDebuggerServer({ port: 21887 })
const JS_LOOP_GRAPH_NAME = '3. Game of 24/3. JS loop'
const VERIFY_AI_GRAPH_NAME = '3. Game of 24/4. Verify answer with AI'
const MAX_ATTEMPTS = 10

export async function runRivetGraph(input: string, graphName: string) {
  if (graphName === JS_LOOP_GRAPH_NAME || graphName === VERIFY_AI_GRAPH_NAME) {
    return await executeLoopGraph(input, graphName)
  }

  return await executeGraph(input, graphName)
}

async function executeGraph(input: string, graphName: string) {
  const rivetInputs = createRivetInputs(input)
  const result = await run(rivetInputs, graphName)
  console.log('🤖 Graph result', result)

  return result.output.value
}

async function executeLoopGraph(input: string, graphName: string) {
  const solutions: GraphResultValue[] = []
  let attempts = 0
  let isResultCorrect = false
  let graphResult: GraphResultValue = { solution: '', isCorrect: 'false' }

  while (!isResultCorrect && attempts < MAX_ATTEMPTS) {
    const rivetInputs = createLoopRivetInputs(input, solutions)
    const result = await run(rivetInputs, graphName)
    console.log('🤖 Graph result', result)
    console.log('🚀 ~ runRivetGraph ~ calculations', solutions)

    graphResult = result.output.value as GraphResultValue
    isResultCorrect = graphResult.isCorrect === 'true'
    solutions.push(graphResult)
    attempts++
  }

  return graphResult.solution
}

async function run(rivetInput: Record<string, LooseDataValue>, graphName: string) {
  const rivetProjPath = path.resolve(process.cwd(), './rivet/solution.rivet-project')

  return await runGraphInFile(rivetProjPath, {
    graph: graphName,
    remoteDebugger: debuggerServer,
    inputs: rivetInput,
    context: {},
    externalFunctions: {
      calculate: async (_, rivetInput: string) => {
        const result = evaluateExpression(rivetInput)

        return {
          type: 'number',
          value: result,
        }
      },
    },
    onUserEvent: {},
    openAiKey: process.env.OPENAI_API_KEY,
  } as RunGraphOptions)
}
