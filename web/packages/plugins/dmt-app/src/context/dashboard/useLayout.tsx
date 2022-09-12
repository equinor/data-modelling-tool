import { useState } from 'react'

export enum ELayoutComponents {
  blueprint = 'blueprint',
  document = 'document',
}

export interface IModels {
  layout: any
}

export interface IOperations {
  add(
    id: string,
    title: string,
    component: ELayoutComponents,
    data: object
  ): void

  remove(id: string): void

  focus(id: string): void

  update(id: string, title: string): void

  refresh(id: string): void

  refreshByFilter(filter: string): void

  registerLayout(register: any): void

  isOpen(id: string): boolean
}

export interface ILayout {
  models: IModels
  operations: IOperations
}

export const useLayout = (): ILayout => {
  const [layout, setLayout] = useState({ myLayout: null })

  const isOpen = (id: string) => {
    //@ts-ignore
    return layout.myLayout.root.getItemsById(id).length > 0
  }

  const add = (
    id: string,
    title: string,
    component: ELayoutComponents,
    data: object
  ) => {
    if (!isOpen(id)) {
      //@ts-ignore
      layout.myLayout.root.contentItems[0].addChild({
        title: title,
        id: id,
        type: 'react-component',
        component: component,
        props: data,
      })
    }
  }

  const remove = (id: string) => {
    if (isOpen(id)) {
      //@ts-ignore
      const components = layout.myLayout.root.getItemsById(id)
      components.forEach((component: any) => component.remove())
    }
  }

  const focus = (id: string) => {
    if (isOpen(id)) {
      //@ts-ignore
      const window = layout.myLayout.root.getItemsById(id)[0]
      // TODO: What is this?
      if (window.parent) {
        window.parent.setActiveContentItem(window)
      }
    }
  }

  const update = (id: string, title: string) => {
    if (isOpen(id)) {
      //@ts-ignore
      const components = layout.myLayout.root.getItemsById(id)
      components.forEach((component: any) => component.setTitle(title))
    }
  }

  const refresh = (id: string) => {
    if (isOpen(id)) {
      //@ts-ignore
      const components = layout.myLayout.root.getItemsById(id)
      //@ts-ignore
      layout.myLayout.eventHub.emit('props-updated', components[0].config.id)
    }
  }

  const refreshByFilter = (filter: string) => {
    //@ts-ignore
    const components = layout.myLayout.root.getItemsByFilter((item: any) => {
      if ('id' in item.config) {
        return item.config.id.startsWith(filter)
      } else {
        return false
      }
    })
    components.forEach((component: any) => refresh(component.config.id))
  }

  const registerLayout = (register: any) => {
    setLayout(register)
  }

  return {
    models: {
      layout,
    },
    operations: {
      add,
      focus,
      remove,
      update,
      refresh,
      refreshByFilter,
      registerLayout,
      isOpen,
    },
  }
}
