// Fitxer: MotorhomeGallery.tsx
"use client";

import React, { useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

type MotorhomeGalleryProps = {
  images: StaticImageData[]; // Esperem un array d'imatges estàtiques importades
  motorhomeName: string;
};

const MotorhomeGallery = ({ images, motorhomeName }: MotorhomeGalleryProps) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  const lightboxSlides = images.map(img => ({ src: img.src }));

  const openLightbox = (index: number) => {
    setImageIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <Carousel className="w-full relative group rounded-xl overflow-hidden shadow-lg">
        <CarouselContent>
          {images.map((img, i) => (
            <CarouselItem
              key={i}
              onClick={() => openLightbox(i)}
              className="cursor-pointer"
            >
              <div className="aspect-video bg-gray-100 relative">
                <Image
                  src={img}
                  alt={`${motorhomeName} ${i + 1}`}
                  fill
                  className="w-full h-full object-cover"
                  placeholder="blur" // Bona pràctica per millorar la càrrega visual
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {images.length > 1 && (
          <>
            <CarouselPrevious className="absolute left-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CarouselNext className="absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </>
        )}
      </Carousel>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={lightboxSlides}
        index={imageIndex}
      />
    </>
  );
};

export default MotorhomeGallery;