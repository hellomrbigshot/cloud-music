import {
  GETRECOMMENDPLAYLIST,
  GETPLAYLISTDETAIL,
  GETRECOMMENDDJ,
  GETSONGDETAIL
} from '../constants/song'
import request from '../utils/request'

// 获取推荐歌单列表
export const getRecommendPlayList = () => {
  return dispatch => {
    request.get('/personalized').then(res => {
      const { result: recommendPlayList } = res.data
      dispatch({
        type: GETRECOMMENDPLAYLIST,
        payload: {
          recommendPlayList
        }
      })
    })
  }
}

// 获取推荐电台列表
export const getRecommendDj = () => {
  return dispatch => {
    request.get('/personalized/djprogram').then(res => {
      const { result: recommendDj } = res.data
      dispatch({
        type: GETRECOMMENDDJ,
        payload: {
          recommendDj
        }
      })
    })
  }
}

// 获取歌单详情
export const getPlayListDetail = (id: string) => {
  return dispatch => {
    request.get('/playlist/detail', {
      id
    }).then(res => {
      const { playlist: playListDetailInfo, privileges: playListDetailPrivileges } = res.data
      dispatch({
        type: GETPLAYLISTDETAIL,
        payload: {
          playListDetailInfo,
          playListDetailPrivileges
        }
      })
    })
  }
}

// 获取歌曲详情
export const getSongDetail = (id: string) => {
  return dispatch => {
    request.get('/song/detail', {
      ids: id
    }).then(res => {
      const songDetail = res.data.songs[0]
      const ablumId = songDetail.al.id
      request.get('/album', {
        id: ablumId
      }).then(albumRes => {
        const { blurPicUrl } = albumRes.data.album
        songDetail.al.blurPicUrl = blurPicUrl
        dispatch({
          type: GETSONGDETAIL,
          payload: {
            currentSongInfo: songDetail
          }
        })
      })
    })
  }
}
