import externalClick from '../externalClick'
import { VNodeDirective, VNode } from 'vue/types/umd'

describe('Directive - externlClick', () => {
  let el: HTMLElement
  let binding: VNodeDirective
  let vnode: VNode

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('bind', () => {
    let docEventListenerSpy: jest.SpyInstance

    beforeEach(() => {
      docEventListenerSpy = jest.spyOn(document, 'addEventListener')
      el = document.createElement('div')
      binding = {
        name: 'binding',
      }
      vnode = { isRootInsert: true, isComment: false }
      // @ts-ignore
      externalClick.bind(el, binding, vnode)
    })

    it('THEN binds to document', () => {
      expect(docEventListenerSpy).toBeCalledTimes(1)
    })

    describe('unbind', () => {
      let removeEventListenerSpy: jest.SpyInstance
      const elExternalClick = { foo: 'bar' }

      beforeEach(() => {
        ;(el as any).onClickExternal = elExternalClick
        removeEventListenerSpy = jest.spyOn(document, 'removeEventListener')

        // @ts-ignore
        externalClick.unbind(el)
      })

      it('THEN removes event listener from document', () => {
        expect(removeEventListenerSpy).toBeCalledTimes(1)
        expect(removeEventListenerSpy).toBeCalledWith('click', elExternalClick)
      })

      it('THEN deletes the directive form the element', () => {
        expect((el as any).onClickExternal).toBeUndefined()
      })
    })
  })
})
