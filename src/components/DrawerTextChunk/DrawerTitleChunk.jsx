import React from 'react'
import PropTypes from 'prop-types'

import { Text } from 'rebass'
import styled, { themeGet } from 'style'

const Title = styled(Text).attrs({
    as: 'p',
  })`    
    text-transform: uppercase;
    flex-grow: 1;
    line-height: 1;
    color: ${themeGet('colors.primary.500')};
  `

const DrawerTitleChunk = ({ header, body }) => (
    <div>
        <Title>{header}</Title>
        <Text>{body}</Text>
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
