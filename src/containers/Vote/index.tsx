import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { DEFAULT_FETCH_ROWS } from '../../constants'
import { PageTitle, FullLoading } from '../../components/common'
import { EXECUTIVE_INFO_QUERY, VOTING_ACTIONS_QUERY, GOVERNANCE_INFO_QUERY_VOTE } from './queries'
import { getMakerDaoData } from '../../utils/makerdao'
import VoteDetails from '../../components/VoteDetails'

type Props = {
  match: any
}

const getExecutiveVariables = data => {
  return {
    id: data.id.toLowerCase(),
    timeLineCount: data.timeLineCount ? Number(data.timeLineCount) : DEFAULT_FETCH_ROWS,
  }
}

const Error = () => <div>ERROR: There was an error trying to fetch the data. </div>

function VoteInfo(props: Props) {
  const { match } = props
  const voteId = match.params.id

  const [resultVariables, setResultVariables] = useState(getExecutiveVariables({ id: voteId }))
  const [data, setData] = useState<any>({})
  const [makerData, setMakerData] = useState<any>({})
  const { data: gData, ...governanceResult } = useQuery(GOVERNANCE_INFO_QUERY_VOTE)

  const { data: votingData, ...votingResult } = useQuery(VOTING_ACTIONS_QUERY, { variables: resultVariables })

  const { data: vData, ...vResult } = useQuery(EXECUTIVE_INFO_QUERY, { variables: resultVariables })

  useEffect(() => {
    getMakerDaoData()
      .then(({ spellsInfo }) => {
        const vote = spellsInfo.find(el => {
          return el.source.toLowerCase() === voteId.toLowerCase()
        })
        setMakerData(vote)
      })
      .catch(error => {
        console.log(error)
      })
  }, [voteId])

  useEffect(() => {
    if (vData && vData.spells && voteId) {
      const vote = vData.spells.find(spell => spell.id === voteId)
      setData(() => ({ ...makerData, ...vote }))
      setResultVariables(
        getExecutiveVariables({
          id: voteId,
          timeLineCount: vote.timeLineCount,
        }),
      )
    }
  }, [vData, voteId, makerData])
  if (!data || vResult.error || votingResult.error || governanceResult.error) return <Error />
  if (Object.keys(data).length === 0 || vResult.loading || votingResult.loading || governanceResult.loading)
    return <FullLoading />

  return (
    <>
      <PageTitle>{data.title}</PageTitle>
      <VoteDetails
        governanceInfo={gData.governanceInfo}
        executives={vData.spells}
        votingActions={votingData.spell ? votingData.spell.timeLine : []}
        vote={data}
      />
    </>
  )
}

export default VoteInfo
