import React from 'react'
import styled from 'styled-components'
import Tooltip from '@material-ui/core/Tooltip'

import { ExternalIcon, CopyIcon } from '../Icon'
import CopyToClipboard from '../CopyToClipboard'

type Props = {
  children: React.ReactNode
  address: string
  voter?: boolean
}

const IconContainer = styled.span`
  position: relative;
  bottom: 2px;
  margin-left: 5px;
  cursor: pointer;
  svg {
    width: 18px;
    fill: #444 !important;
  }
`

const Link = styled.a`
  text-decoration: none;
  color: #000;
  &:hover {
    text-decoration: underline;
  }
`

function AddressNav(props: Props) {
  const { children, address, voter } = props
  const uri = 'https://etherscan.io'
  return (
    <>
      {voter ? <Link href={`/voter/${address}`}>{children}</Link> : children}
      <CopyToClipboard>
        {({ copy }) => (
          <IconContainer>
            <Tooltip title="Copy Address" arrow>
              <CopyIcon
                onClick={e => {
                  e.stopPropagation()
                  copy(address)
                }}
              />
            </Tooltip>
          </IconContainer>
        )}
      </CopyToClipboard>
      <a
        onClick={e => e.stopPropagation()}
        target="_blank"
        rel="noopener noreferrer"
        href={`${uri}/address/${address}`}
      >
        <IconContainer>
          <Tooltip title="Open in etherscan" arrow>
            <ExternalIcon />
          </Tooltip>
        </IconContainer>
      </a>
    </>
  )
}

export default AddressNav
