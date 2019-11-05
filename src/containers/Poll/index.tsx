import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { getPollsData } from '../../utils/makerdao'
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
  const pollData = useQuery(POLL_QUERY_BY_ID, { skip: !pollId, variables: { id: pollId } })

  useEffect(() => {
    if (pollData.data && pollData.data.poll)
      getPollsData([pollData.data.poll]).then(result => setData(result.filter(Boolean)[0]))
  }, [pollData.data, pollId])

  if (pollData.loading || Object.keys(data).length === 0) return <FullLoading />
  if (pollData.error) return <Error />

  return (
    <>
      <PageTitle>{data.title}</PageTitle>
      <PollDetails poll={data} />
    </>
  )
}

export default PollInfo
