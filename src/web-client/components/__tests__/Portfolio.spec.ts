import { Wrapper, shallowMount } from '@vue/test-utils'
import Portfolio from '../Portfolio.vue'

jest.mock('@/utils/webpackContexts/portfolio', () => {
  const context: any = (id: string) => id
  context.keys = () => {
    return ['image1.jpg', 'image2.jpg', 'images/test/image3.jpg']
  }
  return context
})

describe('Portfolio.vue', () => {
  describe('GIVEN initial state', () => {
    let wrapper: Wrapper<any>

    beforeEach(() => {
      wrapper = shallowMount(Portfolio)
    })

    it('THEN renders every image in the portfolio directory', () => {
      const images = wrapper.findAll({ name: 'LazyImage' })

      expect(images).toHaveLength(3)
      expect(images.at(0).props().imageClass).toStrictEqual(`portfolio-image`)
      expect(images.at(0).props().src).toStrictEqual(`image1.jpg`)
      expect(images.at(1).props().src).toStrictEqual(`image2.jpg`)
      expect(images.at(2).props().src).toStrictEqual(`images/test/image3.jpg`)
    })
  })
})
