import React, { useState } from 'react'
import styled from 'styled-components'
import { SearchField, ButtonSearch } from '../common/Table/filters'
import { VOTING_ACTION_ADD, VOTING_ACTION_LOCK } from '../../constants'
import { Spinner, SpinnerContainer } from '../common'

type Props = {
  polls: Array<any>
  executives: Array<any>
  history?: any
}

const Error = () => <div>ERROR: The address is invalid. </div>
const NotFound = () => <div>The address has no participations. </div>
const Loading = () => (
  <SpinnerContainer>
    <Spinner width="35px" height="35px" />
  </SpinnerContainer>
)

const MessageContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`
const VotingHistoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  width: 100%;
  ${SearchField} {
    width: 100%;
    max-width: 600px;
  }
  ${ButtonSearch} {
    width: auto;
    padding: 20px;
    margin-top: 20px;
  }
`
const validateInputAddresses = address => /^(0x){1}[0-9a-fA-F]{40}$/i.test(address)

function VotingHistoryDetails(props: Props) {
  const { polls, executives, history } = props
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [found, setFound] = useState(true)
  const [error, setError] = useState(false)

  const findParticipations = () => {
    const executiveEvents = executives.flatMap(vote =>
      vote.timeLine
        .filter(tl => tl.type === VOTING_ACTION_ADD || tl.type === VOTING_ACTION_LOCK)
        .map(v => ({
          ...v,
          voter: v.sender,
        })),
    )
    const pollVotes = polls.flatMap(poll => poll.votes.map(p => ({ ...p })))
    return [...executiveEvents, ...pollVotes].some(e => e.voter === value)
  }
  const validateAddress = () => {
    setLoading(true)
    if (validateInputAddresses(value)) {
      const hasParticipations = findParticipations()
      if (!hasParticipations) {
        setFound(false)
        setError(false)
      } else {
        setError(false)
        setFound(true)
        history.push(`/voter/${value}`)
      }
    } else {
      setError(true)
    }
    setLoading(false)
  }
  return (
    <>
      <VotingHistoryContainer>
        <SearchField
          defaultValue={value}
          onChange={e => setValue(e.target.value)}
          placeholder={'Search by address...'}
        />
        <ButtonSearch disabled={value === ''} onClick={value !== '' ? validateAddress : undefined}>
          Search
        </ButtonSearch>
        <MessageContainer>
          {error && <Error />}
          {!found && <NotFound />}
          {loading && <Loading />}
        </MessageContainer>
      </VotingHistoryContainer>
    </>
  )
}

export default VotingHistoryDetails
