import React from 'react'
import PropTypes from 'prop-types'

import { Text } from 'rebass'

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

const Header = ({ siteTitle,siteSubheader }) => (
  <Wrapper as="header">
    <Title>
      <Box p="1rem">{siteTitle}</Box>
      <Box p="1rem">{siteSubheader}</Box>
    </Title>
  </Wrapper>
)


Header.propTypes = {
  siteTitle: PropTypes.string.isRequired,
  siteSubheader: PropTypes.string.isRequired,
}

Header.defaultProps = {
  siteTitle: "Default Title",
  siteSubheader: "Default Subheader"
}

export default Header
