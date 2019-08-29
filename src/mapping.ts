import { log } from '@graphprotocol/graph-ts'

import { LinkConfirmed as LinkConfirmedEvent } from '../generated/VoteProxyFactory/VoteProxyFactory'
import { LogNote } from '../generated/DSChief/DSChief'
import { VoteProxy, VoterRegistry, GovernanceInfo, Action } from '../generated/schema'

import { BIGDECIMAL_ZERO, BIGINT_ONE, BIGINT_ZERO, toBigDecimal } from './helpers'

export function handleLinkConfirmed(event: LinkConfirmedEvent): void {
  let voteRegistry = new VoterRegistry(
    event.transaction.hash.toHex() + '-' + event.logIndex.toString(),
  )
  voteRegistry.coldAddress = event.params.cold
  voteRegistry.hotAddress = event.params.hot
  voteRegistry.save()

  let voteProxy = new VoteProxy(event.params.voteProxy.toHex())
  voteProxy.owner = voteRegistry.id
  voteProxy.timestamp = event.block.timestamp
  voteProxy.address = event.params.voteProxy
  voteProxy.locked = BIGDECIMAL_ZERO
  voteProxy.save()

  let governanceInfo = getGovernanceInfoEntity()
  governanceInfo.countVoters = governanceInfo.countVoters.plus(BIGINT_ONE)
  governanceInfo.save()
}

export function handleLock(event: LogNote): void {
  let voteProxyId = event.params.guy.toHex()

  let voteProxy = VoteProxy.load(voteProxyId)
  if (voteProxy == null) {
    log.error('handleLock: VoteProxy with id {} not found.', [voteProxyId])
    return
  }
  let locked = toBigDecimal(event.params.foo)
  voteProxy.locked = voteProxy.locked.plus(locked)
  voteProxy.save()

  let governanceInfo = getGovernanceInfoEntity()
  governanceInfo.locked = governanceInfo.locked.plus(locked)
  governanceInfo.lastBlock = event.block.number
  governanceInfo.save()

  let action = new Action(
    event.transaction.hash.toHex() + '-' + event.logIndex.toString(),
  )
  action.type = 'LOCK'
  action.sender = event.params.guy
  action.wad = locked
  action.transactionHash = event.transaction.hash;
  action.timestamp = event.block.timestamp
  action.save()
}

export function handleFree(event: LogNote): void {
  let voteProxyId = event.params.guy.toHex()

  let voteProxy = VoteProxy.load(voteProxyId)
  if (voteProxy == null) {
    log.error('handleLock: VoteProxy with id {} not found.', [voteProxyId])
    return
  }
  let free = toBigDecimal(event.params.foo)
  voteProxy.locked = voteProxy.locked.minus(free)
  voteProxy.save()

  let governanceInfo = getGovernanceInfoEntity()
  governanceInfo.locked = governanceInfo.locked.minus(free)
  governanceInfo.lastBlock = event.block.number
  governanceInfo.save()

  let action = new Action(
    event.transaction.hash.toHex() + '-' + event.logIndex.toString(),
  )
  action.type = 'FREE'
  action.sender = event.params.guy
  action.wad = free
  action.transactionHash = event.transaction.hash;
  action.timestamp = event.block.timestamp
  action.save()
}

function getGovernanceInfoEntity(): GovernanceInfo {
  let id = '0x0'
  let entity = GovernanceInfo.load(id)

  if (entity == null) {
    entity = new GovernanceInfo(id)
    entity.countVoters = BIGINT_ZERO
    entity.locked = BIGDECIMAL_ZERO
    entity.lastBlock = BIGINT_ZERO
  }

  return entity as GovernanceInfo
}
