import {Swiper, SwiperRef, SwiperSlide} from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import './AgesSlider.scss'
import ArrowIcon from '../../assets/ArrowIcon'

import {generateAges, type AgesInterval, type EventsData} from '../../shared/mock/generateAges'

import {useCallback, useEffect, useRef, useState} from 'react'

const mockData: AgesInterval[] = generateAges()

const AgesSlider = () => {
  const [activePeriodIndex, setActivePeriodIndex] = useState(0)

  return (
    <div className='container'>
      <div className='item'>
        <div className='title'>
          Исторические <br />
          даты
        </div>
        <CircularSlider activeIndex={activePeriodIndex} onChange={setActivePeriodIndex} />
        <EventsSlider events={mockData[activePeriodIndex].events} />
      </div>
    </div>
  )
}

type CircularSliderProps = {
  activeIndex: number
  onChange: (index: number) => void
}

const CircularSlider = ({activeIndex, onChange}: CircularSliderProps) => {
  const swiperRef = useRef<SwiperRef>(null)
  const prevBtnRef = useRef<HTMLButtonElement>(null)
  const nextBtnRef = useRef<HTMLButtonElement>(null)
  const totalSlides = mockData.length

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

  const handleSlideChange = useCallback(() => {
    const swiper = swiperRef.current?.swiper
    if (!swiper) return
    onChange(swiper.activeIndex) // синхронизируем родительский state
  }, [onChange])

  useEffect(() => {
    const swiper = swiperRef.current?.swiper
    if (swiper) {
      swiper.on('slideChange', handleSlideChange)
      return () => swiper.off('slideChange', handleSlideChange)
    }
  }, [handleSlideChange])

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

      <div className='circle-slider__circle'></div>
      <Swiper
        ref={swiperRef}
        slidesPerView={1}
        allowTouchMove={false}
        onSlideChange={swiper => onChange(swiper.activeIndex)}
        className='circle-slider__swiper'
      >
        {mockData.map((p, idx) => (
          <SwiperSlide key={idx}>
            <div className='circle-slider__age-interval'>
              <span>{p.from}</span>
              <span> </span>
              <span>{p.to}</span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

type EventsSliderProps = {
  events: EventsData[]
}

const EventsSlider = ({events}: EventsSliderProps) => {
  const swiperRef = useRef<SwiperRef>(null)
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

  return (
    <div className='events-slider'>
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
