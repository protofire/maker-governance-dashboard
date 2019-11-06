import React from 'react'
import styled, { css } from 'styled-components'
import NetworkIcon from './img/icon.svg'
import TimeIcon from './img/time.svg'

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;

  @media (min-width: ${props => props.theme.themeBreakPoints.md}) {
    flex-direction: row;
  }
`

const InfoCSS = css`
  align-items: center;
  color: #000;
  display: flex;
  font-size: 12px;
  font-weight: normal;
  line-height: 1.36;

  > img {
    margin-right: 8px;
  }

  @media (min-width: ${props => props.theme.themeBreakPoints.md}) {
    font-size: 14px;
  }
`

const Network = styled.div`
  ${InfoCSS}

  @media (min-width: ${props => props.theme.themeBreakPoints.md}) {
    margin: 0 12px 0 0;
    padding: 0 12px 0 0;
    position: relative;

    &::after {
      background-color: #000;
      content: '';
      height: 22px;
      position: absolute;
      right: 0;
      width: 1px;
    }
  }

  &:last-child {
    margin-right: 0;
    padding-right: 0;

    &::after {
      display: none;
    }
  }
`

const LastSync = styled.div`
  ${InfoCSS}
`

type Props = {
  network: string
  lastSynced?: string
}

function HeaderInfo(props: Props) {
  const { network, lastSynced, ...restProps } = props

  return (
    <Wrapper {...restProps}>
      {network ? (
        <Network>
          <img src={NetworkIcon} alt="" />
          {network}
        </Network>
      ) : null}
      <LastSync>
        <img src={TimeIcon} alt="" /> Last sync: {lastSynced ? lastSynced : 'Loading...'}
      </LastSync>
    </Wrapper>
  )
}
export default HeaderInfo
