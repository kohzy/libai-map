import React from 'react'
import PropTypes from 'prop-types'

import { Text, Box } from 'rebass'
import DrawerChunkHeader from './DrawerChunkHeader.jsx'

import styled from 'styled-components'
import { themeGet } from 'styled-system'

const Wrapper = styled(Box)`
  margin-bottom: 2rem;
`

const PoemText = styled(Text)`
  font-style: italic;
  flex-grow: 1;
  line-height: 1.2;
  margin-bottom: 0.5rem;
`
const PoemTitle = styled(Text)`    
    text-transform: uppercase;
    flex-grow: 1;
    line-height: 1;
  `

const DrawerPoemCNChunk = ({ header, body, poemTitle }) => (
    <Wrapper>
        <DrawerChunkHeader>{header}</DrawerChunkHeader>
        {body.map((t, i) => 
        <PoemText key={i}>{t}</PoemText>)}
        <PoemTitle>《{poemTitle}》</PoemTitle>
    </Wrapper>
)

DrawerPoemCNChunk.propTypes = {
  header: PropTypes.string.isRequired,
  body: PropTypes.array.isRequired,
  poemTitle: PropTypes.string.isRequred,
}

DrawerPoemCNChunk.defaultProps = {
  poemTitle: "Default Title"
}

export default DrawerPoemCNChunk
