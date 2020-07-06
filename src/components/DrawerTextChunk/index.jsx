import React from 'react'
import PropTypes from 'prop-types'

import { Text } from 'rebass'
import { Column } from 'components/Grid'

import styled from 'styled-components'
import { themeGet } from 'styled-system'

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
    margin-bottom: 0.5rem;
`

const PoemENText = styled(Text).attrs({
  as: 'p',
})`
  font-style: italic;
  flex-grow: 1;
  line-height: 1.2;
  margin-bottom: 0.5rem;
`

const DrawerTextChunk = ({ header, body }) => (
    <Column>
        <Title>{header}</Title>
        {body instanceof Array ? body.map(t => 
        <PoemENText>{t}</PoemENText>) : 
        <DrawerText>{body}</DrawerText> }        
    </Column>
)

DrawerTextChunk.propTypes = {
  header: PropTypes.string.isRequired,
  body: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array
  ]).isRequired,
}

DrawerTextChunk.defaultProps = {
  header: "Default Header",
  body: "Lorem Ipsum"
}

export default DrawerTextChunk
