import { request } from 'graphql-request'
import { BigNumber } from 'bignumber.js'

const GOVERNANCE_API_URI = process.env.REACT_APP_GRAPH_HTTP
const TOKEN_REGISTRY_API_URI = process.env.REACT_APP_TOKEN_REGISTRY_GRAPH_HTTP

const query = `
  query {
  }

  `
const fetchQuery = (url, query, variables) => request(url, query, variables)

const getPollVotersPerOption = poll => {
  return poll.votes.reduce((acum, el) => {
    const option = acum[el.option] || []
    return {
      ...acum,
      [el.option]: [...option, el.voter],
    }
  }, {})
}

const getVoterRegistries = async (addresses, endDate) => {
  //Queries
  const query = `
    query getVoterRegistries($voters: [Bytes!]!, $endDate: BigInt!  ){
      hot: voterRegistries(first: 1000, where: {hotAddress_in: $voters, timestamp_lte: $endDate}) {
        id
        coldAddress
        hotAddress
        voteProxies {
          id
        }
      }
      cold: voterRegistries(first: 100, where: {coldAddress_in: $voters, timestamp_lte: $endDate}) {
        id
        coldAddress
        hotAddress
        voteProxies {
          id
        }
      }
    }
  `
  const result: any = await fetchQuery(GOVERNANCE_API_URI, query, {
    voters: addresses,
    endDate,
  })

  return [...result.cold, ...result.hot]
}

const getVoterAddresses = poll => {
  const pollVoters = getPollVotersPerOption(poll)
  return Object.keys(pollVoters).flatMap(option => pollVoters[option])
}

const getVoteProxies = registries => {
  return Array.from(new Set(registries.flatMap((el: any) => el.voteProxies.flatMap(p => p.id))))
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

const getStakedByAddress = async (addresses, endDate) => {
  //Queries
  console.log('addresses', addresses)

  const query = `
    query getStakedByAddress($voters: [Bytes!]!, $endDate: BigInt!  ) {
      lock: actions(first: 1000, where: {type: LOCK, sender_in: $voters, timestamp_lte: $endDate}) {
        sender
        type
        wad
      }
      free: actions(first: 1000, where: {type: FREE, sender_in: $voters, timestamp_lte: $endDate}) {
        sender
        type
        wad
      }
    }
  `
  const result: any = await fetchQuery(GOVERNANCE_API_URI, query, {
    voters: addresses,
    endDate,
  })

  return result
}

export const getPollData = async poll => {
  const votersAddresses = getVoterAddresses(poll)
  const voteRegistries = await getVoterRegistries(votersAddresses, poll.endDate)

  const voteProxies = await getVoteProxies(voteRegistries)
  const stakedProxies = stakedByAddress(await getStakedByAddress(voteProxies, poll.endDate))
  const stakedVoters = stakedByAddress(await getStakedByAddress(getVoterAddresses(poll), poll.endDate))

  const hotCold = Array.from(new Set(voteRegistries.flatMap((el: any) => [el.coldAddress, el.hotAddress])))
  const votersHotCold = Array.from(new Set([...votersAddresses, ...hotCold]))

  const balances = getBalanceByAccount(await getAccountBalances(votersHotCold, poll.endDate))

  const voterTotal = Object.keys(stakedVoters).reduce((acc, key) => {
    const amount = stakedVoters[key].plus(new BigNumber(balances[key])).toString()

    return {
      ...acc,
      [key]: amount,
    }
  }, {})

  const lookup = getLookup(votersAddresses, voteRegistries)
  const stakedTotal = totalStaked(poll, lookup, balances, stakedProxies)

  const mkrVoter = Array.from(new Set([...Object.keys(stakedTotal), ...Object.keys(voterTotal)])).reduce((acc, key) => {
    const sv = stakedVoters[key] || new BigNumber('0')
    const vt = voterTotal[key] ? new BigNumber(voterTotal[key]) : new BigNumber('0')
    const amount = sv.plus(vt)

    return {
      ...acc,
      [key]: amount,
    }
  }, {})

  const votersPerOption = getPollVotersPerOption(poll)
  const mkrOptions = Object.keys(votersPerOption).reduce((acc, op) => {
    const voters = votersPerOption[op]
    const total = voters.reduce((acc, v) => {
      return acc.plus(mkrVoter[v])
    }, new BigNumber('0'))

    return {
      ...acc,
      [op]: total.toString(),
    }
  }, {})

  const ret = Object.keys(mkrOptions).map(key => {
    return {
      label: poll.options[parseInt(key) - 1],
      mkr: mkrOptions[key],
      voter: votersPerOption[key].length,
    }
  })

  return ret
}

const getAccountBalances = async (addresses, endDate) => {
  // Query
  // FIXME - orderBy: timestamp, orderDirection: desc
  const query = `
    query getAccountBalances($voters: [Bytes!]!, $endDate: BigInt!  ) {
      accountBalanceSnapshots(
        first:1000,
        where:{
          token:"0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
          account_in: $voters,
          timestamp_lte: $endDate
        }
      ) {
        account {
          address
        }
        amount
        timestamp
      }
    }
  `

  const result: any = await fetchQuery(TOKEN_REGISTRY_API_URI, query, {
    voters: addresses,
    endDate,
  })

  console.log(result)

  return result
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

const getLookup = (addresses, registries) => {
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

const ZERO = new BigNumber('0')
// total staked proxy + balance hot + balance cold
const totalStaked = (poll, lookup, balances, stakedProxies) => {
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

      console.log(voter)
      console.log(addedColHotByVoter[voter])

      if (!addedColHotByVoter[voter]) {
        console.log('todo', cold, hot, proxies)

        const hotBalance = balances[hot] || ZERO
        const coldBalance = balances[cold] || ZERO

        console.log(hotBalance.toString())
        console.log(coldBalance.toString())
        console.log(proxyAmount.toString())
        console.log(acc.plus(proxyAmount.plus(hotBalance).plus(coldBalance)).toString())

        addedColHotByVoter[voter] = true
        return acc.plus(proxyAmount.plus(hotBalance).plus(coldBalance))
      }
      console.log('proxy', proxyAmount.toString())
      return acc.plus(proxyAmount)
    }, new BigNumber('0'))

    return {
      ...acc,
      [voter]: amount,
    }
  }, {})
}
