import React from 'react'
import PropTypes from 'prop-types'

import { Text } from 'rebass'
import DrawerTextChunk from './index.jsx'
import styled from 'styled-components'
import { themeGet } from 'styled-system'

const PoemTitle = styled(Text)`    
    text-transform: uppercase;
    flex-grow: 1;
    line-height: 1;
  `

const DrawerPoemENChunk = ({ header, body, poemTitle }) => (
    <div>
        <DrawerTextChunk
            header={header}
            body={body}
        />
        <PoemTitle>"{poemTitle}"</PoemTitle>
    </div>
)

DrawerPoemENChunk.propTypes = {
  header: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  poemTitle: PropTypes.string.isRequred,
}

DrawerPoemENChunk.defaultProps = {
  poemTitle: "Default Title"
}

export default DrawerPoemENChunk
