import React from 'react'
import PropTypes from 'prop-types'

import { Box, Flex, Columns } from 'components/Grid'

import DrawerTextChunk from 'components/DrawerTextChunk'
import DrawerTitleChunk from 'components/DrawerTextChunk/DrawerTitleChunk'
import DrawerPoemCNChunk from 'components/DrawerTextChunk/DrawerPoemCNChunk'
import DrawerPoemENChunk from 'components/DrawerTextChunk/DrawerPoemENChunk'

import styled from 'styled-components'

const Wrapper = styled(Flex)`
  background-color: ${p => p.theme.colors.navy['800']};
  overflow-x: auto;
  overflow-y: hidden;
  height: 100%;
`

const DrawerBody = ({ activeLocation }) => (
  <Wrapper
    flexDirection={'column'}
    flex={'0 0 auto'}
  >
    <Columns>
      <DrawerTitleChunk 
        header={activeLocation.properties.year}
        body={activeLocation.properties.title}
      />
    </Columns>
    <Columns>
      <Box>
        <img src={activeLocation.properties.thumbnail} />
      </Box>
    </Columns>
    <Columns>
        <DrawerTextChunk
          header="Historic Name of Location"
          body={activeLocation.properties["historic-name"]} 
        />
        <DrawerTextChunk
          header="Present Name of Location"
          body={activeLocation.properties["modern-name"]} 
        />
    </Columns>
    {
      activeLocation.properties["poem-notable-zh-cn"] ? (
      <Columns>
        <DrawerPoemCNChunk
          header="Notable Poem"
          body={activeLocation.properties["poem-notable-zh-cn"]}
          poemTitle={activeLocation.properties["poem-notable-title-zh-cn"]} 
        />
        <DrawerPoemENChunk
          header="Translated"
          body={activeLocation.properties["poem-trans-hajin-en"]}
          poemTitle={activeLocation.properties["poem-trans-title-hajin-en"]}
        />
      </Columns>
    ) 
    : null
    }
    {
      activeLocation.properties["companion"] ? (
        <Columns>
        <DrawerTextChunk
          header="Companion(s)"
          body={activeLocation.properties.companion} 
        />
      </Columns>
    ) 
    : null
    }
  </Wrapper>
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
