import { getData } from '../ReactTablePlugin'
import { Blueprint } from '../../../domain/Blueprint'

describe('ReactTablePlugin', () => {
  describe('Generate data from primitive arrays', () => {
    let rows: any[] = []
    const mappings = {
      columns: ['value1', 'value2'],
    }
    const document = {
      value1: [1, 2, 3],
      value2: ['one', 'two'],
    }
    const blueprint = new Blueprint({
      name: '',
      description: '',
      type: '',
      attributes: [
        {
          attributeType: 'number',
          type: 'system/SIMOS/BlueprintAttribute',
          name: 'value1',
          dimensions: '*',
        },
        {
          attributeType: 'string',
          type: 'system/SIMOS/BlueprintAttribute',
          name: 'value2',
          dimensions: '*',
        },
      ],
      uiRecipes: [],
    })
    beforeEach(() => {
      rows = getData(mappings, document, blueprint)
    })

    it('should have 3 rows', () => {
      expect(rows).toHaveLength(3)
    })

    it('should have first item with two values', () => {
      expect(rows[0]).toEqual({
        subRows: [],
        value1: 1,
        value2: 'one',
      })
    })

    it('should have third item with one values', () => {
      expect(rows[2]).toEqual({
        subRows: [],
        value1: 3,
      })
    })
  })

  describe('Generate from list of a type', () => {
    let rows: any[] = []
    const mappings = {
      columns: ['name', 'description'],
    }
    const document = [
      { name: 'wheel1', description: 'a wheel' },
      { name: 'wheel2', description: 'another wheel' },
    ]

    const blueprint = new Blueprint({
      name: 'Wheel',
      description: '',
      type: '',
      attributes: [
        {
          attributeType: 'string',
          type: 'system/SIMOS/BlueprintAttribute',
          name: 'description',
        },
        {
          attributeType: 'string',
          type: 'system/SIMOS/BlueprintAttribute',
          name: 'name',
        },
      ],
      uiRecipes: [],
    })
    beforeEach(() => {
      rows = getData(mappings, document, blueprint)
    })

    it('should have table of wheels', () => {
      expect(rows).toHaveLength(2)
    })

    it('should have first wheel', () => {
      expect(rows[0]).toEqual({
        subRows: [],
        name: 'wheel1',
        description: 'a wheel',
      })
    })

    it('should have a second wheel', () => {
      expect(rows[1]).toEqual({
        subRows: [],
        name: 'wheel2',
        description: 'another wheel',
      })
    })
  })
})
