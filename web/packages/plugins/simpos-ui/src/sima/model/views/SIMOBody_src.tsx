import styled from 'styled-components'

import { useState } from 'react'
import useCollapse from 'react-collapsed'

//********************************************************//
/* ********************************************************* */
//Custom views
/* ********************************************************* */

const TableStyles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;
    border-bottom: 25px;
    padding-bottom: 100px;

    tr {
      :last-child {
        td {
          border-bottom: 1;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`
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

//********************************************************//
const CollapsedView = ({ section, sectionTitle, defaultState }) => {
  const [isOpen, setOpen] = useState(defaultState)
  const { getCollapseProps, getToggleProps } = useCollapse({ isOpen })

  return (
    <Wrapper>
      <Toggle
        {...getToggleProps({
          onClick: () => {
            setOpen((oldOpen) => !oldOpen)
          },
        })}
      >
        <Icons>
          {isOpen && <FaChevronDown />}
          {!isOpen && <FaChevronRight />}
        </Icons>
        {sectionTitle}
      </Toggle>
      <Content {...getCollapseProps()}>{section}</Content>
    </Wrapper>
  )
}

//********************************************************//

const SIMA_Model_SIMOBody = ({ parent, document, children }) => {
  console.log(document)

  var section = ''

  return (
    <div className="container">
      <CollapsedView
        section={
          <SIMA_Model_StructuralMass document={document.structuralMass} />
        }
        sectionTitle={'Mass'}
        defaultState={false}
      />
      <CollapsedView
        section={
          <SIMA_Model_QuadCurrentCoeffPlot
            document={document.quadraticCurrentCoefficients}
          />
        }
        sectionTitle={'Quadratic Current'}
        defaultState={false}
      />
      <CollapsedView
        section={
          <SIMA_Model_FirstOrderMotionTransferFunction
            document={document.firstOrderMotionTransferFunction}
          />
        }
        sectionTitle={'RAO'}
        defaultState={false}
      />
    </div>
  )
}
export { SIMA_Model_SIMOBody }
