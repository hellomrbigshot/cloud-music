export type MusicItemType = {
  name: string,
  id: number,
  ar: Array<{
    name: string
  }>,
  al: {
    name: string
  },
  alia: Array<string>,
  song: {
    id: number
  },
  copyright: number,
  st?: number,
  current?: boolean
}

export type currentSongInfoType = {
  id: number,
  name: string,
  ar: Array<{
    name: string
  }>,
  al: {
    picUrl: string,
    name: string
  },
  url: string,
  lrcInfo: any,
  dt: number, // 总时长
  st: number // 是否喜欢
}

export type playListDetailInfoType = {
  coverImgUrl: string,
  playCount: number,
  name: string,
  description: string,
  tags: Array<string | undefined>,
  creator: {
    avatarUrl: string,
    nickname: string
  },
  tracks: Array<MusicItemType>
}

export type songType = {
  // 歌单详情
  playListDetailInfo: playListDetailInfoType,
  playListDetailPrivileges: Array<{
    st: number
  }>,
  // playListDetailPrivileges: Array<{
  //   st: number
  // }>,
  // // 可播放歌曲列表
  // canPlayList: Array<MusicItemType>,
  // 推荐歌单列表
  recommendPlayList: [],
  // 推荐电台列表
  recommendDj: [],
  // 当前播放的歌曲 id
  currentSongId: string,
  // 当前播放歌曲详情
  currentSongInfo: currentSongInfoType,
  // 当前播放歌曲在列表中的索引
  currentSongIndex: number,
  // // 是否正在播放
  isPlaying: boolean
}

export type commentType = {
  commentId: number,
  content: string,
  liked: boolean,
  likedCount: number,
  user: userType,
  time: number
}

export type userType = {
  avatarUrl: string,
  nickname: string,
  userType?: boolean,
  vipType?: boolean,
  userId: number
}
