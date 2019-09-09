import { getDestination, treeNodes } from '../TreeUtils'
import tree from './Tree.json'

/*
The tree:

 0 (root)
     -> 1 (0)
     -> 2 (1)
     -> 3 (2)
     -> 4 (3)
        -> 5 (0)
        -> 6 (1)
        -> 7 (2)
    -> 8 (4)
    -> 9 (5)
    -> 10 (6)
        -> 11 (0)
        -> 12 (1)
        -> 13 (2)
            -> 14 (0)
            -> 15 (1)
            -> 16 (2)
        -> 17 (3)
        -> 18 (4)
    -> 19 (7)
    -> 20 (8)
*/

const nodes = [
  { currentItem: tree['0'], level: 0, path: [0] },
  ...treeNodes('0', tree),
]

describe('tree utils', () => {
  describe('getDestination', () => {
    describe('moving down', () => {
      describe('same parent', () => {
        it('moves to the middle of the list', () => {
          const sourceNode = {
            parentId: 0,
          }
          expect(getDestination(1, 2, sourceNode, nodes)).toEqual({
            index: 1,
            parentId: '0',
          })
          expect(getDestination(1, 3, sourceNode, nodes)).toEqual({
            index: 2,
            parentId: '0',
          })
        })
        it('moves to the end of the list', () => {
          const sourceNode = {
            parentId: 3,
          }
          expect(getDestination(5, 7, sourceNode, nodes)).toEqual({
            parentId: '4',
          })
        })
      })
      describe('different parent', () => {
        describe('higher level', () => {
          it('moves to the middle of the list', () => {
            expect(getDestination(6, 8, {}, nodes)).toEqual({
              index: 5,
              parentId: '0',
            })
          })
          it('moves to the end of the list to the top level', () => {
            expect(getDestination(6, 20, {}, nodes)).toEqual({ parentId: '0' })
          })
        })
        describe('same level', () => {
          it('moves to the top of the list', () => {
            expect(getDestination(5, 10, {}, nodes)).toEqual({
              index: 0,
              parentId: '10',
            })
          })

          it('moves to the middle of the list', () => {
            expect(getDestination(5, 12, {}, nodes)).toEqual({
              index: 2,
              parentId: '10',
            })
          })
        })
        describe('lower level', () => {
          it('moves to the top of the list', () => {
            expect(getDestination(5, 13, {}, nodes)).toEqual({
              parentId: '13',
              index: 0,
            })
          })
          it('moves to the middle of the list', () => {
            expect(getDestination(5, 15, {}, nodes)).toEqual({
              parentId: '13',
              index: 2,
            })
          })
          it('moves to the end of the list', () => {
            expect(getDestination(5, 16, {}, nodes)).toEqual({
              parentId: '13',
            })
          })
        })
      })
    })
    describe('moving up', () => {
      describe('same parent', () => {
        it('moves to the top of the list', () => {
          expect(getDestination(6, 5, {}, nodes)).toEqual({
            parentId: '4',
            index: 0,
          })
        })
        it('moves to the middle of the list', () => {
          expect(getDestination(7, 6, {}, nodes)).toEqual({
            parentId: '4',
            index: 1,
          })
        })
      })
      describe('different parent', () => {
        describe('higher level', () => {
          it('moves to the top of the list on the top level', () => {
            expect(getDestination(4, 0, {}, nodes)).toEqual({
              parentId: '0',
              index: 0,
            })
          })
          it('moves to the top of the list not on the top level', () => {
            expect(getDestination(15, 11, {}, nodes)).toEqual({
              parentId: '10',
              index: 0,
            })
          })
          it('moves to the middle of the list', () => {
            // TODO: Maybe we should create a new root node?
            expect(getDestination(4, 1, {}, nodes)).toEqual({
              parentId: '0',
              index: 0,
            })
          })
        })
        describe('same level', () => {
          it('moves to the top of the list on same level', () => {
            expect(getDestination(12, 5, {}, nodes)).toEqual({
              parentId: '4',
              index: 0,
            })
          })
          it('moves to the middle of the list', () => {
            expect(getDestination(12, 6, {}, nodes)).toEqual({
              parentId: '4',
              index: 1,
            })
          })
          it('moves to the end of the list', () => {
            expect(getDestination(12, 7, {}, nodes)).toEqual({
              parentId: '4',
              index: 2,
            })
          })
        })
        describe('lower level', () => {
          it('moves to the top of the list', () => {
            expect(getDestination(18, 14, {}, nodes)).toEqual({
              parentId: '13',
              index: 0,
            })
          })
          it('moves to the middle of the list', () => {
            expect(getDestination(18, 15, {}, nodes)).toEqual({
              parentId: '13',
              index: 1,
            })
          })
          it('moves to the end of the list', () => {
            expect(getDestination(18, 16, {}, nodes)).toEqual({
              parentId: '13',
              index: 2,
            })
          })
        })
      })
    })
  })
})
