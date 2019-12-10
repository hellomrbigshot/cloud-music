import {
  GETRECOMMENDPLAYLIST,
  GETPLAYLISTDETAIL,
  GETRECOMMENDDJ,
  GETSONGDETAIL
} from '../constants/song'

import { songType } from '../constants/commonType'
import { startSoterAuthentication } from '@tarojs/taro'

const INITIAL_STATE: songType = {
  playListDetailInfo: {
    coverImgUrl: '',
    playCount: 0,
    name: '',
    tags: [],
    creator: {
      avatarUrl: '',
      nickname: ''
    },
    tracks: [],
    description: ''
  },
  playListDetailPrivileges: [],
  recommendPlayList: [],
  recommendDj: [],
  currentSongId: '',
  currentSongIndex: 0,
  isPlaying: false,
  currentSongInfo: {
    id: 0,
    name: '',
    ar: [],
    al: {
      picUrl: '',
      name: ''
    },
    url: '',
    lrcInfo: [],
    dt: 0, // 总时长
    st: 0 // 是否喜欢
  }
}

export default function song (state = INITIAL_STATE, action) {
  switch (action.type) {
    // 获取推荐歌单列表
    case GETRECOMMENDPLAYLIST:
      const { recommendPlayList } = action.payload
      return {
        ...state,
        recommendPlayList
      }
    // 获取推荐歌单详情
    case GETPLAYLISTDETAIL:
      const { playListDetailInfo, playListDetailPrivileges } = action.payload
      return {
        ...state,
        playListDetailInfo,
        playListDetailPrivileges
      }
    // 获取推荐电台列表
    case GETRECOMMENDDJ:
      const { recommendDj } = action.payload
      return {
        ...state,
        recommendDj
      }
    case GETSONGDETAIL:
      const { currentSongInfo } = action.payload
      return {
        ...startSoterAuthentication,
        currentSongInfo
      }
    default:
      return state
  }
}
