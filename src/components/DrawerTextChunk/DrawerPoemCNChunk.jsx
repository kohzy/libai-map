import React from 'react'
import PropTypes from 'prop-types'

import { Text } from 'rebass'
import DrawerTextChunk from './index.jsx'
import styled, { themeGet } from 'style'

const Title = styled(Text).attrs({
    as: 'p',
  })`    
    text-transform: uppercase;
    flex-grow: 1;
    line-height: 1;
    color: ${themeGet('colors.primary.600')};
  `

const DrawerPoemCNChunk = ({ header, body, poemTitle }) => (
    <div>
        <DrawerTextChunk
            header={header}
            body={body}
        />
        <p>《{poemTitle}》</p>
    </div>
)

DrawerPoemCNChunk.propTypes = {
  header: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  poemTitle: PropTypes.string.isRequred,
}

DrawerPoemCNChunk.defaultProps = {
  poemTitle: "Default Title"
}

export default DrawerPoemCNChunk
