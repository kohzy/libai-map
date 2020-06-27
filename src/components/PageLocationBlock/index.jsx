import React from 'react'
import PropTypes from 'prop-types'

import { Box, Flex } from 'components/Grid'
import { Text } from 'rebass'
import styled, { themeGet } from 'style'

const Wrapper = styled(Flex).attrs({
    alignItems: 'center',
    justifyContent: 'space-between',
  })`
    flex: 0 0 auto;
    border-top: 10px solid ${themeGet('colors.primary.700')};
  `

const PageIndicator = styled(Text).attrs({
  })`
    color: ${themeGet('colors.primary.700')};
    padding-left: 0.5rem;
    padding-top: 1rem;
    margin-left: 2rem;
    margin-bottom: 1rem;
    border-left: 2px solid ${themeGet('colors.primary.700')};
  `

const PageLocationBlock = ({ page }) => (
    <Wrapper>
        <Flex>
            <Box>
                <PageIndicator>pg {page}</PageIndicator>
            </Box>
        </Flex>
    </Wrapper>
)

PageLocationBlock.propTypes = {
    page: PropTypes.string.isRequired,
}
export default PageLocationBlock
