import React from 'react'
import PropTypes from 'prop-types'

import { Box, Flex } from 'components/Grid'
import styled from 'styled-components'

// This sidebar is responsive: it shrinks a bit in smaller viewports, then eventually expands to fill the full width
const Wrapper = styled(Box)`
  box-shadow: 2px 1px 5px 5px ${p => p.theme.colors.navy.shadow};
  z-index: 1;
  height: 100%;
`

// The inner wrapper provides the scroll container for the sidebar
// which allows vertical scrolling by default
const InnerWrapper = styled(Flex)`
  overflow-x: hidden;
  overflow-y: auto;
  height: 100%;
`

const Sidebar = ({ children, allowScroll }) => (
  <Wrapper
    width= {['100%', '350px', '450px']}
    flex= {'0 0 auto'}
  >
    <InnerWrapper
      flexDirection={'column'}
      flex={'1 1 auto'}
    >{children}</InnerWrapper>
  </Wrapper>
)

Sidebar.propTypes = {
  children: PropTypes.node.isRequired,
  allowScroll: PropTypes.bool,
}

export default Sidebar
