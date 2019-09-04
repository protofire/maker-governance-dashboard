import React from 'react'
import { Link } from 'react-router-dom'
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
    margin-rigth: 2rem;
    margin-left: 2rem;
  }
`

const Breadcrumb = styled.div`
  display: flex;
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
          <img alt="logo" src="./maker.png" />
          <Breadcrumb>
            {items.map(({ to, label }) => (
              <StyledLink key={to} to={to}>
                {label}
              </StyledLink>
            ))}
          </Breadcrumb>
        </NavLeft>
      </NavHeader>
    </Nav>
  )
}
export default Header
