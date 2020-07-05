import React from 'react'
import PropTypes from 'prop-types'

import { Flex } from 'components/Grid'
import DrawerTitleBlock from './DrawerTitleBlock.jsx'
import DrawerPageLocationBlock from './DrawerPageLocationBlock.jsx'

const DrawerHeader = ({ children, siteTitle, siteSubheader, activeLocation }) => (
  <Flex as="drawer-header">
    <DrawerTitleBlock siteTitle={siteTitle} siteSubheader={siteSubheader} />
    <DrawerPageLocationBlock
      page= {activeLocation.properties["book-page"]}
    />
    {children}
  </Flex>
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
