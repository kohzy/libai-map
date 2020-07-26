import React from 'react'
import PropTypes from 'prop-types'

import { Box, Flex, Columns, Container } from 'components/Grid'

import DrawerTextChunk from 'components/DrawerTextChunk'
import DrawerTitleChunk from 'components/DrawerTextChunk/DrawerTitleChunk'
import DrawerPoemCNChunk from 'components/DrawerTextChunk/DrawerPoemCNChunk'
import DrawerPoemENChunk from 'components/DrawerTextChunk/DrawerPoemENChunk'

import styled from 'styled-components'

const Wrapper = styled(Flex)`
  background-color: ${p => p.theme.colors.navy['800']};
  height: ${({ height }) => height};
  overflow: -moz-scrollbars-none; /* Mozilla based browsers */
  -ms-overflow-style: none;  /* Internet Explorer 10+ */
  scrollbar-width: none;  /* Firefox */
  &::-webkit-scrollbar {
    width: 0;   /* Safari and Chrome */
  }
`
const InnerWrapper = styled(Flex)`
  overflow-x: hidden;
  overflow-y: auto;
  height: 100%;
`

const ChunkWrapper = styled(Box).attrs({
  width: [1, 1/2, 1/2],
  mx: '0.5rem'
})``

const DrawerBody = ({ activeLocation, height }) => (
  <Wrapper height={height}>
    <InnerWrapper
    flexDirection={'column'}>
      <Columns mx='1rem' mt='2rem'>
        <Box
          mx='1.5rem'
        >
          <DrawerTitleChunk 
            header={activeLocation.properties.year}
            body={activeLocation.properties.title}
          />
        </Box>
      </Columns>
      <Columns>
        <Box>
          <img src={activeLocation.properties.thumbnail} />
        </Box>
      </Columns>
      <Columns mx='1.5rem'>
        <ChunkWrapper>
          <DrawerTextChunk
            header="Historic Location Name"
            body={activeLocation.properties["historic-name"]}
          />
        </ChunkWrapper>
        <ChunkWrapper>
          <DrawerTextChunk
            header="Present Location Name"
            body={activeLocation.properties["modern-name"]} 
          />
        </ChunkWrapper>
      </Columns>
        {
          activeLocation.properties["poem-notable-zh-cn"] ? (
            <Columns mx='1rem'>
              <ChunkWrapper>
                <DrawerPoemCNChunk
                  header="Notable Poem"
                  body={activeLocation.properties["poem-notable-zh-cn"]}
                  poemTitle={activeLocation.properties["poem-notable-title-zh-cn"]}
                  width={1/2}
                />
              </ChunkWrapper>
              <ChunkWrapper>
                <DrawerPoemENChunk
                  header="Translated"
                  body={activeLocation.properties["poem-trans-hajin-en"]}
                  poemTitle={activeLocation.properties["poem-trans-title-hajin-en"]}
                  width={[1,1/2,1/2]}
                />
              </ChunkWrapper>
            </Columns>
          )
        : null
        }
        {
          activeLocation.properties["companion"] ? (
          <Columns mx='1.5rem'>
            <ChunkWrapper>
              <DrawerTextChunk
                header="Companion(s)"
                body={activeLocation.properties.companion}
              />
            </ChunkWrapper>
          </Columns>
        ) 
        : null
        }
      
    </InnerWrapper>
  </Wrapper>
)

DrawerBody.propTypes = {
  activeLocation: PropTypes.object,
  height: PropTypes.string,
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
  height: "100%",
}

export default DrawerBody
