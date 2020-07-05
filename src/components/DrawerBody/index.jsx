import React from 'react'
import PropTypes from 'prop-types'

import { Box, Flex } from 'components/Grid'

import DrawerTextChunk from 'components/DrawerTextChunk'
import DrawerTitleChunk from 'components/DrawerTextChunk/DrawerTitleChunk'
import DrawerPoemCNChunk from 'components/DrawerTextChunk/DrawerPoemCNChunk'
import DrawerPoemENChunk from 'components/DrawerTextChunk/DrawerPoemENChunk'

import styled from 'styled-components'

const Wrapper = styled(Flex)`
  margin: 0 1rem 1rem 1rem;
`

const DrawerBody = ({ activeLocation }) => (
    <div>
    <DrawerTitleChunk 
      header={activeLocation.properties.year}
      body={activeLocation.properties.title}
    />
    <Box>
      <img src={activeLocation.properties.thumbnail} />
    </Box>
    <Wrapper>
      <DrawerTextChunk
        header="Historic Name of Location"
        body={activeLocation.properties["historic-name"]} 
      />
      <DrawerTextChunk
        header="Present Name of Location"
        body={activeLocation.properties["modern-name"]} 
      />
    </Wrapper>
    
    {
      activeLocation.properties["poem-notable-zh-cn"] ? (<Wrapper>
        <Box width={1/2}>
        <DrawerPoemCNChunk
          header="Notable Poem"
          body={activeLocation.properties["poem-notable-zh-cn"]}
          poemTitle={activeLocation.properties["poem-notable-title-zh-cn"]} 
        />
      </Box>
      <Box width={1/2}>
        <DrawerPoemENChunk
          header="Translated"
          body={activeLocation.properties["poem-trans-hajin-en"]}
          poemTitle={activeLocation.properties["poem-trans-title-hajin-en"]}
        />
    </Box>
    </Wrapper>) 
    : null
    }
    
    <Wrapper>
      <Box width={1/2}>
        <DrawerTextChunk
          header="Companion(s)"
          body={activeLocation.properties.companion} 
        />
      </Box>
    </Wrapper>
    </div>
)

DrawerBody.propTypes = {
  activeLocation: PropTypes.object,
}

DrawerBody.defaultProps = {
  activeLocation: {
    properties: {
      title: "Default title",
      "historic-name": "Default historic name",
      "modern-name": "Default modern name",
      year: 2020,
      "book-page": 999,    }
  },
}

export default DrawerBody
