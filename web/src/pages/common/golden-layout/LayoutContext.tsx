import React from 'react'

export const LayoutContext = React.createContext({})

export enum LayoutComponents {
  blueprint = 'blueprint',
  document = 'document',
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

  const remove = (id: string) => {
    if (isOpen(layout, id)) {
      const components = layout.myLayout.root.getItemsById(id)
      components.forEach((component: any) => component.remove())
    }
  }

  const update = (id: string, title: string) => {
    if (isOpen(layout, id)) {
      const components = layout.myLayout.root.getItemsById(id)
      components.forEach((component: any) => component.setTitle(title))
    }
  }

  const refresh = (id: string) => {
    // TODO: Can this be done better?
    if (!id) console.log('An empty ID was given. This will likely break')
    if (isOpen(layout, id)) {
      const components = layout.myLayout.root.getItemsById(id)
      components[0].remove()
      layout.myLayout.root.contentItems[0].addChild(components[0].config)
    }
  }

  return (
    <LayoutContext.Provider
      value={{
        add,
        remove,
        update,
        refresh,
      }}
    >
      {children}
    </LayoutContext.Provider>
  )
}
