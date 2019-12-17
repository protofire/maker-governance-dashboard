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
  id: string
  countSpells: any
  hat: any | null
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
  countPolls: any
  countLock: any
  countFree: any
  countPolls: any
  locked: any
  lastBlock: any
  lastSynced: any
  hat: any | null
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

export interface GetPolls_polls_votes {
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
  /**
   *  Vote timestamp as seconds (time)
   */
  timestamp: any
}

export interface GetPolls_polls_timeLine_VotePollAction {
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
}

export interface GetPolls_polls_timeLine_CreatePollAction {
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

export interface GetPolls_polls_timeLine_WithdrawPollAction {
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

export type GetPolls_polls_timeLine =
  | GetPolls_polls_timeLine_VotePollAction
  | GetPolls_polls_timeLine_CreatePollAction
  | GetPolls_polls_timeLine_WithdrawPollAction

export interface GetPolls_polls {
  __typename: 'Poll'
  /**
   *  Equals to: <Poll ID>
   */
  id: string
  creator: any | null
  url: string | null
  pollId: any
  votes: GetPolls_polls_votes[] | null
  startDate: any
  endDate: any
  /**
   *  Number votes
   */
  votesCount: any
  /**
   *  Poll historical data
   */
  timeLine: GetPolls_polls_timeLine[] | null
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

export interface getHomeData_polls_votes {
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
  /**
   *  Vote timestamp as seconds (time)
   */
  timestamp: any
}

export interface getHomeData_polls_timeLine_VotePollAction {
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
}

export interface getHomeData_polls_timeLine_CreatePollAction {
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

export interface getHomeData_polls_timeLine_WithdrawPollAction {
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

export type getHomeData_polls_timeLine =
  | getHomeData_polls_timeLine_VotePollAction
  | getHomeData_polls_timeLine_CreatePollAction
  | getHomeData_polls_timeLine_WithdrawPollAction

export interface getHomeData_polls {
  __typename: 'Poll'
  /**
   *  Equals to: <Poll ID>
   */
  id: string
  creator: any | null
  url: string | null
  pollId: any
  votes: getHomeData_polls_votes[] | null
  startDate: any
  endDate: any
  /**
   *  Number votes
   */
  votesCount: any
  /**
   *  Poll historical data
   */
  timeLine: getHomeData_polls_timeLine[] | null
}

export interface getHomeData_executives_timeLine_AddAction {
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

export interface getHomeData_executives_timeLine_RemoveAction {
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

export interface getHomeData_executives_timeLine_LockAction {
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

export interface getHomeData_executives_timeLine_FreeAction {
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

export type getHomeData_executives_timeLine =
  | getHomeData_executives_timeLine_AddAction
  | getHomeData_executives_timeLine_RemoveAction
  | getHomeData_executives_timeLine_LockAction
  | getHomeData_executives_timeLine_FreeAction

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
  timeLine: getHomeData_executives_timeLine[] | null
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

export interface getHomeData {
  polls: getHomeData_polls[]
  executives: getHomeData_executives[]
  voters: getHomeData_voters[]
}

export interface getHomeDataVariables {
  voters: number
  executives: number
  polls: number
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
  countPolls: any
  hat: any | null
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
  id: string
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

export interface GetSpell_spells {
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
  spells: GetSpell_spells[]
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetGovernanceInfoVote
// ====================================================

export interface GetGovernanceInfoVote_governanceInfo {
  __typename: 'GovernanceInfo'
  id: string
  hat: any | null
}

export interface GetGovernanceInfoVote {
  governanceInfo: GetGovernanceInfoVote_governanceInfo | null
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
// GraphQL query operation: GetGovernanceInfoHistory
// ====================================================

export interface GetGovernanceInfoHistory_governanceInfo {
  __typename: 'GovernanceInfo'
  id: string
  countProxies: any
  countAddresses: any
  countSlates: any
  countSpells: any
  countPolls: any
  hat: any | null
}

export interface GetGovernanceInfoHistory {
  governanceInfo: GetGovernanceInfoHistory_governanceInfo | null
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getHistoryData
// ====================================================

export interface getHistoryData_polls_votes {
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
  /**
   *  Vote timestamp as seconds (time)
   */
  timestamp: any
}

export interface getHistoryData_polls_timeLine_VotePollAction {
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
}

export interface getHistoryData_polls_timeLine_CreatePollAction {
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

export interface getHistoryData_polls_timeLine_WithdrawPollAction {
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

export type getHistoryData_polls_timeLine =
  | getHistoryData_polls_timeLine_VotePollAction
  | getHistoryData_polls_timeLine_CreatePollAction
  | getHistoryData_polls_timeLine_WithdrawPollAction

export interface getHistoryData_polls {
  __typename: 'Poll'
  /**
   *  Equals to: <Poll ID>
   */
  id: string
  creator: any | null
  url: string | null
  pollId: any
  votes: getHistoryData_polls_votes[] | null
  startDate: any
  endDate: any
  /**
   *  Number votes
   */
  votesCount: any
  /**
   *  Poll historical data
   */
  timeLine: getHistoryData_polls_timeLine[] | null
}

export interface getHistoryData_executives_timeLine_AddAction {
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

export interface getHistoryData_executives_timeLine_RemoveAction {
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

export interface getHistoryData_executives_timeLine_LockAction {
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

export interface getHistoryData_executives_timeLine_FreeAction {
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

export type getHistoryData_executives_timeLine =
  | getHistoryData_executives_timeLine_AddAction
  | getHistoryData_executives_timeLine_RemoveAction
  | getHistoryData_executives_timeLine_LockAction
  | getHistoryData_executives_timeLine_FreeAction

export interface getHistoryData_executives {
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
  timeLine: getHistoryData_executives_timeLine[] | null
}

export interface getHistoryData {
  polls: getHistoryData_polls[]
  executives: getHistoryData_executives[]
}

export interface getHistoryDataVariables {
  executives: number
  polls: number
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
  countPolls: any
  hat: any | null
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

export interface executivesDetail_timeLine_AddAction {
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

export interface executivesDetail_timeLine_RemoveAction {
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

export interface executivesDetail_timeLine_LockAction {
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

export interface executivesDetail_timeLine_FreeAction {
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

export type executivesDetail_timeLine =
  | executivesDetail_timeLine_AddAction
  | executivesDetail_timeLine_RemoveAction
  | executivesDetail_timeLine_LockAction
  | executivesDetail_timeLine_FreeAction

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
  timeLine: executivesDetail_timeLine[] | null
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: pollsDetail
// ====================================================

export interface pollsDetail_votes {
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
  /**
   *  Vote timestamp as seconds (time)
   */
  timestamp: any
}

export interface pollsDetail_timeLine_VotePollAction {
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
}

export interface pollsDetail_timeLine_CreatePollAction {
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

export interface pollsDetail_timeLine_WithdrawPollAction {
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

export type pollsDetail_timeLine =
  | pollsDetail_timeLine_VotePollAction
  | pollsDetail_timeLine_CreatePollAction
  | pollsDetail_timeLine_WithdrawPollAction

export interface pollsDetail {
  __typename: 'Poll'
  /**
   *  Equals to: <Poll ID>
   */
  id: string
  creator: any | null
  url: string | null
  pollId: any
  votes: pollsDetail_votes[] | null
  startDate: any
  endDate: any
  /**
   *  Number votes
   */
  votesCount: any
  /**
   *  Poll historical data
   */
  timeLine: pollsDetail_timeLine[] | null
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
