import React from 'react'

export const LayoutContext = React.createContext({})

export enum ELayoutComponents {
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
    component: ELayoutComponents,
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

  const focus = (id: string) => {
    if (isOpen(layout, id)) {
      const window = layout.myLayout.root.getItemsById(id)[0]
      window.parent.setActiveContentItem(window)
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
      layout.myLayout.eventHub.emit('props-updated', components[0].config.id)
      //components[0].remove()
      //layout.myLayout.root.contentItems[0].addChild(components[0].config)
    }
  }

  const refreshByFilter = (filter: string) => {
    const components = layout.myLayout.root.getItemsByFilter((item: any) => {
      if ('id' in item.config) {
        return item.config.id.startsWith(filter)
      } else {
        return false
      }
    })
    components.forEach((component: any) => refresh(component.config.id))
  }

  return (
    <LayoutContext.Provider
      value={{
        add,
        focus,
        remove,
        update,
        refresh,
        refreshByFilter,
      }}
    >
      {children}
    </LayoutContext.Provider>
  )
}
