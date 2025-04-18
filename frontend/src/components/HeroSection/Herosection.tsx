import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./HeroSection.css";

import image1 from "../../assets/images/04-scaled.jpg";
import image2 from "../../assets/images/02-scaled.jpg";
import image3 from "../../assets/images/11-scaled.jpg";

const HeroSection: React.FC = () => {
  // Settings for the react-slick Slider
  const settings = {
    dots: true,
    infinite: true,
    speed: 2250,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 15000,
    pauseOnHover: true,
  };

  // Array of images for the slides
  const slides = [
    { image: image1 },
    { image: image2 },
    { image: image3 },
  ];

  return (
    <div className="absolute w-full ">
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={index}>
            <div
              className="w-full h-[270px] bg-cover bg-center flex justify-center items-center text-white text-center"
              style={{
                backgroundImage: `url(${slide.image})`,
              }}
            ></div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HeroSection;
