import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import ArrowIcon from "../../assets/ArrowIcon";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "./agesSlider.scss";

const AgesSlider = () => {
  return (
    <div className="container">
      <div className="item">
        <div className="title">
          Исторические <br />
          даты
        </div>

        <CustomSwiper />
      </div>
    </div>
  );
};

const CustomSwiper = () => {
  return (
    <div className="slider">
      {/* <button className="slider-prev">
        <ArrowIcon direction="left" />
      </button> */}
      {/* <div className="custom-swiper"> */}
      <Swiper
        modules={[Navigation, Pagination]}
        slidesPerView={3}
        spaceBetween={24}
        navigation={{
          prevEl: ".swiper-button-prev",
          nextEl: ".swiper-button-next",
        }}
      >
        <div className="swiper-button-prev">
          <ArrowIcon direction="left" />
        </div>
        <div className="swiper-button-next">
          <ArrowIcon direction="right" />
        </div>
        <SwiperSlide>
          <div className="slide">Слайд 1</div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide">Слайд 2</div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide">Слайд 3</div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide">Слайд 4</div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide">Слайд 5</div>
        </SwiperSlide>
      </Swiper>
      {/* </div> */}
      {/* //{" "}
      <button className="slider-next">
        // <ArrowIcon />
        //{" "}
      </button> */}
    </div>
  );
};

export default AgesSlider;
