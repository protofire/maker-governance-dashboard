import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { toNiceDate } from '../../utils'
import styled, { css } from 'styled-components'
import HamburgerMenu from 'react-hamburger-menu'

const Overlay = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2;
`
const Nav = styled.div`
  border: solid 1px #d9d9d9;
  background-color: #ffffff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.0975);
  height: 60px;
  display: flex;
  ${props =>
    props.overlay &&
    css`
      z-index: 999;
      position: absolute;
      width: 100%;
    `}
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
  align-items: center;
  a {
    font-weight: 500;
    margin-left: 2rem;
    display:flex
    align-items:center
  }
  @media (max-width: 480px) {
    padding-right: 0;
    padding-left: 0;
    margin-left: 10px;
  }
`

const NavRight = styled.div`
  max-width: 1140px;
  margin: 0 auto;
  display: flex;
  flex-direction: row-reverse;
  @media (max-width: 480px) {
    flex-direction: row;
    font-size: 12px;
    justify-content: center;
  }
  span {
    margin-right: 1rem;
  }
`
const RightMenu = styled(NavRight)`
  position: relative;
  margin-right: 10px;
  @media (min-width: 480px) {
    display: none;
  }
  @media (max-width: 480px) {
    justify-content: flex-end;
  }
`

const Breadcrumb = styled.div`
  display: flex;
  @media (max-width: 480px) {
    display: none;
  }
`
const HamburgerContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 62px;
  transition: all 0.5s ease-in-out;
`
const Menu = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  background: white;
  border: solid 1px #d9d9d9;
  &:first-child {
    border-top: none;
  }
  z-index: 999;
`
const Item = styled.div`
  color:#666666
  display: flex;
  flex: 1;
  padding: 1rem;
  div {
    margin: 0 auto;
  }
  &:hover,&:focus{
    color:white;
    font-weight:600;
    background:#00ba9c;
  }
`
const StyledLink = styled(NavLink)`
  text-decoration: none;
  color: #666666;
  &:hover {
    color: #000000 !important;
  }
  &:visited,
  &:active {
    color: #666666;
  }
`

interface Item {
  to: string
  label: string
}

type Props = {
  items: Item[]
  lastSynced?: string
}

const HamburgerContent = props => {
  const { items, handleMenu } = props
  return (
    <HamburgerContainer>
      {items.map(({ to, label }) => (
        <Menu>
          <StyledLink key={to} to={to}>
            <Item onClick={handleMenu}>
              <div>{label}</div>
            </Item>
          </StyledLink>
        </Menu>
      ))}
    </HamburgerContainer>
  )
}

function Header(props: Props) {
  const { items, lastSynced } = props
  const [isOpenMenu, setOpenMenu] = useState(false)
  return (
    <>
      {isOpenMenu && <Overlay />}
      <Nav overlay={isOpenMenu}>
        <NavHeader>
          <NavLeft>
            <img alt="logo" src="/maker.png" />
            <Breadcrumb>
              {items.map(({ to, label }) => (
                <StyledLink exact activeStyle={{ color: '#000000' }} key={to} to={to}>
                  {label}
                </StyledLink>
              ))}
            </Breadcrumb>
          </NavLeft>
          <NavRight>
            <span>
              Mainnet | Last sync: <strong>{lastSynced && toNiceDate(lastSynced)}</strong>
            </span>
          </NavRight>
          <RightMenu>
            <HamburgerMenu
              isOpen={isOpenMenu}
              menuClicked={() => setOpenMenu(!isOpenMenu)}
              width={25}
              height={17}
              strokeWidth={1}
              rotate={0}
              color="black"
              borderRadius={0}
              animationDuration={0.5}
            />
          </RightMenu>
        </NavHeader>
      </Nav>
      {isOpenMenu && <HamburgerContent handleMenu={() => setOpenMenu(false)} items={items} />}
    </>
  )
}
export default Header
