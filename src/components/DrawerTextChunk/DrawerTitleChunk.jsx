import React from 'react'
import PropTypes from 'prop-types'

import { Text } from 'rebass'
import styled, { themeGet } from 'style'

const Date = styled(Text).attrs({
    as: 'p',
  })`    
    text-transform: uppercase;
    flex-grow: 1;
    line-height: 1;
    color: ${themeGet('colors.primary.600')};
  `

const DrawerTitle = styled(Text).attrs({
    as: 'h1',
  })`    
    text-transform: capitalize;
    flex-grow: 1;
    color: ${themeGet('colors.white')};
  `

const DrawerTitleChunk = ({ header, body }) => (
    <div>
        <Date>{header}</Date>
        <DrawerTitle>{body}</DrawerTitle>
    </div>
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
