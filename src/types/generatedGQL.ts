/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetGovernanceInfoApp
// ====================================================

export interface GetGovernanceInfoApp_governanceInfo {
  __typename: 'GovernanceInfo'
  lastSynced: any
}

export interface GetGovernanceInfoApp {
  governanceInfo: GetGovernanceInfoApp_governanceInfo | null
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetExecutiveVotesInfo
// ====================================================

export interface GetExecutiveVotesInfo_governanceInfo {
  __typename: 'GovernanceInfo'
  countSpells: any
  hat: any
  active: any | null
}

export interface GetExecutiveVotesInfo {
  governanceInfo: GetExecutiveVotesInfo_governanceInfo | null
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetExecutivesVotesData
// ====================================================

export interface GetExecutivesVotesData_spells {
  __typename: 'Spell'
  /**
   *  ID represent the contract address
   */
  id: string
  /**
   *  Timestamp when the spell was voted by the first time
   */
  timestamp: any
  /**
   *  Timestamp when the spell is casted
   */
  casted: any | null
  /**
   *  How much MKR it has when the spell is casted
   */
  castedWith: any | null
  /**
   *  Timestamp when the spell is casted
   */
  lifted: any | null
  /**
   *  How much MKR it has when the spell is lifted to hat
   */
  liftedWith: any | null
  /**
   *  Total MKR supporting this spell
   */
  approvals: any
}

export interface GetExecutivesVotesData {
  spells: GetExecutivesVotesData_spells[]
}

export interface GetExecutivesVotesDataVariables {
  executives: number
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetGovernanceInfo
// ====================================================

export interface GetGovernanceInfo_governanceInfo {
  __typename: 'GovernanceInfo'
  id: string
  countProxies: any
  countAddresses: any
  countSlates: any
  countSpells: any
  countLock: any
  countFree: any
  countPolls: any
  locked: any
  lastBlock: any
  lastSynced: any
  hat: any
}

export interface GetGovernanceInfo {
  governanceInfo: GetGovernanceInfo_governanceInfo | null
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetPolls
// ====================================================

export interface GetPolls_polls {
  __typename: 'Poll'
  /**
   *  Equals to: <Poll ID>
   */
  id: string
  creator: any | null
  url: string | null
  pollId: any
  startDate: any
  endDate: any
}

export interface GetPolls {
  polls: GetPolls_polls[]
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getHomeData
// ====================================================

export interface getHomeData_polls {
  __typename: 'Poll'
  /**
   *  Equals to: <Poll ID>
   */
  id: string
  creator: any | null
  url: string | null
  pollId: any
  startDate: any
  endDate: any
}

export interface getHomeData_executives {
  __typename: 'Spell'
  /**
   *  ID represent the contract address
   */
  id: string
  /**
   *  Timestamp when the spell was voted by the first time
   */
  timestamp: any
  /**
   *  Total MKR supporting this spell
   */
  approvals: any
  /**
   *  Timestamp when the spell is casted
   */
  casted: any | null
  /**
   *  How much MKR it has when the spell is casted
   */
  castedWith: any | null
  /**
   *  Timestamp when the spell is casted
   */
  lifted: any | null
  /**
   *  How much MKR it has when the spell is lifted to hat
   */
  liftedWith: any | null
}

export interface getHomeData_voters {
  __typename: 'Action'
  id: string
  /**
   *  Action timestamp as seconds (time)
   */
  timestamp: any
  /**
   *  Action value (arg)
   */
  wad: any | null
  /**
   *  Action name (act)
   */
  type: ActionType
}

export interface getHomeData_lock {
  __typename: 'Action'
  id: string
  /**
   *  Action timestamp as seconds (time)
   */
  timestamp: any
  /**
   *  Action value (arg)
   */
  wad: any | null
  /**
   *  Action name (act)
   */
  type: ActionType
  sender: any
}

export interface getHomeData_free {
  __typename: 'Action'
  id: string
  /**
   *  Action timestamp as seconds (time)
   */
  timestamp: any
  /**
   *  Action value (arg)
   */
  wad: any | null
  /**
   *  Action name (act)
   */
  type: ActionType
  sender: any
}

export interface getHomeData {
  polls: getHomeData_polls[]
  executives: getHomeData_executives[]
  voters: getHomeData_voters[]
  lock: getHomeData_lock[]
  free: getHomeData_free[]
}

export interface getHomeDataVariables {
  voters: number
  executives: number
  polls: number
  lock: number
  free: number
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
  countProxies: any
  countAddresses: any
  countSlates: any
  countSpells: any
  countLock: any
  countFree: any
  countPolls: any
  locked: any
  lastBlock: any
  lastSynced: any
  hat: any
}

export interface GovernanceInfo {
  governanceInfo: GovernanceInfo_governanceInfo | null
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetPollsInfoPage
// ====================================================

export interface GetPollsInfoPage_governanceInfo {
  __typename: 'GovernanceInfo'
  countPolls: any
}

export interface GetPollsInfoPage {
  governanceInfo: GetPollsInfoPage_governanceInfo | null
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetPollsDataPage
// ====================================================

export interface GetPollsDataPage_poll_votes {
  __typename: 'PollVote'
  /**
   *  Equals to: <Poll ID>-<Voter's Address>
   */
  id: string
  /**
   *  Voters's Address
   */
  voter: any
  /**
   *  Selected option
   */
  option: any
}

export interface GetPollsDataPage_poll_timeLine_VotePollAction {
  __typename: 'VotePollAction'
  /**
   *  Equals to: <VOTE>-<transactionHash>-<voter>
   */
  id: string
  /**
   *  Action timestamp as seconds (time)
   */
  timestamp: any
  /**
   *  Voter's Address
   */
  sender: any
  /**
   *  Selected option
   */
  option: any
}

export interface GetPollsDataPage_poll_timeLine_CreatePollAction {
  __typename: 'CreatePollAction'
  /**
   *  Equals to: <CREATE>-<transactionHash>-<creator>
   */
  id: string
  /**
   *  Action timestamp as seconds (time)
   */
  timestamp: any
  /**
   *  Block number
   */
  block: any
}

export interface GetPollsDataPage_poll_timeLine_WithdrawPollAction {
  __typename: 'WithdrawPollAction'
  /**
   *  Equals to: <WITHDRAW>-<transactionHash>-<voter>
   */
  id: string
  /**
   *  Action timestamp as seconds (time)
   */
  timestamp: any
  /**
   *  Block number
   */
  block: any
}

export type GetPollsDataPage_poll_timeLine =
  | GetPollsDataPage_poll_timeLine_VotePollAction
  | GetPollsDataPage_poll_timeLine_CreatePollAction
  | GetPollsDataPage_poll_timeLine_WithdrawPollAction

export interface GetPollsDataPage_poll {
  __typename: 'Poll'
  /**
   *  Equals to: <Poll ID>
   */
  id: string
  creator: any | null
  url: string | null
  pollId: any
  startDate: any
  /**
   *  Number of record in timeLine
   */
  timeLineCount: any
  endDate: any
  /**
   *  Number votes
   */
  votesCount: any
  votes: GetPollsDataPage_poll_votes[] | null
  /**
   *  Poll historical data
   */
  timeLine: GetPollsDataPage_poll_timeLine[] | null
}

export interface GetPollsDataPage {
  poll: GetPollsDataPage_poll | null
}

export interface GetPollsDataPageVariables {
  id: string
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetPollsInfo
// ====================================================

export interface GetPollsInfo_governanceInfo {
  __typename: 'GovernanceInfo'
  countPolls: any
}

export interface GetPollsInfo {
  governanceInfo: GetPollsInfo_governanceInfo | null
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetPollsData
// ====================================================

export interface GetPollsData_polls_votes {
  __typename: 'PollVote'
  /**
   *  Voters's Address
   */
  voter: any
  /**
   *  Selected option
   */
  option: any
}

export interface GetPollsData_polls {
  __typename: 'Poll'
  /**
   *  Equals to: <Poll ID>
   */
  id: string
  creator: any | null
  url: string | null
  pollId: any
  startDate: any
  endDate: any
  /**
   *  Number votes
   */
  votesCount: any
  votes: GetPollsData_polls_votes[] | null
}

export interface GetPollsData {
  polls: GetPollsData_polls[]
}

export interface GetPollsDataVariables {
  polls: number
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetSpell
// ====================================================

export interface GetSpell_spell {
  __typename: 'Spell'
  /**
   *  ID represent the contract address
   */
  id: string
  /**
   *  Timestamp when the spell was voted by the first time
   */
  timestamp: any
  /**
   *  Timestamp when the spell is casted
   */
  casted: any | null
  /**
   *  How much MKR it has when the spell is casted
   */
  castedWith: any | null
  /**
   *  Timestamp when the spell is casted
   */
  lifted: any | null
  /**
   *  How much MKR it has when the spell is lifted to hat
   */
  liftedWith: any | null
  /**
   *  Total MKR supporting this spell
   */
  approvals: any
  timeLineCount: any
  /**
   *  Total voters supporting this spell
   */
  totalVotes: any | null
}

export interface GetSpell {
  spell: GetSpell_spell | null
}

export interface GetSpellVariables {
  id: string
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetVotingActions
// ====================================================

export interface GetVotingActions_spell_timeLine_AddAction {
  __typename: 'AddAction'
  /**
   *  Equals to: <ADD | ADD-ARRAY>-<transactionHash>-<logIndex>
   */
  id: string
  /**
   *  Action timestamp as seconds (time)
   */
  timestamp: any
  /**
   *  Transaction hash (tx)
   */
  transactionHash: any
  /**
   *  Voter's Address
   */
  sender: any
  /**
   *  Amount of loked MKR the sender had at the moment this action is performed
   */
  locked: any
}

export interface GetVotingActions_spell_timeLine_RemoveAction {
  __typename: 'RemoveAction'
  /**
   *  Equals to: <REMOVE | REMOVE-ARRAY>-<transactionHash>-<logIndex>
   */
  id: string
  /**
   *  Action timestamp as seconds (time)
   */
  timestamp: any
  /**
   *  Transaction hash (tx)
   */
  transactionHash: any
  /**
   *  Voter's Address
   */
  sender: any
  /**
   *  Amount of loked MKR the sender had at the moment this action is performed
   */
  locked: any
}

export interface GetVotingActions_spell_timeLine_LockAction {
  __typename: 'LockAction'
  /**
   *  Equals to: <LOCK>-<transactionHash>-<logIndex>
   */
  id: string
  /**
   *  Action timestamp as seconds (time)
   */
  timestamp: any
  /**
   *  Transaction hash (tx)
   */
  transactionHash: any
  /**
   *  Voter's Address
   */
  sender: any
  /**
   *  Amount of MKR locked or withdrawn
   */
  wad: any
}

export interface GetVotingActions_spell_timeLine_FreeAction {
  __typename: 'FreeAction'
  /**
   *  Equals to: <FREE>-<transactionHash>-<logIndex>
   */
  id: string
  /**
   *  Action timestamp as seconds (time)
   */
  timestamp: any
  /**
   *  Transaction hash (tx)
   */
  transactionHash: any
  /**
   *  Voter's Address
   */
  sender: any
  /**
   *  Amount of MKR locked or withdrawn
   */
  wad: any
}

export type GetVotingActions_spell_timeLine =
  | GetVotingActions_spell_timeLine_AddAction
  | GetVotingActions_spell_timeLine_RemoveAction
  | GetVotingActions_spell_timeLine_LockAction
  | GetVotingActions_spell_timeLine_FreeAction

export interface GetVotingActions_spell {
  __typename: 'Spell'
  /**
   *  ID represent the contract address
   */
  id: string
  timeLine: GetVotingActions_spell_timeLine[] | null
}

export interface GetVotingActions {
  spell: GetVotingActions_spell | null
}

export interface GetVotingActionsVariables {
  id: string
  timeLineCount?: number | null
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: executivesDetailPage
// ====================================================

export interface executivesDetailPage {
  __typename: 'Spell'
  /**
   *  ID represent the contract address
   */
  id: string
  /**
   *  Timestamp when the spell was voted by the first time
   */
  timestamp: any
  /**
   *  Timestamp when the spell is casted
   */
  casted: any | null
  /**
   *  How much MKR it has when the spell is casted
   */
  castedWith: any | null
  /**
   *  Timestamp when the spell is casted
   */
  lifted: any | null
  /**
   *  How much MKR it has when the spell is lifted to hat
   */
  liftedWith: any | null
  /**
   *  Total MKR supporting this spell
   */
  approvals: any
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: makerGovernanceDetail
// ====================================================

export interface makerGovernanceDetail {
  __typename: 'GovernanceInfo'
  id: string
  countProxies: any
  countAddresses: any
  countSlates: any
  countSpells: any
  countLock: any
  countFree: any
  countPolls: any
  locked: any
  lastBlock: any
  lastSynced: any
  hat: any
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: actionsDetail
// ====================================================

export interface actionsDetail {
  __typename: 'Action'
  id: string
  /**
   *  Action timestamp as seconds (time)
   */
  timestamp: any
  /**
   *  Action value (arg)
   */
  wad: any | null
  /**
   *  Action name (act)
   */
  type: ActionType
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: executivesDetail
// ====================================================

export interface executivesDetail {
  __typename: 'Spell'
  /**
   *  ID represent the contract address
   */
  id: string
  /**
   *  Timestamp when the spell was voted by the first time
   */
  timestamp: any
  /**
   *  Total MKR supporting this spell
   */
  approvals: any
  /**
   *  Timestamp when the spell is casted
   */
  casted: any | null
  /**
   *  How much MKR it has when the spell is casted
   */
  castedWith: any | null
  /**
   *  Timestamp when the spell is casted
   */
  lifted: any | null
  /**
   *  How much MKR it has when the spell is lifted to hat
   */
  liftedWith: any | null
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: pollsDetail
// ====================================================

export interface pollsDetail {
  __typename: 'Poll'
  /**
   *  Equals to: <Poll ID>
   */
  id: string
  creator: any | null
  url: string | null
  pollId: any
  startDate: any
  endDate: any
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: pollsDetailPage
// ====================================================

export interface pollsDetailPage_votes {
  __typename: 'PollVote'
  /**
   *  Equals to: <Poll ID>-<Voter's Address>
   */
  id: string
  /**
   *  Voters's Address
   */
  voter: any
  /**
   *  Selected option
   */
  option: any
}

export interface pollsDetailPage_timeLine_VotePollAction {
  __typename: 'VotePollAction'
  /**
   *  Equals to: <VOTE>-<transactionHash>-<voter>
   */
  id: string
  /**
   *  Action timestamp as seconds (time)
   */
  timestamp: any
  /**
   *  Voter's Address
   */
  sender: any
  /**
   *  Selected option
   */
  option: any
}

export interface pollsDetailPage_timeLine_CreatePollAction {
  __typename: 'CreatePollAction'
  /**
   *  Equals to: <CREATE>-<transactionHash>-<creator>
   */
  id: string
  /**
   *  Action timestamp as seconds (time)
   */
  timestamp: any
  /**
   *  Block number
   */
  block: any
}

export interface pollsDetailPage_timeLine_WithdrawPollAction {
  __typename: 'WithdrawPollAction'
  /**
   *  Equals to: <WITHDRAW>-<transactionHash>-<voter>
   */
  id: string
  /**
   *  Action timestamp as seconds (time)
   */
  timestamp: any
  /**
   *  Block number
   */
  block: any
}

export type pollsDetailPage_timeLine =
  | pollsDetailPage_timeLine_VotePollAction
  | pollsDetailPage_timeLine_CreatePollAction
  | pollsDetailPage_timeLine_WithdrawPollAction

export interface pollsDetailPage {
  __typename: 'Poll'
  /**
   *  Equals to: <Poll ID>
   */
  id: string
  creator: any | null
  url: string | null
  pollId: any
  startDate: any
  /**
   *  Number of record in timeLine
   */
  timeLineCount: any
  endDate: any
  /**
   *  Number votes
   */
  votesCount: any
  votes: pollsDetailPage_votes[] | null
  /**
   *  Poll historical data
   */
  timeLine: pollsDetailPage_timeLine[] | null
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: pollsDetailTotal
// ====================================================

export interface pollsDetailTotal_votes {
  __typename: 'PollVote'
  /**
   *  Voters's Address
   */
  voter: any
  /**
   *  Selected option
   */
  option: any
}

export interface pollsDetailTotal {
  __typename: 'Poll'
  /**
   *  Equals to: <Poll ID>
   */
  id: string
  creator: any | null
  url: string | null
  pollId: any
  startDate: any
  endDate: any
  /**
   *  Number votes
   */
  votesCount: any
  votes: pollsDetailTotal_votes[] | null
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum ActionType {
  CAST = 'CAST',
  ETCH = 'ETCH',
  FREE = 'FREE',
  LIFT = 'LIFT',
  LOCK = 'LOCK',
  POLL_CREATED = 'POLL_CREATED',
  VOTE = 'VOTE',
  VOTER = 'VOTER',
}

//==============================================================
// END Enums and Input Objects
//==============================================================
