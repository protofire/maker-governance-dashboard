import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Nav = styled.div`
  background-color: rgb(14, 16, 41);
  color: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.0975);
`
const NavHeader = styled.div`
  font-size: 16px;
  display: flex;
  align-items: center;
`
const NavLeft = styled.div`
  max-width: 1140px;
  padding: 2rem 2.5rem;
  margin: 0 auto;
  display: flex;
  flex: 1;
  justify-content: space-between;
  a {
    font-size: 18px;
    font-weigth: 500;
  }
`

const Breadcrumb = styled.div`
  display: flex;
  position: relative;
  top: 3px;
  margin-left: 3rem;
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
