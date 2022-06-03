/**
 * Work space for attaching plugin to the dmt tool.
 * External dependencies:
 * - option1: should either be provided by the DMT (in package.json)
 * - option2: create a lib folder and add transpiled javascript files. Similar to dist folders in node_modules.
 *
 * External plugins must have a unique name, not conflicting with the DMT official plugin names.
 */

/**
 * Work space for attaching plugin to the dmt tool.
 * External dependencies:
 * - option1: should either be provided by the DMT (in package.json)
 * - option2: create a lib folder and add transpiled javascript files. Similar to dist folders in node_modules.
 *
 * External plugins must have a unique name, not conflicting with the DMT official plugin names.
 */

//****************************************************** */

//table
import styled from 'styled-components'

//collapsable sections
import { useState } from 'react'
import useCollapse from 'react-collapsed'

//****************************************************** */

//collapsable style

const Wrapper = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 2px;
`

const Toggle = styled.div`
  background-color: #f4f4f4;
  color: #444;
  cursor: pointer;
  padding: 6px;
  width: 100%;
  text-align: left;
  border: none;
`

const Content = styled.div`
  padding: 5px;
  animation: fadein 0.35s ease-in;
`
const Icons = styled.span`
  margin-right: 5px;
`
//****************************************************** */

const singleInput = ({ name, segment }) => {
  const [isOpen, setOpen] = useState(true)
  const { getCollapseProps, getToggleProps } = useCollapse({ isOpen })

  const sectionTitle = name

  return (
    <Wrapper>
      <Toggle
        {...getToggleProps({
          onClick: () => setOpen((oldOpen) => !oldOpen),
        })}
      >
        <Icons>
          {isOpen && <FaChevronDown />}
          {!isOpen && <FaChevronRight />}
        </Icons>
        {sectionTitle}
      </Toggle>
      <Content {...getCollapseProps()}>{segment}</Content>
    </Wrapper>
  )
}
//****************************************************** */

//********************************************************//
//********************************************************//

export { singleInput }
