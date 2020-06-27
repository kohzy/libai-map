import React from 'react'
import PropTypes from 'prop-types'

import { Box, Flex } from 'components/Grid'
import { Text } from 'rebass'
import styled, { themeGet } from 'style'

const Wrapper = styled(Flex).attrs({
  })`
    padding: 0rem 2rem;
    flex: 0 0 auto;
  `

const ControlBar = ({ backStartFunc, prevFunc, nextFunc }) => (
    <Wrapper>
        <Box width={[1/2]}>
            <button 
            onClick={backStartFunc}>Back to Start</button>
        </Box>
        <Box width={[1/3]}>
            <button 
                onClick={prevFunc}>Prev</button>
        </Box>
        <Box>
            <span>
            <button 
                onClick={nextFunc}>Next</button>
            </span>
        </Box>
    </Wrapper>
)

ControlBar.propTypes = {
    backStartFunc: PropTypes.func,
    prevFunc: PropTypes.func,
    nextFun: PropTypes.func,
}
export default ControlBar
