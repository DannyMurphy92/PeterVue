import { trackPictureImpression, initGa, pageView, disableTracking } from '../index'

describe('Tracking', () => {
  const gtagSpy = jest.fn()

  afterEach(() => {
    jest.clearAllMocks()
  })

  beforeEach(() => {
    window.gtag = gtagSpy
  })

  describe('GIVEN initial state', () => {
    describe('GIVEN events triggered when gtag not initialized', () => {
      beforeEach(() => {
        pageView()
        trackPictureImpression('test')
      })

      it('THEN does not invoke ga', () => {
        expect(gtagSpy).not.toBeCalled()
      })

      describe('WHEN ga initialised', () => {
        beforeEach(() => {
          initGa()
        })

        it('THEN initializes GA correctly', () => {
          expect(gtagSpy).toBeCalledWith('config', 'UA-155099216-1')
        })

        it('THEN processes the previous events', () => {
          expect(gtagSpy).toHaveBeenCalledWith('pageview')
          expect(gtagSpy).toHaveBeenCalledWith('event', 'impression', {
            event_category: 'picture',
            event_label: 'test',
          })
        })

        it('THEN sets window disable tracking to false', () => {
          expect(window['ga-disable-UA-155099216-1']).toBe(false)
        })

        describe('WHEN disable tracking', () => {
          beforeEach(() => {
            disableTracking()
          })

          it('THEN sets window disable tracking to true', () => {
            expect(window['ga-disable-UA-155099216-1']).toBe(true)
          })

          describe('WHEN an event is triggered', () => {
            beforeEach(() => {
              jest.clearAllMocks()
              pageView()
              trackPictureImpression('test')
            })

            it('THEN does not track the action', () => {
              expect(gtagSpy).not.toBeCalled()
            })
          })
        })
      })
    })
  })

  describe('Impression tracking', () => {
    beforeEach(() => {
      initGa()
      jest.clearAllMocks()
      trackPictureImpression('testlabel')
    })

    it('Tracks event in GA correctly', () => {
      expect(gtagSpy).toBeCalledTimes(1)
      expect(gtagSpy).toBeCalledWith('event', 'impression', {
        event_category: 'picture',
        event_label: 'testlabel',
      })
    })
  })

  describe('pageview', () => {
    beforeEach(() => {
      initGa()
      jest.clearAllMocks()
      pageView()
    })

    it('THEN tracks pageview in ga', () => {
      expect(gtagSpy).toBeCalledTimes(1)
      expect(gtagSpy).toBeCalledWith('pageview')
    })
  })
})
