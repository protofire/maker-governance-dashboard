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
  id: string
  creator: any | null
  url: string | null
  pollId: any
  startDate: any
  endDate: any
}

export interface getHomeData_voters {
  __typename: 'Action'
  id: string
  /**
   *  Action timestamp as seconds (time)
   */
  timestamp: any
}

export interface getHomeData {
  polls: getHomeData_polls[]
  voters: getHomeData_voters[]
}

export interface getHomeDataVariables {
  voters: number
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
// GraphQL fragment: MakerGovernanceDetail
// ====================================================

export interface MakerGovernanceDetail {
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
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: pollsDetail
// ====================================================

export interface pollsDetail {
  __typename: 'Poll'
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

//==============================================================
// START Enums and Input Objects
//==============================================================

//==============================================================
// END Enums and Input Objects
//==============================================================
