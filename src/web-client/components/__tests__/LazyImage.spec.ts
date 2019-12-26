import { Wrapper, mount } from '@vue/test-utils'
import LazyImage from '../LazyImage.vue'

describe('LazyImage.vue', () => {
  const propsData = {
    src: 'testImage.png',
    alt: 'Test Image',
    fullWidth: 500,
    lazyWidth: 300,
    imageClass: 'test-class',
  }
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('GIVEN initial state', () => {
    const observeSpy = jest.fn()
    const disconnectSpy = jest.fn()
    let wrapper: Wrapper<any>
    beforeEach(() => {
      ;(window as any).IntersectionObserver = jest.fn().mockImplementation(() => ({
        observe: observeSpy,
        disconnect: disconnectSpy,
      }))

      wrapper = mount(LazyImage, {
        propsData,
      })
    })

    it('THEN has the unloaded class', () => {
      expect(wrapper.find('.lazy-image--unloaded').exists()).toBe(true)
    })

    it('THEN binds the image class correctly', () => {
      expect(wrapper.find('img.test-class').exists()).toBe(true)
    })

    describe('WHEN image loaded', () => {
      beforeEach(() => {
        wrapper.find('.lazy-image').trigger('load')
      })

      it('THEN renders the image correctly', () => {
        const qs = '?nf_resize=fit&w='
        const imageAttrs = wrapper.find('.lazy-image').attributes()
        expect(imageAttrs.src).toBe(`testImage.png${qs}300`)
        expect(imageAttrs.alt).toBe('Test Image')
      })

      it('THEN has the lazy class', () => {
        expect(wrapper.find('.lazy-image--lazy').exists()).toBe(true)
      })

      it('THEN does not have the unloaded class', () => {
        expect(wrapper.find('.lazy-image--unloaded').exists()).toBe(false)
      })

      it('THEN observes the element', () => {
        expect(observeSpy).toBeCalledTimes(1)
        expect(observeSpy).toBeCalledWith(wrapper.element)
      })

      describe('WHEN image enters viewport', () => {
        beforeEach(() => {
          // @ts-ignore
          const observerCallback = window.IntersectionObserver.mock.calls[0][0]
          observerCallback([{ isIntersecting: true }])
        })

        it('THEN stops tracking element', () => {
          expect(disconnectSpy).toBeCalledTimes(1)
        })

        it('THEN renders the image correctly', () => {
          const qs = '?nf_resize=fit&w='
          const imageAttrs = wrapper.find('.lazy-image').attributes()
          expect(imageAttrs.src).toBe(`testImage.png${qs}500`)
          expect(imageAttrs.alt).toBe('Test Image')
        })

        it('THEN does not have the lazy class', () => {
          expect(wrapper.find('.lazy-image--lazy').exists()).toBe(false)
        })
      })

      describe('WHEN component destroyed', () => {
        beforeEach(() => {
          wrapper.destroy()
        })

        it('THEN stops observing', () => {
          expect(disconnectSpy).toBeCalledTimes(1)
        })
      })
    })
  })
})
