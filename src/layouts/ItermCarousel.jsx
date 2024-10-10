import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { movie } from '../data/movies.js';
import CardMovies from '../components/CardMovies.jsx';
import { card } from '../config/swiperConfig.js';
function ItermCarousel() {
    // const [product,setProduct] = useState();
    return (
        <div className='mt-20'>
            <Swiper
                {...card}

            >     
                {
                    movie.map((movies, index) => ( 
                    <div key={index }>   
                        <SwiperSlide>
                        <CardMovies
                                    index={index}
                                    img={movies.img}
                                    title={movies.title}
                                    timeMovie={movies.timeMovie}
                                    category={movies.category}
                                    movieClassification={movies.movieClassification}
                                />   
                                </SwiperSlide> 
                                </div> 
                    ))
                } 
            </Swiper>
        </div>
    );
}

export default ItermCarousel;