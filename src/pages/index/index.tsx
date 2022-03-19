import React, { useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import { AtTabs, AtTabsPane, AtSearchBar } from 'taro-ui'
import Taro from '@tarojs/taro';
import wx from 'weixin-js-sdk-ts';
import { StoryBlock } from '../../components'
import './index.less'


export const Index: React.FC = () => {

  interface StoryInfo {
    pictureUrlArray: string[];
    storyTitle: string;
    storyContent: string;
    username: string;
    walletAddress: string;
    sid: string;
    videoArray: string[];
    posterUriArray: string[];
    coverImgUrl: string;
  }

  const initialStoryList: StoryInfo = {
    pictureUrlArray: ['https://yuandanapp.oss-cn-hangzhou.aliyuncs.com/stories/Garte.webp'],
    storyTitle: 'xxx',
    storyContent: 'xxx',
    username: 'xxx',
    walletAddress: 'xxx',
    sid: 'xxx',
    videoArray: [],
    posterUriArray: [],
    coverImgUrl: '',
  }

  const [storyList1, updateStoryList1] = useState<Array<StoryInfo>>([initialStoryList]);
  const [storyList2, updateStoryList2] = useState<Array<StoryInfo>>([initialStoryList]);

  const getWeixinJsApiSignature = async (pictureUrl: string) => {
    await Taro.request({
      url: 'https://api.yuandan.ac-code.com/weixin_jsapi_signature',
      method: 'GET',
      header: {
        noncestr: 'RANDOMACCESSMEMORIES',
        timestamp: 1646967249,
        url: window.location.href.split('#')[0],
      },
    })
      .then(res => {
        console.log(res);
        const { signature } = res.data;
        wx.config({
          debug: false,
          appId: 'wx5ae7808267e29706',
          timestamp: 1646967249,
          nonceStr: 'RANDOMACCESSMEMORIES',
          signature,
          jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData'], // 必填，需要使用的JS接口列表
          openTagList: [],
        });
        wx.ready(() => {
          console.log('wx ready');
          wx.updateAppMessageShareData({
            title: '元弹',
            desc: '晒出你的元宇宙生活!',
            link: `http://m.yuandan.ac-code.com/`,
            imgUrl: pictureUrl,
            success(): void {
              throw new Error('Function not implemented.');
            },
            cancel(): void {
              throw new Error('Function not implemented.');
            },
          });
          // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    Taro.request({
      url: 'https://api.yuandan.ac-code.com/explore/',
      // url: 'http://localhost:8000/explore/',
      method: 'GET',
      success: function (res) {
        console.log(res);
        const originList: StoryInfo[] = res.data;
        // determine the story cover by pictureUrlArray and posterUriArray
        for (var story of originList) {
          if (story.pictureUrlArray.length !== 0) {
            story.coverImgUrl = story.pictureUrlArray[0];
          } else if (story.posterUriArray.length != 0) {
            story.coverImgUrl = 'https://' + 'poster.yuandanapi.ac-code.com/' + story.posterUriArray[0] + '~' + 'tplv-vod-noop.image';
          }
        }
        const list1 = originList.filter((value, index) => {
          if (index % 2 === 1)
            return value
        })
        updateStoryList1(list1)
        const list2 = originList.filter((value, index) => {
          if (index % 2 === 0)
            return value
        })
        updateStoryList2(list2)
      }
    });
    const shareCover = 'https://yuandanapp.oss-cn-hangzhou.aliyuncs.com/stories/Group%202pozit.png';
    if (process.env.TARO_ENV === 'h5') {
      getWeixinJsApiSignature(shareCover);
    }
  }, [])

  interface stateProps {
    value: string;
  }

  const initialState: stateProps = {
    value: "",
  }

  const [state, setState] = useState<stateProps>(initialState);

  const onSearchBarChange = (value: string) => {
    setState({ value: value })
  }

  const tabList = [{ title: '发现' }, { title: '关注' }]

  const handleTabChange = () => {

  }

  return (
    <View className='mainContainer'>
      <View className='header'>
        <AtSearchBar
          placeholder='大家都在搜“Decentraland”'
          value={state.value}
          onChange={onSearchBarChange}
        />
      </View>
      <AtTabs
        current={0}
        tabList={tabList}
        onClick={handleTabChange}
      >
        <AtTabsPane current={0} index={0}>
          <View className='noteContainer'>
            <View className='column'>
              <View className='storyListContainer'>
                {storyList1.map(r => (
                  <StoryBlock
                    key={r.sid}
                    id={r.sid}
                    uid={r.walletAddress}
                    title={r.storyTitle}
                    username={r.username}
                    viewedTimes={100}
                    coverImgUrl={r.coverImgUrl}
                  />
                ))}
              </View>
            </View>
            <View className='column'>
              <View className='storyListContainer'>
                {storyList2.map(r => (
                  <StoryBlock
                    key={r.sid}
                    id={r.sid}
                    uid={r.walletAddress}
                    title={r.storyTitle}
                    username={r.username}
                    viewedTimes={100}
                    coverImgUrl={r.coverImgUrl}
                  />
                ))}
              </View>
            </View>
          </View>
        </AtTabsPane>
      </AtTabs>
    </View>
  )
}

// export const Index: React.FC = () => {
//   return (
//     <View className='index'>
//       <Text>Hello WeAppmnn!</Text>
//     </View>
//   )
// }

export default Index;
