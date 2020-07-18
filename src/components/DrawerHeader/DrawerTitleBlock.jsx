import React from 'react'
import PropTypes from 'prop-types'

import { Text } from 'rebass'

import { Box, Flex } from 'components/Grid'
import styled from 'styled-components'
import { typography, themeGet } from 'styled-system'

const Wrapper = styled(Flex).attrs({
  alignItems: 'center',
  justifyContent: 'space-between',
})`
  padding: 2rem 2rem 1rem 2rem;
  background-color: ${p => p.theme.colors.navy['900']};
  `

const Title = styled(Text).attrs({
  as: 'h4',
})`
  flex-grow: 1;
  padding-bottom: 0.5rem;
  color: ${themeGet('colors.secondary.500')};
`

const DrawerTitleBlock = ({ siteTitle,siteSubheader }) => (
  <Wrapper>
      <Box>
        <Title>{siteTitle}</Title>
        <Title
          fontWeight={100}
        >{siteSubheader}</Title>
      </Box>
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
