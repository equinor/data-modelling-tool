import React from 'react'

export const LayoutContext = React.createContext({})

export enum LayoutComponents {
  blueprint = 'blueprint',
  entity = 'entity',
}

type Props = {
  children: any
  layout: any
}

const isOpen = (layout: any, id: string) => {
  return layout.myLayout.root.getItemsById(id).length > 0
}

export const LayoutProvider = ({ children, layout }: Props) => {
  // TODO: Store layout in local storage?

  const add = (
    id: string,
    title: string,
    component: LayoutComponents,
    data: object
  ) => {
    const config = {
      title: title,
      id: id,
      type: 'react-component',
      component: component,
      props: data,
    }
    if (!isOpen(layout, id)) {
      layout.myLayout.root.contentItems[0].addChild(config)
    }
  }

  return (
    <LayoutContext.Provider
      value={{
        add,
      }}
    >
      {children}
    </LayoutContext.Provider>
  )
}
