import dotenv from 'dotenv'
import express, { Request, Response } from 'express'
import { runRivetGraph } from './services/rivetService'
import { RunGraphRequest } from './types/requests'

dotenv.config({ path: '.env' })

const app = express()
const port = process.env.PORT || 8080

app.use(express.json())

// Ping endpoint
app.get('/ping', (req, res) => {
  res.send('Hello, World!')
})

app.post('/run-graph', async (req: Request<{}, {}, RunGraphRequest>, res: Response) => {
  try {
    const { input, graphName } = req.body

    // Validate request body
    if (!input) {
      res.status(400).send('Request body must contain an input field')
      return
    }

    const result = await runRivetGraph(input, graphName)
    res.json({ graphResult: result })
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
})

app.listen(port, () => {
  console.log(`Express is listening at http://localhost:${port}`)
})
