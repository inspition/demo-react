/**
 * 格式化日期
 *
 * @export
 * @param {string} date 
 * @returns {*} 
 */
export function formateDate(date: string) {
  return new Date(date).toLocaleDateString()
}
