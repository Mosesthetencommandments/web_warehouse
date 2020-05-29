import E from 'wangeditor'

function PrefixInteger(num, n) {
  return (Array(n).join(0) + num).slice(-n)
}
const wangeditormenus = [
  // 'emoticon', // 表情
  'head', // 标题
  'bold', // 粗体
  'fontSize', // 字号
  'fontName', // 字体
  'italic', // 斜体
  'underline', // 下划线
  'strikeThrough', // 删除线
  'foreColor', // 文字颜色
  'backColor', // 背景颜色
  // 'list', // 列表
  'justify', // 对齐方式
  // 'quote', // 引用
  // 'table', // 表格
  // 'video',  // 插入视频
  // 'code',  // 插入代码
  'undo', // 撤销
  'redo' // 重复
]

export function wangEditor(parm, fun) {
  const editor = new E(parm)
  editor.customConfig.menus = wangeditormenus
  editor.customConfig.linkImgCallback = function(url) {
  }
  if (fun) {
    editor.customConfig.onchange = fun
  }
  editor.customConfig.pasteTextHandle = (content) => {
    content = content.replace(/(\n)/g, '')
    content = content.replace(/(\t)/g, '')
    content = content.replace(/(\r)/g, '')
    content = content.replace(/<\/?[^>]*>/g, '')
    content = content.replace(/\s*/g, '')
    return content
  }
  // editor.customConfig.uploadImgServer = '/upload'
  editor.customConfig.pasteIgnoreImg = true
  editor.customConfig.uploadImgShowBase64 = true // 图片样式
  editor.customConfig.Colors = [
    '#000000',
    '#eeece0',
    '#1c487f',
    '#4d80bf',
    '#c24f4a',
    '#8baa4a',
    '#7b5ba1',
    '#46acc8',
    '#f9963b',
    '#ffffff'
  ]
  return editor
}
