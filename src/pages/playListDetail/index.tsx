import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'

import './index.scss'
import { connect } from '@tarojs/redux'
import { View, Image, Text } from '@tarojs/components'
import classnames from 'classnames'

import { GETPLAYLISTDETAIL } from '../../actions/song'
import { songType, commentType } from 'src/constants/commonType'
import request from '../../utils/request'
import { formatTime } from '../../utils/common'

type PageStateProps = {
  song: songType
}
type PageDispatchProps = {
  GETPLAYLISTDETAIL: (string) => any
}
type PageOwnProps = {}

type PageState = {
  expand: Boolean,
  hotComments: Array<commentType>
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface playListDetail {
  props: IProps
}

@connect(({ song }) => ({
  song
}), (dispatch) => ({
  GETPLAYLISTDETAIL (id) {
    dispatch(GETPLAYLISTDETAIL(id))
  }
}))

class playListDetail extends Component<IProps, PageState> {
  config: Config = {
    navigationBarTitleText: '歌单详情'
  }

  constructor (props) {
    super(props)
    this.state = {
      expand: false,
      hotComments: []
    }
  }

  componentDidMount () {
    const { GETPLAYLISTDETAIL } = this.props
    const { id } = this.$router.params
    GETPLAYLISTDETAIL(id)
    this.getHotComments(id)
  }
  /**
   * @params {string|number} id
   */
  getHotComments = (id) => {
    request.get('/comment/hot',
      { id, type: 2 }).then(({ data }) => {
      this.setState({
        hotComments: data.hotComments
      })
    })
  }

  handleChangeExpand = () => {
    this.setState({
      expand: !this.state.expand
    })
  }
  /**
   * @params {object} item 歌曲详情
   */
  toSongDetail = id => {
    Taro.navigateTo({
      url: `/pages/songDetail/index?id=${id}`
    })
  }

  render () {
    const { song: { playListDetailInfo } } = this.props
    const { expand, hotComments } = this.state
    return (
      <View className='playList'>
        <View className='playList-head'>
          <View
            className='playList-head__bg'
            style={{
              backgroundImage: `url(${playListDetailInfo.coverImgUrl}?param=170y170)`
            }}
          />
          <View className='playList-head__cover'>
            <Image
              className='playList-head__cover__img'
              src={playListDetailInfo.coverImgUrl}
            />
          </View>
          <View className='playList-head__info'>
            <View className='playList-head__info__title'>{playListDetailInfo.name}</View>
            <View className='playList-head__info__user'>
              <Image
                className='playList-head__info__user__avatar'
                src={playListDetailInfo.creator.avatarUrl}
              />
              {playListDetailInfo.creator.nickname.slice(0, 7) + (playListDetailInfo.creator.nickname.length > 7 ? '...' : '')}
            </View>
          </View>
        </View>
        <View className='playList-head__more'>
          <View className='playList-head__more__tag'>
            标签：
            {
              playListDetailInfo.tags.map((tag, index) => (
                <Text key={index} className='playList-head__more__tag__item'>{tag}</Text>
              ))
            }
          </View>
          <View className={classnames('playList-head__more__desc', expand ? '' : 'desc-close')}>
            简介：{playListDetailInfo.description}
          </View>
          <View
            className='playList-head__more__desc__expand'
            onClick={this.handleChangeExpand}
          >{expand && '合拢' || '展开'}</View>
        </View>
        <View className='playList-content'>
          <View className='playList-content__head'>歌曲列表</View>
          <View className='playList-content__list'>
            {
              playListDetailInfo.tracks.map((item, index) => (
                <View
                  key={item.id}
                  className='playList-content__item'
                  onClick={() => this.toSongDetail(item.id)}
                >
                  <View className='playList-content__item__index'>{index+1}</View>
                  <View className='playList-content__item__info'>
                    <View className='playList-content__item__info__detail'>
                      <View className='playList-content__item__info__detail__name'>
                        {item.name}
                        {
                          item.alia.length
                            ? <Text className='playList-content__item__info__detail__name__gray'>({item.alia[0]})</Text>
                            : null
                        }
                      </View>
                      <View className='playList-content__item__info__detail__desc'>
                        <Text>{item.ar[0].name} - {item.al.name}</Text>
                      </View>
                    </View>
                    <View
                      className='playList-content__item__info__play'
                    >
                      <View
                        style={{
                          width: '22px',
                          height: '22px',
                          background: 'url(//s3.music.126.net/mobile-new/img/index_icon_2x.png?5207a28c3767992ca4bb6d4887c74880=) no-repeat',
                          backgroundSize: '166px 97px',
                          backgroundPosition: '-24px 0'
                        }}
                      />
                    </View>
                  </View>
                </View>
              ))
            }
          </View>
        </View>
        <View className='playList-comment'>
          <View className='playList-comment__head'>精彩评论</View>
          <View className='playList-comment__list'>
            {
              hotComments.map(item => (
                <View key={item.commentId} className='playList-comment__item'>
                  <View className='playList-comment__item__head'>
                    <Image className='playList-comment__item__head__avatar' src={item.user.avatarUrl} />
                  </View>
                  <View className='playList-comment__item__content'>
                    <View className='playList-comment__item__content__head'>
                      <View className='playList-comment__item__content__head__user'>
                        <View className='playList-comment__item__content__head__user__name'>{item.user.nickname}</View>
                        <View className='playList-comment__item__content__head__user__time'>{formatTime(item.time, 2)}</View>
                      </View>
                      <View className='playList-comment__item__content__head__like'>{item.likedCount}👍🏻</View>
                    </View>
                    <View className='playList-comment__item__content__detail'>{item.content}</View>
                  </View>
                </View>
              ))
            }
          </View>
        </View>
      </View>
    )
  }
}

export default playListDetail as ComponentClass
