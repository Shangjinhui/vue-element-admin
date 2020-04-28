// 一个webpack的api,通过执行require.context函数获取一个特定的上下文,主要用来实现自动化导入模块
// 有很多模块的时候，一个个import的话不太现实。
const req = require.context('../../icons/svg', false, /\.svg$/) // 参数1读取的文件路径2是否辨力子目录3匹配文件的正则
// console.log('require.context',req);
// console.log('require.context().keys()',req.keys());//返回需要导入的文件路径数组（基于读取的文件的，所以路径./开头）
const requireAll = requireContext => requireContext.keys()

const re = /\.\/(.*)\.svg/

const svgIcons = requireAll(req).map(i => {
  // console.log(req(i))
  return i.match(re)[1]
})
// console.log(svgIcons)//把路径前缀都截掉只剩下文件名的数组
export default svgIcons
