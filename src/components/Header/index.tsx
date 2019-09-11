import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

const Nav = styled.div`
  border: solid 1px #d9d9d9;
  background-color: #ffffff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.0975);
  height: 60px;
  display: flex;
`
const NavHeader = styled.div`
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  flex: 1;
`
const NavLeft = styled.div`
  max-width: 1140px;
  padding: 2rem 2.5rem;
  margin: 0 auto;
  display: flex;
  flex: 1;
  align-items: center;
  a {
    font-weight: 500;
    margin-right: 2rem;
    margin-left: 2rem;
  }
`

const NavRight = styled.div`
  max-width: 1140px;
  margin: 0 auto;
  display: flex;
  flex: 1;
  flex-direction: row-reverse;
  span {
    margin-right: 1rem;
  }
`

const Breadcrumb = styled.div`
  display: flex;
`

const StyledLink = styled(NavLink)`
  text-decoration: none;
  color: #666666;
  &:hover {
    color: #000000;
  }
  &:visited,
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
          <img alt="logo" src="./maker.png" />
          <Breadcrumb>
            {items.map(({ to, label }) => (
              <StyledLink activeStyle={{ color: '#000000' }} key={to} to={to}>
                {label}
              </StyledLink>
            ))}
          </Breadcrumb>
        </NavLeft>
        <NavRight>
          <span>Mainnet</span>
        </NavRight>
      </NavHeader>
    </Nav>
  )
}
export default Header
