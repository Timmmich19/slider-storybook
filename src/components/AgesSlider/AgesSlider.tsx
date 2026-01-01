import {Swiper, SwiperRef, SwiperSlide} from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import './AgesSlider.scss'
import ArrowIcon from '../../assets/ArrowIcon'

import gsap from 'gsap'

import {generateAges, type AgesInterval, type EventsData} from '../../shared/mock/generateAges'

import {useCallback, useEffect, useRef, useState} from 'react'

const mockData: AgesInterval[] = generateAges()

const AgesSlider = () => {
  const [activePeriodIndex, setActivePeriodIndex] = useState(0)
  const [isCircleAnimating, setIsCircleAnimating] = useState(false)

  return (
    <div className='container'>
      <div className='item'>
        <div className='title'>
          Исторические <br />
          даты
        </div>
        <CircularSlider
          activeIndex={activePeriodIndex}
          onChange={setActivePeriodIndex}
          onAnimateStateChange={setIsCircleAnimating}
        />
        <EventsSlider events={mockData[activePeriodIndex].events} isCircleAnimating={isCircleAnimating} />
      </div>
    </div>
  )
}

type CircularSliderProps = {
  activeIndex: number
  onChange: (index: number) => void
  onAnimateStateChange: (isAnimating: boolean) => void
}

