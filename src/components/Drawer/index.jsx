import React from 'react'
import PropTypes from 'prop-types'

import { Box, Flex } from 'components/Grid'
import { Text } from 'rebass'

import Sidebar from 'components/Sidebar'
import Header from './Header.jsx'
import PageLocationBlock from 'components/PageLocationBlock'
import DrawerTextChunk from 'components/DrawerTextChunk'
import DrawerTitleChunk from 'components/DrawerTextChunk/DrawerTitleChunk'
import DrawerPoemCNChunk from 'components/DrawerTextChunk/DrawerPoemCNChunk'
import DrawerPoemENChunk from 'components/DrawerTextChunk/DrawerPoemENChunk'

import styled, { themeGet } from 'style'
import styles from "./drawer.module.css"

const Wrapper = styled(Flex).attrs({
})`
  margin: 0 1rem 1rem 1rem;
`

const Drawer = ({ children,activeLocation,title }) => (
  <Sidebar>
    <Header siteTitle={title} />
    <PageLocationBlock
      page= {activeLocation.properties["book-page"]}
    />
    <Box>
      {children}
    </Box>
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
  </Sidebar>
    
)

Drawer.propTypes = {
  children: PropTypes.node.isRequired,
  activeLocation: PropTypes.object,
  title: PropTypes.string.isRequired,
}

Drawer.defaultProps = {
  children: "this is placeholder text",
  activeLocation: {
    properties: {
      title: "Default title",
      "historic-name": "Default historic name",
      "modern-name": "Default modern name",
      year: 2020,
      "book-page": 999,    }
  },
  title: "Default Title"
}

export default Drawer
