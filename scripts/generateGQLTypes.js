const { exec } = require('child_process')
require('dotenv-flow').config()

exec(
  `apollo client:codegen src/types/generatedGQL.ts --endpoint ${process.env.REACT_APP_GRAPH_HTTP} --outputFlat --target typescript`,
  err => {
    if (err) {
      console.log(err)
      return
    }

    console.log(`GQL Types generated from endpoint: ${process.env.REACT_APP_GRAPH_HTTP}`)
  },
)
