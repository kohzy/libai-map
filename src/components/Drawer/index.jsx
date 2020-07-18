import React from 'react'
import PropTypes from 'prop-types'

import { Flex, Box } from 'components/Grid'
import { useWindowDimensions } from './util'

import DrawerHeader from 'components/DrawerHeader'
import DrawerBody from 'components/DrawerBody'

import styled from 'styled-components'

const headerPixelHeight = 218;

const Wrapper = styled(Box)`
  color: ${p => p.theme.colors.white};
  box-shadow: 2px 1px 5px 5px ${p => p.theme.colors.navy.shadow};
  z-index: 1;
  height: 100%;
  `

  const HeaderWrapper = styled(Box)`
  height: ${ headerPixelHeight };
  `

const Drawer = ({ children,activeLocation,title,subheader }) => {
  const {windowPixelHeight, windowPixelWidth} = useWindowDimensions()

  return (
    <Wrapper
      width= {['100%', '350px', '450px']}
      flex= {'0 0 auto'}
    >
        <HeaderWrapper
          flex={'0 0 auto'}
        >
          <DrawerHeader 
            siteTitle={title} 
            siteSubheader={subheader}
            activeLocation={activeLocation}
          >
            {children}
          </DrawerHeader>
        </HeaderWrapper>
        <DrawerBody
          activeLocation={activeLocation}
          height={ (windowPixelHeight - headerPixelHeight).toString() + "px" }
        /> 
    </Wrapper>
)}

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
