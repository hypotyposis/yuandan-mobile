import React, { useEffect, useState } from "react";
import Taro, { getCurrentInstance, useRouter, useDidHide } from "@tarojs/taro";
import { useSelector } from "react-redux";
import { RootState } from "src/redux/store";
import wx from 'weixin-js-sdk-ts';
import Service from 'xgplayer-service';
import Player from 'xgplayer';
import { AtAvatar, AtButton, AtDivider } from 'taro-ui'
import { View, Text } from "@tarojs/components";
import "./detailPage.less"
import { Carousel, StoryBlock } from "../../components";
// import './.xgplayer/skin/index.js';

export const DetailPage: React.FC = () => {
  const windowHeight = document.body.offsetHeight;

  // 建议在页面初始化时把 getCurrentInstance() 的结果保存下来供后面使用，
  // 而不是频繁地调用此 API
  const $instance = getCurrentInstance();

  const router = useRouter();
  // console.log(router.params.sid);

  // let player: any = null;
  const [vodPlayer, setVodPlayer] = useState<any>(null);

  // const pageStack = useSelector((state: RootState) => state.pageStack.stack);
  // useEffect(() => {
  //   const sid = $instance.router?.params.sid;
  //   // console.log('page stack change ', sid);
  //   if (sid !== undefined && sid in pageStack) {
  //     //在旧的页面栈里说明该页不是当前用户浏览的页面
  //     if (player !== null) {
  //       player.pause();
  //     }
  //   }
  // }, [pageStack])

  useEffect(() => {
    console.log('MOUNT');
    if (vodPlayer !== null) {
      console.log(vodPlayer)
    }
    return () => console.log('UNMOUNT');
  }, [])

  const [storyTitle, setStoryTitle] = useState('');
  const [storyContent, setStoryContent] = useState('');
  const [pictureArray, setPictureArray] = useState([]);
  const [authorName, setAuthorName] = useState(' ');
  const [videoArray, setVideoArray] = useState([]);
  const [posterUriArray, setPosterUriArray] = useState([]);
  const [sid, setSid] = useState<string>();

  const getWeixinJsApiSignature = async (title: string, description: string, storyId: string, pictureUrl: string) => {
    Taro.request({
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
            title: title,
            desc: description,
            link: `http://m.yuandan.ac-code.com/#/pages/detailPage/detailPage?sid=${storyId}`,
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
    async function getStoryData() {
      // console.log(router)
      const storyId = $instance.router?.params.sid;
      // console.log('storyId: ', storyId)
      const storyData = await Taro.request({
        url: 'https://api.yuandan.ac-code.com/story/' + storyId,
        // url: 'http://localhost:8000/story' + storyId,
        method: 'GET',
        success: function (res) {
          // console.log(res);
          setStoryTitle(res.data.storyTitle);
          document.title = res.data.storyTitle + '  - 元弹';
          setStoryContent(res.data.storyContent);
          setPictureArray(res.data.pictureUrlArray);
          setAuthorName(res.data.username);
          setVideoArray(res.data.videoArray);
          setPosterUriArray(res.data.posterUriArray);
          setSid(res.data.sid);
          let coverImgUrl = '';
          if (res.data.pictureUrlArray.length !== 0) {
            coverImgUrl = res.data.pictureUrlArray[0];
          }
          if (res.data.posterUriArray.length !== 0) {
            coverImgUrl = 'https://' + 'poster.yuandanapi.ac-code.com/' + res.data.posterUriArray[0] + '~' + 'tplv-vod-noop.image';
          }
          if (process.env.TARO_ENV === 'h5') {
            getWeixinJsApiSignature(res.data.storyTitle, res.data.storyContent, res.data.sid, coverImgUrl)
          }
        }
      })
      // console.log(storyData);
      if (storyData.data.videoArray.length !== 0) {
        await Taro.request({
          // url: 'http://localhost:8000/playAuth?vid=' + videoArray[0],
          url: 'https://api.yuandan.ac-code.com/playAuth?vid=' + storyData.data.videoArray[0],
          method: 'GET',
          success: function (res) {
            // console.log(res);
            const playAuthToken = res.data;
            Service.url(playAuthToken, '//vod.volcengineapi.com').then((response) => {
              console.log('initialize player', response);
              let player = new Player({
                id: 'mse-' + storyData.data.sid,
                url: response.PlayInfoList[0].MainPlayUrl,
                height: 'auto',
                // width: 'auto',
                autoplay: true,
                videoInit: true,
              });
              setVodPlayer(player);
            });
          }
        })
      }
      if (process.env.TARO_ENV === 'h5') {
        const { aplus_queue } = window;
        const pageEventConfig = { is_auto: false };
        const userData = {
          url: router.path
        }

        aplus_queue.push({
          action: 'aplus.sendPV',
          arguments: [pageEventConfig, userData]
        });
      }
    }
    getStoryData();
    // return function cleanup() {
    //   if (player !== null) {
    //     console.log('destroying...');
    //     player.destroy(true);
    //   }
    // }
  }, [])

  // useLayoutEffect(() => {
  //   console.log('router change')
  //   return function cleanup() {
  //     console.log('destroying...')
  //     player.destroy(true);
  //   }
  // }, [])

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
    pictureUrlArray: [],
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
    })
  }, [])

  useDidHide(() => {
    console.log('componentDidHide');
    console.log(vodPlayer)
    if (vodPlayer !== null){
      vodPlayer.pause();
    }
  })

  // useEffect(() => {
  //   // 获取路由参数
  //   // console.log($instance.router.params)
  //   const storyId = $instance.router?.params.sid;
  //   console.log('storyId: ', storyId);
  //   axios({
  //     url: 'https://api.yuandan.ac-code.com/story/' + storyId,
  //     method: 'GET',
  //   }).then(res => {
  //     console.log(res);
  //     setStoryTitle(res.data.storyTitle);
  //     setStoryContent(res.data.storyContent);
  //     setPictureArray(res.data.pictureUrlArray);
  //   })
  // }, [])

  // const testContent = '1\n2\n3\n';
  const authorBar = <View className='author-bar'>
    <View className='avatar-container'>
      <AtAvatar className='avatar' size='small' circle text={authorName[0].toUpperCase()}></AtAvatar>
    </View>
    <View className='username'>
      <Text>{authorName}</Text>
    </View>
    <View className='followButton'>
      <AtButton size='small' circle>关注</AtButton>
    </View>
  </View>

  const authorBarOnVideo = <View className='author-barV'>
    <View className='avatar-containerV'>
      <AtAvatar className='avatarV' size='small' circle text={authorName[0].toUpperCase()}></AtAvatar>
    </View>
    <View className='usernameV'>
      <Text>{authorName}</Text>
    </View>
  </View>

  const storyElement = <View className='story'>
    <View className='storyarea'>
      <View className='storytitle'>
        <View className='at-article__h2'>
          {storyTitle}
        </View>
        {/* <View className="portal">
      <AtButton
        className="portalButton"
        type="primary"
        size="small">
        Visit in Metaverse
      </AtButton>
    </View> */}
      </View>
      <View className='storymain'>
        {/* <View className='at-article__p'>
        {storyContent}
      </View> */}
        {storyContent.split('\n').map(r => (<View key={r} className='at-article__p'>{r}</View>))}
        {/* <View className='at-article__p'>
        {testContent}
      </View> */}
      </View>
    </View>
  </View>

  const storyElementOnVideo = <View className='storyV'>
    <View className='storyareaV'>
      {/* <View className='storytitleV'>
    <View className='at-article__h3'>
      {storyTitle}
    </View>
  </View> */}
      <View className='storymainV'>
        {/* <View className='at-article__p'>
    {storyContent}
  </View> */}
        {storyContent.split('\n').map(r => (<View key={r} className='at-article__p'>{r}</View>))}
        {/* <View className='at-article__p'>
    {testContent}
  </View> */}
      </View>
    </View>
  </View>

  const divider = <AtDivider className='recommendDivider' content='相关推荐' />

  const dividerOnVideo = <AtDivider className='recommendDividerV' content='相关推荐' />

  const recommendBox = <View className='recommendBox'>
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

  return (
    <View className='detailPage' >
      {videoArray.length === 0 ? authorBar : null}
      <View className='videoContainer'>
        <Carousel pictureArray={pictureArray} videoArray={videoArray} sid={sid} />
        {videoArray.length === 0 ? storyElement : <View className='floatArea' style={{ bottom: `${55}px` }}>{authorBarOnVideo}{storyElementOnVideo}</View>}
        {/* {videoArray.length === 0 ? divider : null}
        {videoArray.length === 0 ? recommendBox : null} */}
      </View>
      {videoArray.length === 0 ? divider : dividerOnVideo}
      {recommendBox}
    </View>
  )
}

export default DetailPage
