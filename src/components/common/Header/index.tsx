import React, { useState } from 'react'
import HamburgerContent from '../HamburgerContent'
import HamburgerMenu from 'react-hamburger-menu'
import Logo from '../Logo'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import { toNiceDate } from '../../../utils'

const HeaderWrapper = styled.div`
  background: ${props => props.theme.header.backgroundColor};
  border-bottom: 1px solid ${props => props.theme.borders.borderColor};
  display: flex;
  flex-grow: 0;
  flex-shrink: 0;
  height: ${props => props.theme.header.height};
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 5;
`

const HeaderInner = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 100%;
  padding: 0 10px;
  width: ${props => props.theme.themeBreakPoints.xxl};

  @media (min-width: ${props => props.theme.themeBreakPoints.xl}) {
    padding: 0 ${props => props.theme.paddings.mainPadding};
  }
`

const NavLeft = styled.div`
  align-items: center;
  display: flex;
`
const NavRightTitle = styled.span``

const NavRight = styled.div`
  display: flex;
  flex-direction: row-reverse;
  margin: 0 0 0 auto;

  span {
    margin-right: 1rem;
  }
`

const RightMenu = styled.div`
  display: block;
  margin: 0 0 0 auto;
  position: relative;

  @media (min-width: ${props => props.theme.themeBreakPoints.xl}) {
    display: none;
  }
`

const MainMenu = styled.div`
  display: none;
  margin-left: 40px;

  @media (min-width: ${props => props.theme.themeBreakPoints.xl}) {
    display: flex;
  }
`

const StyledLink = styled(NavLink)`
  color: ${props => props.theme.mainMenu.color};
  font-size: 14px;
  margin-left: 36px;
  text-decoration: none;

  &:first-child {
    margin-left: 0;
  }

  &.active,
  &:hover {
    color: ${props => props.theme.mainMenu.active};
  }
`

interface Item {
  label: string
  to: string
}

type Props = {
  items: Item[]
  lastSynced?: string
}

function Header(props: Props) {
  const { items, lastSynced } = props
  const [isOpenMenu, setOpenMenu] = useState(false)

  return (
    <>
      <HeaderWrapper overlay={isOpenMenu}>
        <HeaderInner>
          <NavLeft>
            <Logo />
            <MainMenu>
              {items.map(({ to, label }) => (
                <StyledLink exact activeClass="active" key={to} to={to}>
                  {label}
                </StyledLink>
              ))}
            </MainMenu>
          </NavLeft>
          <NavRight>
            <NavRightTitle>
              Mainnet | Last sync: <strong>{lastSynced && toNiceDate(lastSynced)}</strong>
            </NavRightTitle>
          </NavRight>
          <RightMenu>
            <HamburgerMenu
              animationDuration={0.5}
              borderRadius={0}
              color="#000"
              height={17}
              isOpen={isOpenMenu}
              menuClicked={() => setOpenMenu(!isOpenMenu)}
              rotate={0}
              strokeWidth={2}
              width={25}
            />
          </RightMenu>
        </HeaderInner>
      </HeaderWrapper>
      {isOpenMenu && <HamburgerContent handleMenu={() => setOpenMenu(false)} items={items} />}
    </>
  )
}
export default Header
