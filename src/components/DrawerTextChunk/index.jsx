import React from 'react'
import PropTypes from 'prop-types'

import { Text } from 'rebass'
import styled, { themeGet } from 'style'

const Title = styled(Text).attrs({
    as: 'p',
  })`    
    text-transform: uppercase;
    font-size: 0.65rem;
    font-weight: 800;
    flex-grow: 1;
    line-height: 1.3;
    margin-bottom: 0.65rem;
    color: ${themeGet('colors.primary.600')};
  `

const DrawerText = styled(Text).attrs({
    as: 'p',
  })`
    flex-grow: 1;
    line-height: 1.2;
  `

const DrawerTextChunk = ({ header, body }) => (
    <div>
        <Title>{header}</Title>
        <DrawerText>{body}</DrawerText>
    </div>
)

DrawerTextChunk.propTypes = {
  header: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
}

DrawerTextChunk.defaultProps = {
  header: "Default Header",
  body: "Lorem Ipsum"
}

export default DrawerTextChunk
