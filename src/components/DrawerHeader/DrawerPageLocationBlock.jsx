import React from 'react'
import PropTypes from 'prop-types'

import { Box, Flex } from 'components/Grid'
import { Text } from 'rebass'
import styled from 'styled-components'
import { themeGet } from 'styled-system'

const Wrapper = styled(Flex).attrs({
    alignItems: 'center',
    justifyContent: 'space-between',
  })`
    flex: 0 0 auto;
    border-top: 10px solid ${themeGet('colors.primary.700')};
    background-color: ${p => p.theme.colors.navy['900']};
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

const DrawerPageLocationBlock = ({ page }) => (
    <Wrapper>
        <Flex>
            <Box>
                <PageIndicator>pg {page}</PageIndicator>
            </Box>
        </Flex>
    </Wrapper>
)

DrawerPageLocationBlock.propTypes = {
    page: PropTypes.number.isRequired,
}
export default DrawerPageLocationBlock
