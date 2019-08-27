import React, { createContext, useState, useContext } from 'react'
import styled from 'styled-components'

const context = createContext({
  activeTabId: 0,
  changeTab: (id: string) => {},
})

const TabList = styled.div``

const TabStyled: any = styled.div`
  background-color: ${(props: any) => (props.isSelected ? 'white' : 'white')};
  color: ${(props: any) => (props.isSelected ? 'black' : 'black')};
  padding: 10px 15px;
  display: inline-block;
  border: black 1px;
  margin-bottom: 20px;
  cursor: pointer;
  border-bottom-color: ${(props: any) =>
    props.isSelected ? 'black' : 'white'};
  border-bottom-style: solid;
  border-bottom-width: ${(props: any) => (props.isSelected ? '2px' : '0px')};

  &:hover {
    color: ${(props: any) => (props.isSelected ? 'black' : 'gray')};
  }
`

const Tab = ({ id, children }: any) => {
  const tab = useContext(context)
  return (
    <TabStyled
      isSelected={tab.activeTabId === id}
      onClick={() => tab.changeTab(id)}
    >
      {children}
    </TabStyled>
  )
}

const TabPanel = ({ whenActive, children }: any) => {
  const tab = useContext(context)
  return tab.activeTabId === whenActive ? children : null
}

const TabSwitcher = ({ children }: any) => {
  const [activeTabId, setActiveTab] = useState<number>(0)
  const changeTab = (newTabId: any) => {
    setActiveTab(newTabId)
  }

  const tabs = React.Children.map(
    children[0].props.children,
    (child, index) => {
      return React.cloneElement(child, {
        id: index,
      })
    }
  )

  const panels = React.Children.map(
    children.slice(1, children.length),
    (child, index) => {
      return React.cloneElement(child, {
        whenActive: index,
      })
    }
  )

  return (
    <context.Provider
      value={{
        activeTabId: activeTabId,
        changeTab: changeTab,
      }}
    >
      {tabs}
      {panels}
    </context.Provider>
  )
}
export default TabSwitcher
export { Tab, TabPanel, TabList }
