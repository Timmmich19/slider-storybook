import {Swiper, SwiperRef, SwiperSlide} from 'swiper/react'
import {Navigation} from 'swiper/modules'
import ArrowIcon from '../../assets/ArrowIcon'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import './agesSlider.scss'
import {useCallback, useEffect, useRef} from 'react'

type EventsData = {titleYear: number; desc: string}

const mockEventsData: EventsData[] = [
  {titleYear: 2015, desc: '13 сентября — частное солнечное затмение, видимое в Южной Африке и части Антарктиды'},
  {
    titleYear: 2016,
    desc: 'Телескоп «Хаббл» обнаружил самую удалённую из всех обнаруженных галактик, получившую обозначение GN-z11'
  },
  {titleYear: 2017, desc: 'Компания Tesla официально представила первый в мире электрический грузовик Tesla Semi'},
  {titleYear: 2018, desc: 'Впервые в истории, в России прошел Чемпионат мира по футболу'}
]

const AgesSlider = () => {
  return (
    <div className='container'>
      <div className='item'>
        <div className='title'>
          Исторические <br />
          даты
        </div>
        <EventsSlider />
      </div>
    </div>
  )
}

const EventsSlider = () => {
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

  return (
    <div className='slider-container'>
      <div className='slider-buttons'>
        <button ref={prevBtnRef} className='prev-btn' onClick={handlePrev} disabled={false}>
          <ArrowIcon direction='left' />
        </button>
        <button ref={nextBtnRef} className='next-btn' onClick={handleNext} disabled={false}>
          <ArrowIcon direction='right' />
        </button>
      </div>

      <Swiper
        ref={swiperRef}
        spaceBetween={40}
        slidesPerView={'auto'}
        className='events-slider'
        watchSlidesProgress={true}
      >
        {mockEventsData.map((el, idx) => (
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
