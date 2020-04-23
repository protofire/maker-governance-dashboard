import React from 'react'
import styled from 'styled-components'
import Tooltip from '@material-ui/core/Tooltip'
import { LinkableContext } from '.'
import CopyToClipboard from '../CopyToClipboard'
import { IconContainer } from '../styled'

const HashContainer = styled.div`
  display: flex;
  position: relative;
  bottom: 5px;
  right: 9px;
  cursor: pointer;
`

export default function CopyLink({ tooltip = 'Copy Metric link' }) {
  const { id } = React.useContext(LinkableContext)

  return id ? (
    <HashContainer>
      <CopyToClipboard>
        {({ copy }) => (
          <IconContainer>
            <Tooltip title={tooltip} arrow>
              <span
                onClick={() => {
                  copy(window.location.origin + window.location.pathname + `#${id}`)
                }}
              >
                #
              </span>
            </Tooltip>
          </IconContainer>
        )}
      </CopyToClipboard>
    </HashContainer>
  ) : null
}
