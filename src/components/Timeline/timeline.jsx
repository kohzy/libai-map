import React from 'react'
import PropTypes from 'prop-types'

import { Box, Flex } from 'components/Grid'
import styled, { themeGet } from 'style'

// This sidebar is responsive: it shrinks a bit in smaller viewports, then eventually expands to fill the full width
const Wrapper = styled(Flex).attrs({
    alignItems: 'center',
    justifyContent: 'space-between',
  })`
    padding: 0.75rem 0.5rem;
    flex: 0 0 auto;
    border-bottom: 1px solid ${themeGet('colors.grey.900')};
  `

const Timeline = ({ children }) => (
  <Wrapper as="header">
    <Box p="1rem">
        {children}
    </Box>
  </Wrapper>
)

Timeline.propTypes = {
  children: PropTypes.node.isRequired,
}

Timeline.defaultProps = {
  children: "this is placeholder text",
}

export default Timeline
