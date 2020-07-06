import React from 'react'
import PropTypes from 'prop-types'

import { Flex } from 'components/Grid'
import styled from 'styled-components'

import DrawerTitleBlock from './DrawerTitleBlock.jsx'
import DrawerPageLocationBlock from './DrawerPageLocationBlock.jsx'

const Wrapper = styled(Flex)`
  background-color: ${p => p.theme.colors.navy['900']};
`

const DrawerHeader = ({ children, siteTitle, siteSubheader, activeLocation }) => (
  <Wrapper as="drawer-header">
    <DrawerTitleBlock siteTitle={siteTitle} siteSubheader={siteSubheader} />
    <DrawerPageLocationBlock
      page= {activeLocation.properties["book-page"]}
    />
    {children}
  </Wrapper>
)

DrawerHeader.propTypes = {
  siteTitle: PropTypes.string.isRequired,
  siteSubheader: PropTypes.string.isRequired,
  activeLocation: PropTypes.object.isRequired,
}

DrawerHeader.defaultProps = {
  siteTitle: "Default Title",
  siteSubheader: "Default Subheader"
}

export default DrawerHeader
