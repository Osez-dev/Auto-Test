import React, { useEffect, useRef } from 'react';
import Glider from 'glider-js';
import 'glider-js/glider.min.css'; // Optional for extra styling

interface GliderComponentProps {
  slides: React.ReactNode[];
  slidesToShow?: number;
  slidesToScroll?: number;
  width?: string;
  height?: string;
}

const GliderComponent: React.FC<GliderComponentProps> = ({
  slides,
  slidesToShow = 5,
  slidesToScroll = 1,
  width = '100%',
  height = 'auto',
}) => {
  const gliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gliderRef.current) {
      new Glider(gliderRef.current, {
        slidesToShow,
        slidesToScroll,
        draggable: true,
        dots: '#dots',
        arrows: {
          prev: '#glider-prev',
          next: '#glider-next',
        },
      });
    }
  }, [slidesToShow, slidesToScroll]);

  return (
    <div
      className="glider-container flex items-center relative w-full max-w-[900px] mx-auto overflow-hidden"
      style={{
        maxWidth: width,
        height: height,
      }}
    >
      <button
        id="glider-prev"
        className="glider-prev bg-gray-800 text-white border-none p-2 cursor-pointer text-2xl"
      >
        «
      </button>

      <div className="glider" ref={gliderRef}>
        {slides.map((slide, index) => (
          <div
            key={index}
            className="glider-slide p-5 bg-gray-100 border border-gray-300 text-center h-[500px]"
          >
            {slide}
          </div>
        ))}
      </div>

      <button
        id="glider-next"
        className="glider-next bg-gray-800 text-white border-none p-2 cursor-pointer text-2xl"
      >
        »
      </button>

      <div id="dots" className="glider-dots text-center mt-2"></div>
    </div>
  );
};

export default GliderComponent;
