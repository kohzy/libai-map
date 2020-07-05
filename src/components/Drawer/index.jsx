import React from 'react'
import PropTypes from 'prop-types'

import { Flex } from 'components/Grid'

import Sidebar from 'components/Sidebar'
import DrawerHeader from 'components/DrawerHeader'
import DrawerBody from 'components/DrawerBody'

import styled from 'styled-components'

const Wrapper = styled(Flex)`
  background-color: #050D52;
  color: white
`

const Drawer = ({ children,activeLocation,title,subheader }) => (
  <Wrapper>
    <Sidebar>
      <DrawerHeader 
        siteTitle={title} 
        siteSubheader={subheader}
        activeLocation={activeLocation}
      >
        {children}
      </DrawerHeader>
      <DrawerBody
        activeLocation={activeLocation}
      /> 
    </Sidebar>
  </Wrapper>
)

Drawer.propTypes = {
  children: PropTypes.node.isRequired,
  activeLocation: PropTypes.object,
  title: PropTypes.string.isRequired,
  subheader: PropTypes.string,
}

Drawer.defaultProps = {
  children: "this is where the control bar should be",
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
