import React from 'react'
import PropTypes from 'prop-types'

import SEO from 'components/SEO'
import { Flex } from 'components/Grid'
import styled, { ThemeProvider } from 'styled-components'
import theme from 'style/theme'

import { isUnsupported } from 'util/dom'
import UnsupportedBrowser from './UnsupportedBrowser'

const Wrapper = styled(Flex)`
  height: 100%;
`

const Content = styled.div`
  flex: 1 1 auto;
`

const Layout = ({ children, title }) => {
  return (
    <ThemeProvider theme={theme}>
      {isUnsupported ? (
        <UnsupportedBrowser />
      ) : (
        <Wrapper
          flexDirection={'column'}
        >
          <SEO title={title} />
          <Content>{children}</Content>
        </Wrapper>
      )}
    </ThemeProvider>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
}

Layout.defaultProps = {
  title: '',
}

export default Layout
