import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Nav = styled.div`
  background-color: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.0975);
`
const NavHeader = styled.div`
  padding: 26px 20px;
  display: flex;
  align-items: center;
  margin: 0 auto;
`
const NavLeft = styled.div`
  width: 33.333%;
  text-align: left;
`

const StyledLink = styled(Link)`
  text-decoration: none;
  &:visited,
  &:hover,
  &:active {
    color: inherit;
  }
`

interface Item {
  to: string
  label: string
}

type Props = {
  items: Item[]
}

function Header(props: Props) {
  const { items } = props
  return (
    <Nav>
      <NavHeader>
        <NavLeft>
          {items.map(({ to, label }) => (
            <StyledLink key={to} to={to}>
              {label}
            </StyledLink>
          ))}
        </NavLeft>
      </NavHeader>
    </Nav>
  )
}
export default Header
