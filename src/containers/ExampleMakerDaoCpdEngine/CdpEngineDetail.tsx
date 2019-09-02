import React, { useEffect } from 'react'

import './index.css'

import { GetCdpEngine_cdpEngine } from '../../types/generatedGQL'

type Props = {
  data: GetCdpEngine_cdpEngine
  subscribeToChanges: () => void
}

function SummaryDetail(props: Props) {
  const { data, subscribeToChanges } = props

  useEffect(() => {
    subscribeToChanges()
  })

  return (
    <div className="MakerDaoCdpEngineContainer">
      <div className="MakerDaoCdpEngineContainerDetail">
        <div>Total CDPs: </div>
        <div>{data.cdpCount}</div>
      </div>
      <div className="MakerDaoCdpEngineContainerDetail">
        <div>Total open CDPs</div>
        <div>{data.openCdpCount}</div>
      </div>
      <div className="MakerDaoCdpEngineContainerDetail">
        <div>Total collateral</div>
        <div>{data.totalCollateral}</div>
      </div>
      <div className="MakerDaoCdpEngineContainerDetail">
        <div>Total debt</div>
        <div>{data.totalDebt}</div>
      </div>
      <div className="MakerDaoCdpEngineContainerDetail">
        <div>Last block processed</div>
        <div>{data.lastBlock}</div>
      </div>
      <div className="MakerDaoCdpEngineContainerDetail">
        <div>Total unique owners</div>
        <div>{data.cdpOwners.length}</div>
      </div>
    </div>
  )
}

export default SummaryDetail
