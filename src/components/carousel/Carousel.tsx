import { Swiper, SwiperItem, Image as Img, View } from '@tarojs/components'
import Taro from "@tarojs/taro";
import React, { useState, useEffect } from 'react';
import "./Carousel.less";

interface CarouselProps {
  pictureArray: string[];
  videoArray: string[];
  sid?: string;
}

export const Carousel: React.FC<CarouselProps> = ({ pictureArray, videoArray, sid }) => {
  // console.log(document.body.offsetHeight)
  const windowHeight = document.body.offsetHeight;
  const windowWidth = document.body.offsetWidth;
  const pageWidth = document.getElementById('detailPage')?.offsetWidth;

  // let ratio: number = 0;
  const [ratio, setRatio] = useState<number>(0);

  useEffect(() => {
    console.log('carousel mount')
    const getFirstPictureSize = async (_pictureArray: Array<string>) => {
      if (_pictureArray.length === 0) return;
      let pic1 = new Image;
      pic1.src = _pictureArray[0];
      pic1.onload = (event) => {
        let targetImg = event.currentTarget as HTMLImageElement;
        const width = targetImg.width;
        const height = targetImg.height;
        setRatio(height / width);
        console.log(width, height, height / width);
        console.log(pageWidth, windowWidth, ratio * (pageWidth || windowWidth))
      }
    };
    if (pictureArray.length !== 0) {
      getFirstPictureSize(pictureArray);
    }
  }, [pictureArray, ratio, windowWidth, pageWidth])

  return (
    <Swiper
      className='swiper'
      indicatorColor='#999'
      indicatorActiveColor='#333'
      vertical={false}
      circular={false}
      indicatorDots
      autoplay={false}
    >
      {videoArray.map(_ => (
        <SwiperItem key={_} className='swiperItemVideo' style={{ height: `${windowHeight}px` }}>
          <View id={'mse-' + sid} className='vodContainer'></View>
        </SwiperItem>
      ))}
      {pictureArray.map(r => (
        <SwiperItem key={r} className='swiperItemPicture' style={{ height: (ratio === 0) ? '60vh' : `${ratio * (pageWidth || (windowWidth > 800 ? 800 : windowWidth))}px` }}>
      <Img mode='aspectFit' className='img' src={r} />
    </SwiperItem>
  ))
}
    </Swiper >
  )
}

export default Carousel;
