/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetGovernanceInfo
// ====================================================

export interface GetGovernanceInfo_governanceInfo {
  __typename: 'GovernanceInfo'
  id: string
  countVoters: any
  locked: any
  lastBlock: any
}

export interface GetGovernanceInfo {
  governanceInfo: GetGovernanceInfo_governanceInfo | null
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetPollVotes
// ====================================================

export interface GetPollVotes_pollVotes {
  __typename: 'PollVote'
  id: string
  creator: any | null
  pollId: any
  startDate: any
  endDate: any
}

export interface GetPollVotes {
  pollVotes: GetPollVotes_pollVotes[]
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: GovernanceInfo
// ====================================================

export interface GovernanceInfo_governanceInfo {
  __typename: 'GovernanceInfo'
  id: string
  countVoters: any
  locked: any
  lastBlock: any
}

export interface GovernanceInfo {
  governanceInfo: GovernanceInfo_governanceInfo | null
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: MakerGovernanceDetail
// ====================================================

export interface MakerGovernanceDetail {
  __typename: 'GovernanceInfo'
  id: string
  countVoters: any
  locked: any
  lastBlock: any
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: pollVoteDetail
// ====================================================

export interface pollVoteDetail {
  __typename: 'PollVote'
  id: string
  creator: any | null
  pollId: any
  startDate: any
  endDate: any
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

//==============================================================
// END Enums and Input Objects
//==============================================================
