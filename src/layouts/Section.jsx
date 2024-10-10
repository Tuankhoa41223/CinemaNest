import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import { settingsSlider } from '../config/swiperConfig.js';
const Section = () => {
    return (
        <div>
            <Swiper
             {...settingsSlider}
            >
                <SwiperSlide>
                    <img src="https://assets.glxplay.io/web/images/CombatWombatBack2Back_1920x1080_S.max-1920x1080.jpg" alt="Slide 1" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src="https://assets.glxplay.io/web/images/TwilightOfTheWarriorsWalledIn_1920x1080_S_.max-1920x1080.jpg" alt="Slide 2" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src="https://assets.glxplay.io/web/images/BadBoysRideOrDie_1920x1080_S.max-1920x1080.jpg" alt="Slide 3" />
                </SwiperSlide>
            </Swiper>
        </div>
    );
};

export default Section;