import React from 'react'
import PropTypes from 'prop-types'

import { Text, Box } from 'rebass'

import styled from 'styled-components'
import { themeGet } from 'styled-system'

const Title = styled(Text)`    
    text-transform: uppercase;
    font-size: 0.65rem;
    font-weight: 800;
    flex-grow: 1;
    line-height: 1.3;
    margin-bottom: 0.65rem;
    letter-spacing: 0.05rem;
    color: ${themeGet('colors.primary.600')};
  `

const DrawerChunkHeader = ({ children }) => (
    <Title>{children}</Title>
)

DrawerChunkHeader.propTypes = {
  children: PropTypes.string.isRequired
}

DrawerChunkHeader.defaultProps = {
  children: "Default Header",
}

export default DrawerChunkHeader
