import { BigNumber } from 'bignumber.js'
import { getPollVotersRegistries, getStakedByPoll, stakedByAddress, msToSeconds, getVotersSnapshots } from '../../utils'

export const getPollVotersPerOption = poll => {
  return poll.votes.reduce((acum, el) => {
    const option = acum[el.option] || []
    return {
      ...acum,
      [el.option]: [...option, el.voter],
    }
  }, {})
}

export const getVoterAddresses = poll => {
  const pollVoters = getPollVotersPerOption(poll)
  return Object.keys(pollVoters).flatMap(option => pollVoters[option])
}

export const getVoteProxies = registries => {
  return Array.from(new Set(registries.flatMap((el: any) => el.voteProxies.flatMap(p => p.id))))
}

export const getPollDataWithoutBalances = async poll => {
  const votersAddresses = getVoterAddresses(poll)
  const voteRegistries = await getPollVotersRegistries(poll)
  const voteProxies = getVoteProxies(voteRegistries)

  const stakeByPoll = await getStakedByPoll(voteProxies, votersAddresses, poll)
  const stakedProxies = stakedByAddress(stakeByPoll.proxies)
  const stakedVoters = stakedByAddress(stakeByPoll.voters)

  const hotCold = Array.from(new Set(voteRegistries.flatMap((el: any) => [el.coldAddress, el.hotAddress])))
  const votersHotCold = Array.from(new Set([...votersAddresses, ...hotCold]))
  const balances = getBalanceByAccount(await getVotersSnapshots(votersHotCold), msToSeconds(poll.endDate))

  const stakedVotersAndBalances = votersHotCold.reduce((acc, key) => {
    const staked = stakedVoters[key] || ZERO
    const balance = balances[key] ? new BigNumber(balances[key]) : ZERO
    const amount = staked.plus(balance).toString()

    return {
      ...acc,
      [key]: amount,
    }
  }, {})

  const lookup = getLookup(votersAddresses, voteRegistries)
  const stakedTotal = totalStaked(poll, lookup, balances, stakedProxies)

  const mkrVoter = Array.from(new Set([...Object.keys(stakedTotal), ...Object.keys(stakedVotersAndBalances)])).reduce(
    (acc, key) => {
      const st = stakedTotal[key] || new BigNumber('0')
      const vt = stakedVotersAndBalances[key] ? new BigNumber(stakedVotersAndBalances[key]) : new BigNumber('0')
      const amount = st.plus(vt)

      return {
        ...acc,
        [key]: amount,
      }
    },
    {},
  )

  const votersPerOption = getPollVotersPerOption(poll)
  const mkrOptions = Object.keys(votersPerOption).reduce((acc, op) => {
    const voters = votersPerOption[op]
    const total = voters.reduce((acc, v) => {
      return acc.plus(mkrVoter[v])
    }, new BigNumber('0'))

    return {
      ...acc,
      [op]: total.toNumber().toFixed(2),
    }
  }, {})

  const ret = poll.options.map((key, i) => {
    return {
      label: key,
      mkr: mkrOptions[i + 1] || 0,
      voter: votersPerOption[i + 1] ? votersPerOption[i + 1].length : 0,
    }
  })
  return ret
}

const getBalanceByAccount = (balances, endDate) => {
  return balances.reduce((acc, accountSnapshots) => {
    const lastSnapshot = accountSnapshots.find(snapshot => snapshot.timestamp <= endDate)

    if (lastSnapshot) {
      return {
        ...acc,
        [lastSnapshot.account.address]: lastSnapshot.amount,
      }
    } else {
      return acc
    }
  }, {})
}

export const getLookup = (addresses, registries) => {
  return addresses.reduce((acc, addr) => {
    const reges = registries.reduce((acc: any, reg: any) => {
      if (addr === reg.coldAddress || addr === reg.hotAddress) {
        return [
          ...acc,
          {
            cold: reg.coldAddress,
            hot: reg.hotAddress,
            proxy: reg.voteProxies.flatMap(p => p.id),
          },
        ]
      } else {
        return acc
      }
    }, [])

    return {
      ...acc,
      [addr]: reges,
    }
  }, {})
}

export const ZERO = new BigNumber('0')
// total staked proxy + balance hot + balance cold
export const totalStaked = (poll, lookup, balances, stakedProxies) => {
  let addedColHotByVoter: any = {}

  return getVoterAddresses(poll).reduce((acc, voter) => {
    const amount = lookup[voter].reduce((acc, reg) => {
      const cold = reg.cold
      const hot = reg.hot
      const proxies = reg.proxy

      const proxyAmount = proxies.reduce((acc, p) => {
        const balance = stakedProxies[p] || ZERO
        return acc.plus(balance)
      }, ZERO)

      if (!addedColHotByVoter[voter]) {
        const hotBalance = balances[hot] || ZERO
        const coldBalance = hot !== cold ? balances[cold] || ZERO : ZERO

        addedColHotByVoter[voter] = true
        return acc.plus(proxyAmount.plus(hotBalance).plus(coldBalance))
      }
      return acc.plus(proxyAmount)
    }, new BigNumber('0'))

    return {
      ...acc,
      [voter]: amount,
    }
  }, {})
}
