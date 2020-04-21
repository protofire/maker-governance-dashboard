import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { getPollsMetaData } from '../../utils/makerdao'
import { POLL_QUERY_BY_ID } from './queries'
import { PageTitle, FullLoading } from '../../components/common'
import PollDetails from '../../components/PollDetails'

type Props = {
  match: any
}

const Error = () => <div>ERROR: There was an error trying to fetch the data. </div>

function PollInfo(props: Props) {
  const { match } = props
  const pollId = match.params.id

  const [data, setData] = useState<any>({})
  const { data: pollData, loading, error } = useQuery(POLL_QUERY_BY_ID, { skip: !pollId, variables: { id: pollId } })

  useEffect(() => {
    if (pollData && pollData.poll) {
      getPollsMetaData([pollData.poll]).then(allPolls => {
        setData(allPolls.find(p => p.id === pollData.poll.id))
      })
    }
  }, [pollData])

  if (loading || Object.keys(data).length === 0) return <FullLoading />
  if (error) return <Error />

  return (
    <>
      <PageTitle>{data.title}</PageTitle>
      <PollDetails poll={data} />
    </>
  )
}

export default PollInfo
