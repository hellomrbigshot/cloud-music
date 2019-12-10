import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Swiper, SwiperItem } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import request from '../../utils/request'
import { formatNumber } from '../../utils/common'

import {
  getRecommendPlayList,
  getRecommendDj
} from '../../actions/song'

import './index.scss'

// #region 书写注意
//
// 目前 typescript 版本还无法在装饰器模式下将 Props 注入到 Taro.Component 中的 props 属性
// 需要显示声明 connect 的参数类型并通过 interface 的方式指定 Taro.Component 子类的 props
// 这样才能完成类型检查和 IDE 的自动提示
// 使用函数模式则无此限制
// ref: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20796
//
// #endregion

type PageStateProps = {
  song: any,
  recommendPlayList: Array<{
    id: string,
    name: string,
    picUrl: string,
    playCount: number
  }>,
  recommendDj: Array<{
    name: string,
    picUrl: string
  }>
}

type PageDispatchProps = {
  getRecommendPlayList: () => any,
  getRecommendDj: () => any
}

type PageOwnProps = {}

type PageState = {
  bannerList: Array<{
    typeTitle: string,
    pic: string
  }>
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props: IProps;
}

@connect(({ song }) => ({
  recommendPlayList: song.recommendPlayList,
  recommendDj: song.recommendDj
}), (dispatch) => ({
  getRecommendPlayList () {
    dispatch(getRecommendPlayList())
  },
  getRecommendDj () {
    dispatch(getRecommendDj())
  }
}))
class Index extends Component<IProps, PageState> {

    /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: 'Cloud Music'
  }

  constructor (props) {
    super(props)
    this.state = {
      bannerList: []
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentDidMount () {
    const { getRecommendPlayList, getRecommendDj } = this.props
    this.getBanner()
    getRecommendPlayList()
    getRecommendDj()
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }
  /**
   * 获取轮播列表
   */
  getBanner () {
    request.get('/banner', {
      type: 2
    }).then(({ data }) => {
      if (data.banners) {
        this.setState({
          bannerList: data.banners
        })
      }
    })
  }
  /**
   * 跳转到推荐歌单详情页
   */
  toRecommendPlayDetail = id => {
    Taro.navigateTo({
      url: `/pages/playListDetail/index?id=${id}`
    })
  }

  render () {
    const { bannerList } = this.state
    const { recommendPlayList, recommendDj } = this.props
    return (
      <View className='index'>
        <Swiper
          className='banner-list'
          indicatorColor='#999'
          indicatorActiveColor='#d43c33'
          circular
          indicatorDots
          autoplay
          skipHiddenItemLayout
        >
          {
            bannerList.map((item, index) => (
              <SwiperItem
                key={index}
                className='banner-list-item'
              >
                <Image
                  key={index}
                  className='banner-list-item__img'
                  src={item.pic}
                />
              </SwiperItem>
            ))
          }
        </Swiper>
        <View className='recommend-playlist'>
          <View className='recommend-playlist__title'>
            推荐歌单
          </View>
          <View className='recommend-playlist__content'>
            {
              recommendPlayList.map((item, index) => (
                <View
                  key={index}
                  className='recommend-playlist__item'
                  onClick={() => this.toRecommendPlayDetail(item.id)}
                >
                  <Image
                    className='recommend-playlist__item__cover'
                    src={item.picUrl}
                  />
                  <View className='recommend-playlist__item__num'>
                    <Text>{formatNumber(item.playCount)}</Text>
                  </View>
                  <View className='recommend-playlist__item__title'>{item.name}</View>
                </View>
              ))
            }
          </View>
        </View>
        <View className='recommend-playlist'>
          <View className='recommend-playlist__title'>
            推荐电台
          </View>
          <View className='recommend-playlist__content'>
            {
              recommendDj.map((item, index) => (
                <View key={index} className='recommend-playlist__item'>
                  <Image
                    className='recommend-playlist__item__cover'
                    src={item.picUrl}
                  />
                  <View className='recommend-playlist__item__title'>{item.name}</View>
                </View>
              ))
            }
          </View>
        </View>
      </View>
    )
  }
}

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion

export default Index as ComponentClass<PageOwnProps, PageState>
