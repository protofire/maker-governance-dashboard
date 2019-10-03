import { request } from 'graphql-request'
import { BigNumber } from 'bignumber.js'

const GOVERNANCE_API_URI = process.env.REACT_APP_GRAPH_HTTP
const TOKEN_REGISTRY_API_URI = process.env.REACT_APP_TOKEN_REGISTRY_GRAPH_HTTP

const query = `
  query {
  }

  `
const fetchQuery = (url, query) => request(url, query)

const getPollVotersPerOption = data => {
  return data.poll.votes.reduce((acum, el) => {
    const option = acum[el.option] || []
    return {
      ...acum,
      [el.option]: [...option, el.voter],
    }
  }, {})
}

const getVoterRegistries = addresses => {
  //Queries
  return []
  //return [...voterRegistriesHot.voterRegistries, ...voterRegistriesCold.voterRegistries]
}

const getVoterAddresses = poll => {
  const pollVoters = getPollVotersPerOption(poll)
  return Object.keys(pollVoters).flatMap(option => pollVoters[option])
}

const getVoteProxies = poll => {
  const addresses = getVoterAddresses(poll)
  const all = getVoterRegistries(addresses)
  return Array.from(new Set(all.flatMap((el: any) => el.voteProxies.flatMap(p => p.id))))
}

const stakedByAddress = data => {
  const result = [...data.free, ...data.lock].reduce((acc, el) => {
    let current = acc[el.sender] || new BigNumber('0')
    current = el.type === 'FREE' ? current.minus(new BigNumber(el.wad)) : current.plus(new BigNumber(el.wad))
    return {
      ...acc,
      [el.sender]: current,
    }
  }, {})

  return result
}

const getStakedByProxies = addresses => {
  //Queries
  return []
  //return stakedByProxies
}

const getStakedByVoters = addresses => {
  //Queries
  return []
  //return stakedByVotes
}

export const getPollData = poll => {
  const stakedProxies = stakedByAddress(getStakedByProxies(getVoteProxies(poll)))
  const stakedVoters = stakedByAddress(getStakedByVoters(getVoterAddresses(poll)))

  const hotCold = Array.from(
    new Set(getVoterRegistries(getVoterAddresses(poll)).flatMap((el: any) => [el.coldAddress, el.hotAddress])),
  )

  const votersHotCold = Array.from(new Set([...getVoterAddresses(poll), ...hotCold]))

  const balances = getBalanceByAccount(getAccountBalances(votersHotCold))

  const voterTotal = Object.keys(stakedVoters).reduce((acc, key) => {
    const amount = stakedVoters[key].plus(new BigNumber(balances[key])).toString()

    return {
      ...acc,
      [key]: amount,
    }
  }, {})

  const lookup = getLookup(poll)

  const stakedTotal = totalStaked(poll, lookup, balances, stakedProxies)

  console.log(
    Array.from(new Set([...Object.keys(stakedTotal), ...Object.keys(voterTotal)])).reduce((acc, key) => {
      const sv = stakedVoters[key] || new BigNumber('0')
      const vt = new BigNumber(voterTotal[key]) || new BigNumber('0')
      const amount = sv.plus(vt)

      return {
        ...acc,
        [key]: amount,
      }
    }, {}),
  )
}

const getAccountBalances = address => {
  // Query
  return []
  //return accountBalances
}

const getBalanceByAccount = balances => {
  return balances.accountBalanceSnapshots.reduce((acc, el) => {
    const first = acc[el.account.address] || el.amount
    return {
      ...acc,
      [el.account.address]: first,
    }
  }, {})
}

const getLookup = poll => {
  const addresses = getVoterAddresses(poll) // voters
  const all = getVoterRegistries(addresses) // registr

  return addresses.reduce((acc, addr) => {
    const reges = all.reduce((acc: any, reg: any) => {
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

// total staked proxy + balance hot + balance cold
const totalStaked = (poll, lookup, balances, stakedProxies) =>
  getVoterAddresses(poll).reduce((acc, voter) => {
    const amount = lookup[voter].reduce((acc, reg) => {
      const cold = reg.cold
      const hot = reg.hot
      const proxies = reg.proxy

      const proxyAmount = proxies.reduce((acc, p) => acc.plus(stakedProxies[p]), new BigNumber('0'))
      return acc.plus(proxyAmount.plus(balances[cold]).plus(balances[hot]))
    }, new BigNumber('0'))

    return {
      ...acc,
      [voter]: amount,
    }
  }, {})
