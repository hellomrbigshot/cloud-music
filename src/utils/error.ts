import { formatTime } from './common'
/**
 * 
 * @param {string} name 错误名字
 * @param {string} action 错误动作
 * @param {string} info 错误信息
 */
export const logError = (name: string, action: string, info?: string | object) => {
  if (!info) {
    info = 'empty'
  }
  const time = formatTime(new Date())
  if (typeof info === 'object') {
    info = JSON.stringify(info)
  }
  console.error(time, name, action, info)
}
