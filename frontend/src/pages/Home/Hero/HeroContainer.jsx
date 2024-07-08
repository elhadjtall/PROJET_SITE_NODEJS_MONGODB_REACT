// import React from 'react'

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import 'swiper/css/effect-creative';
import { useEffectCreative } from "swiper";
import Hero from './Hero'
import Hero2 from './Hero2'


const HeroContainer = () => {
  return (
    <section>
        <Swiper
            grabCursor={true}
            effect={"creative"}
            creativeEffect={{
                prev: {
                    shadow: true,
                    translate: [0, 0, -400],
                },
                next: {
                    shadow: true,
                    translate: ["100%", 0, 0],
                },
            }}
            modules={[EffectCreative]}
            className="mySwiper"
            loop={true}
            autoplay={{
                delay: 250,
                disableOnInteraction: false
            }}
        >
            <SwiperSlide>
                <Hero2/>
            </SwiperSlide>
            <SwiperSlide>
                <Hero/>
            </SwiperSlide>
        </Swiper>
    </section>
  )
}

export default HeroContainer