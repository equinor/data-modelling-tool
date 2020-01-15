import { UtilIndexPlugin } from '../UtilIndexPlugin'

function createIndexAttribute(name: string, contained: boolean) {
  return { name, contained }
}

function createBlueprintAttribute(
  name: string,
  attributeType: string,
  isArray: boolean
) {
  return {
    name,
    attributeType: attributeType,
    dimensions: isArray ? '*' : '',
  }
}

describe('UtilIndexPluginTest', () => {
  describe('Filter defaults contained in treeView', () => {
    it('should not filter primitives', () => {
      const filterIndex = UtilIndexPlugin.filterByIndexPlugin(null, undefined)
      const attributes = [createBlueprintAttribute('item', 'string', false)]
      expect(attributes.filter(filterIndex)).toMatchObject([])
    })

    it('should filter type', () => {
      const filterIndex = UtilIndexPlugin.filterByIndexPlugin(null, undefined)
      const attributes = [
        createBlueprintAttribute('item', 'system/Blueprint', false),
      ]
      expect(attributes.filter(filterIndex)).toMatchObject(attributes)
    })

    it('should filter array', () => {
      const filterIndex = UtilIndexPlugin.filterByIndexPlugin(null, undefined)
      const attributes = [
        createBlueprintAttribute('item', 'system/Blueprint', true),
      ]
      expect(attributes.filter(filterIndex)).toMatchObject(attributes)
    })
  })

  describe('Filter array contained in treeView', () => {
    it('should filter array type, contained in TreeView', () => {
      const filterIndex = UtilIndexPlugin.filterByIndexPlugin(null, {
        name: '',
        plugin: '',
        type: '',
        attributes: [createIndexAttribute('item', true)],
      })
      const attributes = [
        createBlueprintAttribute('item', 'system/BlueprintAttribute', true),
      ]
      expect(attributes.filter(filterIndex)).toMatchObject(attributes)
    })

    it('should not filter array type, not contained in index recipe', () => {
      const filterIndex = UtilIndexPlugin.filterByIndexPlugin(null, {
        name: '',
        plugin: '',
        type: '',
        attributes: [createIndexAttribute('item', false)],
      })
      const attributes = [
        createBlueprintAttribute('item', 'system/BlueprintAttribute', true),
      ]
      expect(attributes.filter(filterIndex)).toMatchObject([])
    })
  })

  describe('Filter types in contained in Treeview', () => {
    it('should filter type, contained in TreeView', () => {
      const filterIndex = UtilIndexPlugin.filterByIndexPlugin(null, {
        name: '',
        plugin: '',
        type: '',
        attributes: [createIndexAttribute('item', true)],
      })
      const attributes = [
        createBlueprintAttribute('item', 'system/BlueprintAttribute', false),
      ]
      expect(attributes.filter(filterIndex)).toMatchObject(attributes)
    })

    it('should not filter array type, not contained in TreeView', () => {
      const filterIndex = UtilIndexPlugin.filterByIndexPlugin(null, {
        name: '',
        plugin: '',
        type: '',
        attributes: [createIndexAttribute('item', false)],
      })
      const attributes = [
        createBlueprintAttribute('item', 'system/BlueprintAttribute', false),
      ]
      expect(attributes.filter(filterIndex)).toMatchObject([])
    })
  })

  describe('Filter primitives contained in treeView', () => {
    it('should filter primitive, contained in TreeView', () => {
      const filterIndex = UtilIndexPlugin.filterByIndexPlugin(null, {
        name: '',
        plugin: '',
        type: '',
        attributes: [createIndexAttribute('item', true)],
      })
      const attributes = [createBlueprintAttribute('item', 'string', false)]
      expect(attributes.filter(filterIndex)).toMatchObject(attributes)
    })

    it('should not filter array primitive, not contained in TreeView', () => {
      const filterIndex = UtilIndexPlugin.filterByIndexPlugin(null, {
        name: '',
        plugin: '',
        type: '',
        attributes: [createIndexAttribute('item', false)],
      })
      const attributes = [createBlueprintAttribute('item', 'string', true)]
      expect(attributes.filter(filterIndex)).toMatchObject([])
    })
  })
})
