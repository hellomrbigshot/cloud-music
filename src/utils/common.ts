
/**
 * 补 0 函数
 * @param {number | string} n 原数字
 * @param {number} padSize 位数
 * 
 * @return
 */
export const padStartNum = (n: number | string, padSize: number = 2): string => {
  return n.toString().padStart(padSize, '0')
}

/**
 * 格式化时间函数
 * @param {date} date 时间
 * @param {number} type 格式化类型
 * 
 * @return YYYY-MM-DD hh:mm:ss
 */
export const formatTime = (date, type: number = 1) => {
  if (Object.prototype.toString.call(date) === '[object Number]') {
    date = new Date(date)
  }
  const time = date.getTime()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  const cDate = new Date()
  const cTime = cDate.getTime()
  const cYear = cDate.getFullYear()
  const cDay = cDate.getDate()
  if (type === 1) { // 返回 yyyy-MM-DD hh:mm:ss
    return `${[year, month, day].map(padStartNum).join('-')} ${[hour, minute, second].join(':')}`
  } else if (type === 2) {
    if (cTime - time < 1000 * 3600) { // 一小时内，显示 xx分钟前
      return `${((cTime - time)/1000/3600).toFixed(0)}分钟前`
    } else if (cTime - time < 1000 * 3600 * 24 && cDay === day) { // 一天之内，显示 hh:mm
      return `${hour}:${minute}`
    } else if (cYear === year) { // 一年之内，显示 MM月dd日
      return `${padStartNum(month)}月${padStartNum(day)}日`
    } else { // 剩余显示 yyyy年MM月dd日
      return `${padStartNum(year)}年${padStartNum(month)}月${padStartNum(day)}`
    }
  }

}

/**
 * 数字格式化
 * @param {number} n 待格式化的数字
 */
export const formatNumber = (n: number) => {
  if (isNaN(n)) {
    return ''
  }
  if (n < 10000) {
    return n
  } else if (n < 100000000) {
    return `${(n/10000).toFixed(0)}万`
  } else if (n < 1000000000000) {
    return `${(n/100000000).toFixed(0)}亿`
  } else {
    return '假数据'
  }
}
