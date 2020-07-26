import React from 'react'
import PropTypes from 'prop-types'

import { Text, Box } from 'rebass'
import { Column } from 'components/Grid'
import DrawerChunkHeader from './DrawerChunkHeader.jsx'

import styled from 'styled-components'
import { themeGet } from 'styled-system'

const Wrapper = styled(Box)`
  margin-bottom: 2rem;
`

const DrawerText = styled(Text)`
    flex-grow: 1;
    line-height: 1.2;
    margin-bottom: 0.5rem;
`

const ArrayText = styled(Text)`
  flex-grow: 1;
  line-height: 1.2;
  margin-bottom: 0.5rem;
`

const DrawerTextChunk = ({ header, body }) => (
  <Wrapper>
    <DrawerChunkHeader>{header}</DrawerChunkHeader>
    {body instanceof Array ? body.map((t, i) => 
    <ArrayText key={i}>{t}</ArrayText>) : 
    <DrawerText>{body}</DrawerText> }
  </Wrapper>        
)

DrawerTextChunk.propTypes = {
  header: PropTypes.string,
  body: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array
  ]).isRequired,
}

DrawerTextChunk.defaultProps = {
  body: "Lorem Ipsum"
}

export default DrawerTextChunk