const CircularSlider = ({activeIndex, onChange, onAnimateStateChange}: CircularSliderProps) => {
  const swiperRef = useRef<SwiperRef>(null)
  const prevBtnRef = useRef<HTMLButtonElement>(null)
  const nextBtnRef = useRef<HTMLButtonElement>(null)
  const totalSlides = mockData.length

  const [fromYear, setFromYear] = useState(mockData[0].from)
  const [toYear, setToYear] = useState(mockData[0].to)

  const lastTargetRef = useRef<{from: number; to: number}>({
    from: mockData[0].from,
    to: mockData[0].to
  })

  useEffect(() => {
    const swiper = swiperRef.current?.swiper
    if (swiper && swiper.activeIndex !== activeIndex) {
      swiper.slideTo(activeIndex)
    }
  }, [activeIndex])

  const handlePrev = useCallback(() => {
    swiperRef.current?.swiper?.slidePrev()
  }, [])

  const handleNext = useCallback(() => {
    swiperRef.current?.swiper?.slideNext()
  }, [])

  const animateYears = useCallback(
    (newIndex: number) => {
      const nextInterval = mockData[newIndex]

      const fromStart = lastTargetRef.current.from
      const toStart = lastTargetRef.current.to

      const fromEnd = nextInterval.from
      const toEnd = nextInterval.to

      const state = {from: fromStart, to: toStart}

      onAnimateStateChange(true)

      gsap.to(state, {
        from: fromEnd,
        to: toEnd,
        duration: 0.6,
        ease: 'none',
        onUpdate: () => {
          setFromYear(Math.round(state.from))
          setToYear(Math.round(state.to))
        },
        onComplete: () => {
          lastTargetRef.current = {from: fromEnd, to: toEnd}
          onAnimateStateChange(false)
        }
      })
    },
    [onAnimateStateChange]
  )

  const handleDotClick = (index: number) => {
    const swiper = swiperRef.current?.swiper
    if (!swiper) return
    swiper.slideTo(index)
  }

  const handleSlideChange = useCallback(() => {
    const swiper = swiperRef.current?.swiper
    if (!swiper) return

    const newIndex = swiper.activeIndex
    onChange(newIndex)
    animateYears(newIndex)
  }, [onChange, animateYears])

  useEffect(() => {
    const swiper = swiperRef.current?.swiper
    if (swiper) {
      swiper.on('slideChange', handleSlideChange)
      return () => swiper.off('slideChange', handleSlideChange)
    }
  }, [handleSlideChange])

  useEffect(() => {
    animateYears(activeIndex)
  }, [activeIndex, animateYears])

  const DOT_RADIUS_OFFSET = 0 // на сколько кнопки вынести за круг
  const CIRCLE_RADIUS = 180 // у тебя circle 360px → радиус 180

  const getDotPosition = (index: number, total: number) => {
    const angleStep = 360 / total
    // начинаем с 12 часов: -90 градусов, по часовой → +angle
    const angleDeg = -90 + angleStep * index
    const angleRad = (angleDeg * Math.PI) / 180

    const r = CIRCLE_RADIUS + DOT_RADIUS_OFFSET

    const x = r * Math.cos(angleRad)
    const y = r * Math.sin(angleRad)

    // x, y здесь — смещение от центра
    return {x, y}
  }

  return (
    <div className='circle-slider'>
      <div className='circle-slider__controls'>
        <div className='circle-slider__counter'>
          {activeIndex + 1 < 10 ? `0${activeIndex + 1}` : activeIndex + 1}/
          {totalSlides < 10 ? `0${totalSlides}` : totalSlides}
        </div>

        <div className='circle-slider__buttons'>
          <button ref={prevBtnRef} className='circle-slider__prev-btn' onClick={handlePrev}>
            <ArrowIcon direction='left' />
          </button>
          <button ref={nextBtnRef} className='circle-slider__next-btn' onClick={handleNext}>
            <ArrowIcon direction='right' />
          </button>
        </div>
      </div>

      <div className='circle-slider__circle'>
        <div className='circle-slider__dots'>
          {mockData.map((_, idx) => {
            const {x, y} = getDotPosition(idx, totalSlides)
            return (
              <button
                key={idx}
                type='button'
                className={`circle-slider__dot ${idx === activeIndex ? 'circle-slider__dot--active' : ''}`}
                style={{
                  transform: `translate(${x}px, ${y}px)`
                }}
                onClick={() => handleDotClick(idx)}
              >
                {idx + 1}
              </button>
            )
          })}
        </div>
      </div>

      <Swiper
        ref={swiperRef}
        slidesPerView={1}
        speed={0}
        allowTouchMove={false}
        onSlideChange={swiper => onChange(swiper.activeIndex)}
        className='circle-slider__swiper'
      >
        {mockData.map((interval, idx) => (
          <SwiperSlide key={idx}>
            <div className='circle-slider__age-interval'>
              <span>{fromYear}</span>
              <span> </span>
              <span>{toYear}</span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

type EventsSliderProps = {
  events: EventsData[]
  isCircleAnimating: boolean
}

const EventsSlider = ({events, isCircleAnimating}: EventsSliderProps) => {
  const swiperRef = useRef<SwiperRef>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const prevBtnRef = useRef<HTMLButtonElement>(null)
  const nextBtnRef = useRef<HTMLButtonElement>(null)

  const handlePrev = useCallback(() => {
    swiperRef.current?.swiper?.slidePrev()
  }, [])

  const handleNext = useCallback(() => {
    swiperRef.current?.swiper?.slideNext()
  }, [])

  const handleSlideChange = useCallback(() => {
    const swiper = swiperRef.current?.swiper
    if (!swiper || !prevBtnRef.current || !nextBtnRef.current) return

    prevBtnRef.current.style.opacity = swiper.activeIndex === 0 ? '0' : '1'
    nextBtnRef.current.style.opacity = swiper.isEnd ? '0' : '1'
  }, [])

  useEffect(() => {
    const swiper = swiperRef.current?.swiper
    if (swiper) {
      swiper.on('slideChange', handleSlideChange)
      handleSlideChange()
      return () => swiper.off('slideChange', handleSlideChange)
    }
  }, [handleSlideChange])

  useEffect(() => {
    swiperRef.current?.swiper?.slideTo(0)
  }, [events])

  useEffect(() => {
    if (!wrapperRef.current) return

    if (isCircleAnimating) {
      gsap.to(wrapperRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out',
        pointerEvents: 'none'
      })
    } else {
      gsap.to(wrapperRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.in',
        pointerEvents: 'auto'
      })
    }
  }, [isCircleAnimating])

  return (
    <div className='events-slider' ref={wrapperRef}>
      <div className='events-slider__buttons'>
        <button
          ref={prevBtnRef}
          className='events-slider__prev-btn'
          onClick={handlePrev}
          aria-label='Предыдущее событие'
        >
          <ArrowIcon direction='left' />
        </button>
        <button
          ref={nextBtnRef}
          className='events-slider__next-btn'
          onClick={handleNext}
          aria-label='Следующее событие'
        >
          <ArrowIcon direction='right' />
        </button>
      </div>

      <Swiper
        ref={swiperRef}
        spaceBetween={40}
        slidesPerView={'auto'}
        className='events-slider__swiper'
        watchSlidesProgress={true}
      >
        {events.map((el, idx) => (
          <SwiperSlide key={idx}>
            <EventSlide element={el} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

type EventSlideProps = {element: EventsData}

const EventSlide = ({element}: EventSlideProps) => {
  return (
    <div className='events-slider__slide'>
      <span className='events-slider__slide-title'>{element.titleYear}</span>
      <p className='events-slider__slide-desc'>{element.desc}</p>
    </div>
  )
}

export default AgesSlider
