import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import { getSongDetail } from '../../actions/song'
import { songType } from '../../constants/commonType'

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
  song: songType
}

type PageDispatchProps = {
  getSongDetail: (id) => any
}

type PageOwnProps = {}

type PageState = {}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props: IProps;
}

@connect(({ song }) => ({
  song
}), (dispatch) => ({
  getSongDetail (id) {
    dispatch(getSongDetail(id))
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
    const { id } = this.$router.params
    this.props.getSongDetail(id)
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    const { currentSongInfo } = this.props.song
    return (
      <View className='song-container'>
        <View
          className='song-container__bg'
          style={{backgroundImage: `url(${currentSongInfo.al.blurPicUrl})`, opacity: '1'}}
        />
        <View className='song-wrapper'>
          <View className='song-disc'>
            <View className='song-disc__main'>
              {
                currentSongInfo.al.picUrl
                  ? <Image className='song-disc__img' src={`${currentSongInfo.al.picUrl}?imageView&thumbnail=360y360&quality=75&tostatic=0`}/>
                  : null
              }
            </View>
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
