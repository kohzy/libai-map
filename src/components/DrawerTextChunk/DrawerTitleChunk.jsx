import React from 'react'
import PropTypes from 'prop-types'

import { Text } from 'rebass'
import { Box, Flex } from 'components/Grid'
import styled, { themeGet } from 'style'

const Wrapper = styled(Box).attrs({
})`
  padding: 2rem 2rem 1rem 2rem;
  flex: 0 0 auto;
`

const Date = styled(Text).attrs({
    as: 'p',
  })`    
    text-transform: uppercase;
    flex-grow: 1;
    line-height: 1;
    font-weight: 800;
    margin-bottom: 0.25rem;
    color: ${themeGet('colors.primary.600')};
  `

const AdDate = styled(Text).attrs({
  as: 'p',
})`    
  text-transform: uppercase;
  font-weight: 800;
  font-size: 0.75rem;
  padding-left: 0.25rem;
  display: inline;
`

const DrawerTitle = styled(Text).attrs({
    as: 'h1',
  })`    
    text-transform: capitalize;
    flex-grow: 1;
    color: ${themeGet('colors.white')};
  `

const DrawerTitleChunk = ({ header, body }) => (
    <Wrapper>
      <Date>{header} 
        <AdDate> AD</AdDate>
      </Date>
      <DrawerTitle>{body}</DrawerTitle>
    </Wrapper>
)

DrawerTitleChunk.propTypes = {
  header: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
}

DrawerTitleChunk.defaultProps = {
  header: "Default Header",
  body: "Lorem Ipsum"
}

export default DrawerTitleChunk
