import React from "react";
import { useEffect } from "react";
import { View, Text, Image } from "@tarojs/components";
import { AtAvatar, AtButton, AtTabs, AtTabsPane } from "taro-ui";
import settingsOutline from '../../assets/icons/settings-outline.svg'
import { StoryBlock } from '../../components'
import storyList1 from '../detailPage/mockdata/storylist1.json'
import storyList2 from '../detailPage/mockdata/storylist2.json'
import './userHomePage.less'

export const UserHomePage: React.FC = () => {
  // const nowDate = parseInt((new Date().getTime() / 1000).toString()); //获取当前时间
  // useEffect(() => {
  //   console.log('componentDidMount')
  //   wx.config({
  //     debug: false,
  //     appId: 'gh_f3d425bcc008',
  //     timestamp: nowDate,
  //     nonceStr: 'aloha',
  //     signature: '',
  //     jsApiList: [],
  //   })
  //   wx.ready(() => {
  //     wx.updateAppMessageShareData({
  //       title: '元弹', // 分享标题
  //       desc: '晒出你的元宇宙生活！', // 分享描述
  //       link: 'http://yuandan.ac-code.com',
  //       imgUrl: 'https://joinus.newegg.cn/static/newegg.png', // 分享图标
  //     });
  //   })
  //   wx.error((res: any) => { console.log(res) });
  // }, []);

  const tabList = [{ title: '笔记' }, { title: '收藏' }, { title: '赞过' }];
  const handleTabChange = () => {

  }
  return (
    <View className="userHomePage">
      <View className="header_mask"></View>
      <View className="header">
        <View className="userinfo">
          <View className="avatar">
            <AtAvatar size='large' circle image='https://joeschmoe.io/api/v1/8'></AtAvatar>
          </View>
          <View className="usercard">
            <View className="user_name">
              <Text className="user_name_text">咕噜咕噜大火锅</Text>
              <Text className="user_id">元弹id: 1045677223</Text>
            </View>
          </View>
        </View>
        <View className="user_intro">
          <Text className="intro_text">点击这里，填写简介</Text>
        </View>
        <View className="user_panel">
          <View className="panel_item">
            <Text className="number">1</Text>
            <Text className="label">关注</Text>
          </View>
          <View className="panel_item">
            <Text className="number">1</Text>
            <Text className="label">粉丝</Text>
          </View>
          <View className="panel_item">
            <Text className="number">12</Text>
            <Text className="label">获赞与收藏</Text>
          </View>
          <View className="panel_item toRight">
            <AtButton className="settingsBtn" circle size="small">
              {/* <Image className="img" src={settingsOutline} /> */}
              设置
            </AtButton>
          </View>
        </View>
      </View>
      <View className="main">
        <AtTabs current={0} tabList={tabList} onClick={handleTabChange}>
          <AtTabsPane current={0} index={0} >
            <View className='noteContainer'>
              {/* <View className='column'>
                <View className='storyListContainer'>
                  {storyList1.map(r => (
                    <StoryBlock
                      key={r.id}
                      id={r.id}
                      uid={r.uid}
                      title={r.title}
                      username={r.username}
                      viewedTimes={r.viewedTimes}
                    />
                  ))}
                </View>
              </View> */}
              {/* <View className='column'>
                <View className='storyListContainer'>
                  {storyList2.map(r => (
                    <StoryBlock
                      key={r.id}
                      id={r.id}
                      uid={r.uid}
                      title={r.title}
                      username={r.username}
                      viewedTimes={r.viewedTimes}
                    />
                  ))}
                </View>
              </View> */}
            </View>
          </AtTabsPane>
          <AtTabsPane current={0} index={1}>
            <View style='padding: 100px 50px;background-color: transparent;text-align: center;'></View>
          </AtTabsPane>
          <AtTabsPane current={0} index={2}>
            <View style='padding: 100px 50px;background-color: transparent;text-align: center;'></View>
          </AtTabsPane>
        </AtTabs>
      </View>
    </View>
  )
}

export default UserHomePage;
