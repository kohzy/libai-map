import React from 'react'
import PropTypes from 'prop-types'

import { Box, Flex } from 'components/Grid'
import styled, { themeGet } from 'style'
import styles from "./timeline.module.css"

// This sidebar is responsive: it shrinks a bit in smaller viewports, then eventually expands to fill the full width
const Wrapper = styled(Flex).attrs({
    alignItems: 'center',
    justifyContent: 'space-between',
  })`
    padding: 0.75rem 0.5rem;
    flex: 0 0 auto;
    border-bottom: 1px solid ${themeGet('colors.grey.900')};
  `

const Timeline = ({ children,activeLocation }) => (
  <Wrapper as="header">
    <Box 
      p="1rem"
      width={[ 1/2 ]}
    >
        {children}
    </Box>
    <Box
      width={[ 1 ]}
    >
  <h2>{activeLocation.properties.title}</h2>
  <p>Year: {activeLocation.properties.year}</p>
  <p>Page in Book: {activeLocation.properties["book-page"]}</p>
  <p>Historic Name of Location: {activeLocation.properties["historic-name"]}</p>
  <p>Name of Location Today: {activeLocation.properties["modern-name"]}</p>
  <p>Companion(s): {activeLocation.properties.companion}</p>
</Box>
  </Wrapper>
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
