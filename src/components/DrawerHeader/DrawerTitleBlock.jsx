import React from 'react'
import PropTypes from 'prop-types'

import { Text } from 'rebass'

import { Box, Flex } from 'components/Grid'
import styled from 'styled-components'
import { themeGet } from 'styled-system'

const Wrapper = styled(Flex).attrs({
  alignItems: 'center',
  justifyContent: 'space-between',
})`
  padding: 0.75rem 0.5rem;
  background-color: ${p => p.theme.colors.navy['900']};
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

const DrawerTitleBlock = ({ siteTitle,siteSubheader }) => (
  <Wrapper as="header">
    <Title>
      <Box p="1rem">{siteTitle}</Box>
      <Box p="1rem">{siteSubheader}</Box>
    </Title>
  </Wrapper>
)


DrawerTitleBlock.propTypes = {
  siteTitle: PropTypes.string.isRequired,
  siteSubheader: PropTypes.string.isRequired,
}

DrawerTitleBlock.defaultProps = {
  siteTitle: "Default Title",
  siteSubheader: "Default Subheader"
}

export default DrawerTitleBlock
