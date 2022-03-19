import React from "react";
import { useDispatch } from 'react-redux';
import Taro, { getCurrentPages } from "@tarojs/taro";
import { View, Image, Text } from '@tarojs/components';
import { AtAvatar } from 'taro-ui';
import { push } from "/src/redux/pageStack/slice";
import './StoryBlock.less';

interface StoryBlockProps {
  id: any;
  uid: any;
  title: string;
  username: string;
  viewedTimes: number;
  coverImgUrl: string;
}

export const StoryBlock: React.FC<StoryBlockProps> = ({
  id,
  uid,
  title,
  username,
  viewedTimes,
  coverImgUrl
}) => {
  const dispatch = useDispatch();

  const enterStory = () => {
    const pageStack = getCurrentPages();
    console.log(pageStack);
    let stack: Array<string> = [];
    for (let pageParams of pageStack) {
      //判断是详情页
      if (pageParams.$taroParams.sid !== undefined) {
        stack.push(pageParams.$taroParams.sid);
      }
    }
    dispatch(push({ stack }))
    Taro.navigateTo(
      {
        url: `/pages/detailPage/detailPage?sid=${id}`
      }
    )
  }

  return (
    <View className='storyContainer' onClick={enterStory}>
      <View className='storyinfo'>
        <View className='storyimage'>
          <Image
            mode='widthFix'
            className='image'
            src={coverImgUrl}
          >
          </Image>
        </View>
        <Text className='title'>{title}</Text>
      </View>
      <View className='storyappend'>
        <View className='user'>
          <View className='userImageWrapper'>
            {/* <Image
              mode='scaleToFill'
              className='userImage'
              src='https://joeschmoe.io/api/v1/random'>
            </Image> */}
            <View className='avatar-container'>
              <AtAvatar className='avatar' size='small' circle text={username[0].toUpperCase()}></AtAvatar>
            </View>
          </View>
          <Text className='name'>{username}</Text>
        </View>
        <View className='like'>
          {/* <i className='heart'></i> */}
          <Image className='heart' src=''></Image>
          {/* <Text className='likes'>{viewedTimes}</Text> */}
        </View>
      </View>
    </View>
  )
}
