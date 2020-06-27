import React from 'react'
import { Text } from 'rebass'

import { Link } from 'components/Link'

import { Box, Flex } from 'components/Grid'
import styled, { themeGet } from 'style'
import { siteMetadata } from '../../../gatsby-config'

const Wrapper = styled(Flex).attrs({
  alignItems: 'center',
  justifyContent: 'space-between',
})`
  padding: 0.75rem 0.5rem;
  flex: 0 0 auto;
  border-bottom: 1px solid ${themeGet('colors.grey.900')};
`

const Title = styled(Text).attrs({
  as: 'h4',
})`
  margin: 0;
  flex-grow: 1;

  & * {
    text-decoration: none;
    color: ${themeGet('colors.secondary.500')};
  }
`

const NavBar = styled(Flex).attrs({
  alignItems: 'center',
})`
  font-size: 1.25rem;

  .nav-active {
    color: ${themeGet('colors.secondary.500')};
  }
`

const NavLink = styled(Link)`
  text-decoration: none;
  padding: 0 0.5rem;

  &:hover {
    text-decoration: underline;
  }
`

const Header = () => (
  <Wrapper as="header">
    <Title>
      <Box p="1rem">{siteMetadata.title}</Box>
    </Title>
    <NavBar>
      {/* <NavLink to="/explainer" activeClassName="nav-active">
        About
      </NavLink> */}
    </NavBar>
  </Wrapper>
)

export default Header
