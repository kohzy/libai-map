import React from 'react'
import PropTypes from 'prop-types'

import { Box, Flex } from 'components/Grid'
import { Text } from 'rebass'
import Sidebar from 'components/Sidebar'

import styled, { themeGet } from 'style'
import styles from "./timeline.module.css"

const Title = styled(Text).attrs({
  as: 'h2',
})`
  flex-grow: 1;
  line-height: 1;
  color: ${themeGet('colors.secondary.500')};
`

const TimelineText = styled(Text).attrs({
  as: 'p',
})`
  color: ${themeGet('colors.secondary.100')};
`

const Timeline = ({ children,activeLocation }) => (
  <Sidebar>
    <Box>
        {children}
    </Box>
    <Box p="2rem">
      <Title>{activeLocation.properties.title}</Title>
      <TimelineText>Year: {activeLocation.properties.year}</TimelineText>
      <TimelineText>Page in Book: {activeLocation.properties["book-page"]}</TimelineText>
      <TimelineText>Historic Name of Location: {activeLocation.properties["historic-name"]}</TimelineText>
      <TimelineText>Name of Location Today: {activeLocation.properties["modern-name"]}</TimelineText>
      <TimelineText>Companion(s): {activeLocation.properties.companion}</TimelineText>
    </Box>
    <Box>
      <img src={activeLocation.properties.thumbnail} />
    </Box>
  </Sidebar>
    
)

Timeline.propTypes = {
  children: PropTypes.node.isRequired,
  activeLocation: PropTypes.object,
}

Timeline.defaultProps = {
  children: "this is placeholder text",
  activeLocation: {
    properties: {
      title: "Default title",
      "historic-name": "Default historic name",
      "modern-name": "Default modern name",
      year: 2020,
      "book-page": 999,
      "companion": "Default companion"
    }
  }
}

export default Timeline
