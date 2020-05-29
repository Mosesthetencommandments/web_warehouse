import { Message } from 'element-ui'
import { getLodop } from '@/directive/lodop/LodopFuncs'
export function sum_print_orders(row) {
  if (row.orders_sender_info.sender_name === undefined || row.orders_sender_info.sender_name === '' || row.orders_sender_info.sender_name === null) {
    Message({
      type: 'error',
      message: '请先设置发件人姓名'
    })
    return
  }
  if (row.orders_sender_info.sender_phone === undefined || row.orders_sender_info.sender_phone === '' || row.orders_sender_info.sender_phone === null) {
    Message({
      type: 'error',
      message: '请先设置发件人电话'
    })
    return
  }
  if (row.orders_receiver_info === undefined || row.orders_receiver_info === '' || row.orders_receiver_info === null) {
    Message({
      type: 'error',
      message: '请先设置收件人信息'
    })
    return
  }
  if (row.orders_receiver_info.receive_name === undefined || row.orders_receiver_info.receive_name === '' || row.orders_receiver_info.receive_name === null) {
    Message({
      type: 'error',
      message: '请先设置收件人姓名'
    })
    return
  }
  if (row.orders_receiver_info.phone === undefined || row.orders_receiver_info.phone === '' || row.orders_receiver_info.phone === null) {
    Message({
      type: 'error',
      message: '请先设置收件人电话'
    })
    return
  }
  if (row.orders_receiver_info.address === undefined || row.orders_receiver_info.address === '' || row.orders_receiver_info.address === null) {
    Message({
      type: 'error',
      message: '请先设置收货地址'
    })
    return
  }
  if (row.orders_receiver_info.province_name === null || row.orders_receiver_info.city_name === null || row.orders_receiver_info.district_name === null) {
    Message({
      type: 'error',
      message: '请先设置收货地址'
    })
    return
  }
  if (row.orders_unique_id === undefined || row.orders_unique_id === '' || row.orders_unique_id === null) {
    Message({
      type: 'error',
      message: '系统错误, 订单号不能为空'
    })
    return
  }
  if (row.orders_logistics === undefined || row.orders_logistics === '' || row.orders_logistics === null) {
    Message({
      type: 'error',
      message: '填写物流信息'
    })
    return
  }
  if (row.orders_logistics.logistics_number === undefined || row.orders_logistics.logistics_number === '' || row.orders_logistics.logistics_number === null) {
    Message({
      type: 'error',
      message: '物流单号不能为空'
    })
    return
  }
  if (row.orders_logistics.orders_logistics_type.code === undefined || row.orders_logistics.orders_logistics_type.code === '' || row.orders_logistics.orders_logistics_type.code === null) {
    Message({
      type: 'error',
      message: '请先填写物流信息'
    })
    return
  }
  let cash_on_delivery = 0
  const orders_payment_items = row.orders_payment.orders_payment_items
  for (const v of orders_payment_items) {
    if (v.pay_type_id === 2) {
      cash_on_delivery = parseFloat(v.paid_money)
    }
  }
  const logistics_code = row.orders_logistics.orders_logistics_type.code
  const jphone = row.orders_receiver_info.phone
  const timestamp = new Date()
  const jjname = row.orders_sender_info.sender_name// 寄件人姓名
  const jjtel = row.orders_sender_info.sender_phone//  寄件人电话
  const jjaddress = row.warehouse.delivery_address// 寄件人地址
  const sjname = row.orders_receiver_info.receive_name//  收件人姓名
  const shoujian = row.orders_receiver_info.province_name   //收货地址市名
  const sjtel = jphone.substr(0, 3) + '****' + jphone.substr(7)// 收件人电话
  const sjaddress = row.orders_receiver_info.province_name + row.orders_receiver_info.city_name + row.orders_receiver_info.district_name + row.orders_receiver_info.address//  收件人地址
  const mailno = row.orders_logistics.logistics_number//  运单号码
  const mailnos =`https://m.zto.com/waybill/detail?id=${mailno}`//  运单号码
  const destcode = row.orders_logistics.dest_code//  目的地代码
  const dest_extra_code = row.orders_logistics.dest_extra_code//  目的地代码
  let yuejiehao = ''
  if (row.orders_logistics.product_deliver_extra !== null) {
    yuejiehao = row.orders_logistics.product_deliver_extra.configs.sf_monthly_account//  月结号
  }
  const now = new Date()
  const now_date = now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate()
  const now_date_zto = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate()
  const now_seconds = (now.getSeconds() + '').length > 1 ? now.getSeconds() : '0' + now.getSeconds()
  const now_time = now.getHours() + ':' + now.getMinutes() + ':' + now_seconds
  const sign_need_read = '快件送达收件人地址，经收件人或收件人（寄件人）允许的代收人签字，视为送达。您的签字代表您已验收此包裹，并已确认商品信息无误、包装完好、没有划痕、破损等表面质量问题。'
  const sign_need_read_zto = '您对此单的签收，代表您已验货，确认商品信息无误，包装完好，没有划痕、破损等表面质量问题。'
  let chanpin = ''
  if (row.orders_logistics.product_deliver_extra !== null) {
    chanpin = row.orders_logistics.product_deliver_extra.configs.delivery_product_name//  月结号
  }
  const money = cash_on_delivery//  代收货款金额
  const dingdanid = row.orders_unique_id//  自己的订单号
  let goods_detail = ''
  for (const v of row.orders_items) {
    goods_detail += v.product_goods.goods_name + ' x ' + v.number + '、 '
  }
  goods_detail = goods_detail.substring(0, goods_detail.length - 2)
  const chinese_number_map = []
  chinese_number_map[0] = '零'
  chinese_number_map[1] = '壹'
  chinese_number_map[2] = '贰'
  chinese_number_map[3] = '叁'
  chinese_number_map[4] = '肆'
  chinese_number_map[5] = '伍'
  chinese_number_map[6] = '陆'
  chinese_number_map[7] = '柒'
  chinese_number_map[8] = '捌'
  chinese_number_map[9] = '玖'
  const money6666 = money
  const money_str = (parseInt(money6666) + '')
  const money_length = money_str.length
  let money1 = 0
  let money10 = 0
  let money100 = 0
  let money1000 = 0
  let money10000 = 0
  if (money_length > 0) {
    money1 = parseInt(money_str.substr(-1, 1))
  }
  if (money_length > 1) {
    money10 = parseInt(money_str.substr(-2, 1))
  }
  if (money_length > 2) {
    money100 = parseInt(money_str.substr(-3, 1))
  }
  if (money_length > 3) {
    money1000 = parseInt(money_str.substr(-4, 1))
  }
  if (money_length > 4) {
    money10000 = parseInt(money_str.substr(-5, 1))
  }
  const LODOP = getLodop()
  if ((LODOP == null) || (typeof (LODOP.VERSION) === 'undefined')) {
    Message({
      type: 'info',
      message: '请先安装lodop控件'
    })
    return
  }

  LODOP.PRINT_INIT('生物科技')
  if (logistics_code === '1001') {
    // 1001 顺丰热敏打印
    if (row.orders_logistics.dest_code === undefined || row.orders_logistics.dest_code === '' || row.orders_logistics.dest_code === null) {
      Message({
        type: 'error',
        message: '地区编码不能为空'
      })
      return
    }
    LODOP.SET_PRINT_PAGESIZE(1, '100mm', '210mm', '')
    LODOP.SET_SHOW_MODE('BKIMG_WIDTH', '100mm')
    LODOP.SET_SHOW_MODE('BKIMG_HEIGHT', '210mm')
    // 画线
    LODOP.ADD_PRINT_LINE('13mm', '2mm', '13mm', '98mm', 0, 1)
    LODOP.ADD_PRINT_LINE('33mm', '2mm', '33mm', '98mm', 0, 1)
    LODOP.ADD_PRINT_LINE('46mm', '2mm', '46mm', '98mm', 0, 1)
    LODOP.ADD_PRINT_LINE('59mm', '2mm', '59mm', '98mm', 0, 1)
    LODOP.ADD_PRINT_LINE('68mm', '2mm', '68mm', '98mm', 0, 1)
    LODOP.ADD_PRINT_LINE('81mm', '2mm', '81mm', '98mm', 0, 1)
    LODOP.ADD_PRINT_LINE('90mm', '2mm', '90mm', '98mm', 0, 1)
    LODOP.ADD_PRINT_LINE('105mm', '2mm', '105mm', '98mm', 0, 1)
    LODOP.ADD_PRINT_LINE('115mm', '2mm', '115mm', '98mm', 0, 1)
    LODOP.ADD_PRINT_LINE('125mm', '2mm', '125mm', '98mm', 0, 1)
    LODOP.ADD_PRINT_LINE('153mm', '2mm', '153mm', '98mm', 0, 1)
    LODOP.ADD_PRINT_LINE('168mm', '2mm', '168mm', '98mm', 0, 1)
    LODOP.ADD_PRINT_LINE('178mm', '2mm', '178mm', '98mm', 0, 1)
    LODOP.ADD_PRINT_LINE('188mm', '2mm', '188mm', '98mm', 0, 1)
    LODOP.ADD_PRINT_LINE('19mm', '75mm', '19mm', '100mm', 0, 1)
    LODOP.ADD_PRINT_LINE('13mm', '75mm', '33mm', '75mm', 0, 1)
    LODOP.ADD_PRINT_LINE('33mm', '7mm', '68mm', '7mm', 0, 1)
    LODOP.ADD_PRINT_LINE('59mm', '75mm', '68mm', '75mm', 0, 1)
    LODOP.ADD_PRINT_LINE('81mm', '7mm', '90mm', '7mm', 0, 1)
    LODOP.ADD_PRINT_LINE('81mm', '53mm', '90mm', '53mm', 0, 1)
    LODOP.ADD_PRINT_LINE('81mm', '75mm', '90mm', '75mm', 0, 1)
    LODOP.ADD_PRINT_LINE('90mm', '27mm', '105mm', '27mm', 0, 1)
    LODOP.ADD_PRINT_LINE('105mm', '7mm', '125mm', '7mm', 0, 1)
    LODOP.ADD_PRINT_LINE('153mm', '27mm', '168mm', '27mm', 0, 1)
    LODOP.ADD_PRINT_LINE('168mm', '7mm', '188mm', '7mm', 0, 1)

    if (money > 0) {
      LODOP.ADD_PRINT_TEXT(1, 90, 140, 40, 'COD')
      LODOP.SET_PRINT_STYLEA(0, 'FontName', 'Arial')
      LODOP.SET_PRINT_STYLEA(0, 'FontSize', 36)
    }

    LODOP.ADD_PRINT_TEXT(4, 220, 37, 40, 'E')
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 36)
    LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)

    LODOP.ADD_PRINT_BARCODE('16.51mm', '5mm', '70mm', '12mm', '128C', mailno)

    LODOP.ADD_PRINT_TEXT(53, 287, 100, 20, '顺丰隔日')
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 14)
    LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)

    if (money > 0) {
      LODOP.ADD_PRINT_TEXT(73, 283, 140, 30, '代收货款')
      LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
      LODOP.SET_PRINT_STYLEA(0, 'FontSize', 17)
      LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)
      LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -2)

      LODOP.ADD_PRINT_TEXT(99, 285, 140, 30, '卡号: ' + yuejiehao)
      LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
      LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
      LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)

      LODOP.ADD_PRINT_TEXT(109, 287, 140, 30, '¥' + money + '元')
      LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
      LODOP.SET_PRINT_STYLEA(0, 'FontSize', 11)
      LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)
    }

    LODOP.ADD_PRINT_TEXT(136, 10, 15, 36, '目\n的\n地')
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
    LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -3)

    LODOP.ADD_PRINT_TEXT(122, 50, 242, 35, destcode)
    LODOP.SET_PRINT_STYLEA(0, 'FontName', 'Arial')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 36)
    LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)

    LODOP.ADD_PRINT_TEXT(184, 10, 15, 36, '收\n件\n人')
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
    LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -3)

    LODOP.ADD_PRINT_TEXT(177, 30, 332, 20, sjname + '  ' + sjtel)
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 11)
    LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)
    LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -2)

    LODOP.ADD_PRINT_TEXT(193, 30, 366, 35, sjaddress)
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 11)
    LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)
    LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -5)
    LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -2)

    LODOP.ADD_PRINT_TEXT(225, 10, 15, 36, '寄\n件\n人')
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
    LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -5)
    LODOP.ADD_PRINT_TEXT(227, 30, 236, 20, jjname + '  ' + jjtel)
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
    LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -10)
    LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)
    LODOP.ADD_PRINT_TEXT(239, 30, 263, 20, jjaddress)
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
    LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -4)
    LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)

    LODOP.ADD_PRINT_TEXT(263, 10, 100, 20, '付款方式：寄付月结')
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 7)
    LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)

    LODOP.ADD_PRINT_TEXT(263, 110, 100, 20, '计费重量： ')
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 7)
    LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)

    LODOP.ADD_PRINT_TEXT(263, 220, 100, 20, '运费： ')
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 7)
    LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)

    LODOP.ADD_PRINT_TEXT(275, 10, 127, 20, '月结账号：' + yuejiehao)
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 7)

    LODOP.ADD_PRINT_TEXT(309, 10, 15, 36, '托\n寄\n物')
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
    LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -5)

    LODOP.ADD_PRINT_TEXT(315, 50, 200, 36, chanpin)
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
    LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -5)

    LODOP.ADD_PRINT_TEXT(308, 203, 90, 15, '收件员:')
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 7)
    LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -2)
    LODOP.ADD_PRINT_TEXT(320, 203, 100, 9, '寄件日期:' + (timestamp.getMonth() + 1) + '月' + timestamp.getDate() + '日')
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 7)
    LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -2)
    LODOP.ADD_PRINT_TEXT(331, 203, 100, 20, '派件员: ')
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 7)
    LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -2)

    LODOP.ADD_PRINT_TEXT(308, 291, 100, 20, '签名:')
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 7)
    LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)

    LODOP.ADD_PRINT_TEXT(328, 308, 125, 20, ' 年  月  日')
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)

    LODOP.ADD_PRINT_IMAGE(372, 21, 61, 23, '<img src="../../static/95338.png"/>')
    LODOP.SET_PRINT_STYLEA(0, 'Stretch', 1)
    LODOP.ADD_PRINT_IMAGE(348, 21, 61, 23, '<img src="../../static/sflogo.jpg"/>')
    LODOP.SET_PRINT_STYLEA(0, 'Stretch', 2)

    LODOP.ADD_PRINT_BARCODE(354, 155, '45mm', '10mm', '128C', mailno)

    LODOP.ADD_PRINT_TEXT(403, 10, 15, 36, '寄\n件\n人')
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
    LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -5)
    LODOP.ADD_PRINT_TEXT(404, 37, 236, 20, jjname + '  ' + jjtel)
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
    LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -10)
    LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)
    LODOP.ADD_PRINT_TEXT(416, 37, 260, 20, jjaddress)
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
    LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -4)
    LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)

    LODOP.ADD_PRINT_TEXT(440, 10, 15, 36, '收\n件\n人')
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
    LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -5)

    LODOP.ADD_PRINT_TEXT(439, 37, 236, 20, sjname + '  ' + sjtel)
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
    LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -10)
    LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)
    LODOP.ADD_PRINT_TEXT(451, 37, 260, 20, sjaddress)
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
    LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -4)
    LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)

    LODOP.ADD_PRINT_IMAGE(608, 21, 61, 23, '<img src="../../static/95338.png"/>')
    LODOP.SET_PRINT_STYLEA(0, 'Stretch', 1)
    LODOP.ADD_PRINT_IMAGE(583, 21, 61, 23, '<img src="../../static/sflogo.jpg"/>')
    LODOP.SET_PRINT_STYLEA(0, 'Stretch', 2)

    LODOP.ADD_PRINT_BARCODE(587, 154, '45mm', '10mm', '128C', mailno)

    LODOP.ADD_PRINT_TEXT(639, 10, 15, 36, '寄\n件\n人')
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
    LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -5)

    LODOP.ADD_PRINT_TEXT(640, 37, 236, 20, jjname + '  ' + jjtel)
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 12)
    LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -10)
    LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)
    LODOP.ADD_PRINT_TEXT(655, 37, 260, 20, jjaddress)
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 12)
    LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -4)
    LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)

    LODOP.ADD_PRINT_TEXT(676, 10, 15, 36, '收\n件\n人')
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
    LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -5)

    LODOP.ADD_PRINT_TEXT(678, 37, 236, 20, sjname + '  ' + sjtel)
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
    LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -10)
    LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)

    LODOP.ADD_PRINT_TEXT(689, 37, 260, 20, sjaddress)
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
    LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -4)
    LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)

    // /*最底下输出自己的订单号*/
    LODOP.ADD_PRINT_TEXT(720, 37, 260, 20, '佰芝堂订单号：【' + dingdanid + '】')
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
    LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -4)
    LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)

    LODOP.ADD_PRINT_TEXT(735, 37, 320, 40, '发货明细：' + goods_detail)
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
    LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -4)
    LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)

    LODOP.PRINT()
  } else if (logistics_code === '1006') {
    // if (row.orders_logistics.dest_code === undefined || row.orders_logistics.dest_code === '' || row.orders_logistics.dest_code === null) {
    //   Message({
    //     type: 'error',
    //     message: '地区编码不能为空'
    //   })
    //   return
    // }
    LODOP.SET_PRINT_PAGESIZE(1, '100mm', '180mm', '')
    LODOP.SET_SHOW_MODE('BKIMG_WIDTH', '100mm')
    LODOP.SET_SHOW_MODE('BKIMG_HEIGHT', '180mm')
    // 画线
    LODOP.ADD_PRINT_LINE('14mm', '0mm', '14mm', '100mm', 0, 1)
    LODOP.ADD_PRINT_LINE('29mm', '0mm', '29mm', '100mm', 0, 1)
    LODOP.ADD_PRINT_LINE('39mm', '0mm', '39mm', '100mm', 0, 1)
    LODOP.ADD_PRINT_LINE('54mm', '0mm', '54mm', '100mm', 0, 1)
    LODOP.ADD_PRINT_LINE('66mm', '0mm', '66mm', '100mm', 0, 1)
    LODOP.ADD_PRINT_LINE('89mm', '0mm', '89mm', '100mm', 0, 1)
    LODOP.ADD_PRINT_LINE('109mm', '0mm', '109mm', '100mm', 0, 1)
    LODOP.ADD_PRINT_LINE('119mm', '0mm', '119mm', '100mm', 0, 1)
    LODOP.ADD_PRINT_LINE('129mm', '0mm', '129mm', '80mm', 0, 1)
    LODOP.ADD_PRINT_LINE('139mm', '0mm', '139mm', '100mm', 0, 1)
    LODOP.ADD_PRINT_LINE('148mm', '0mm', '148mm', '100mm', 0, 1)
    LODOP.ADD_PRINT_LINE('154mm', '0mm', '154mm', '100mm', 0, 1)
    LODOP.ADD_PRINT_LINE('166mm', '0mm', '166mm', '100mm', 0, 1)

    LODOP.ADD_PRINT_LINE('0mm', '83mm', '14mm', '83mm', 0, 1)
    LODOP.ADD_PRINT_LINE('89mm', '20mm', '109mm', '20mm', 0, 1)
    LODOP.ADD_PRINT_LINE('89mm', '80mm', '109mm', '80mm', 0, 1)
    LODOP.ADD_PRINT_LINE('119mm', '80mm', '139mm', '80mm', 0, 1)

    // if (money > 0) {
    //   LODOP.ADD_PRINT_TEXT(2, 30, 50, 20, 'COD')
    //   LODOP.SET_PRINT_STYLEA(0, 'FontName', 'Arial')
    //   LODOP.SET_PRINT_STYLEA(0, 'FontSize', 20)
    // }
    LODOP.ADD_PRINT_TEXT(20, 160, 180, 20, '代收货款：￥ ' + money)
    LODOP.SET_PRINT_STYLEA(0, 'FontName', 'Arial')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)

    LODOP.ADD_PRINT_SHAPE(4, 0, '83mm', '17mm', '14mm', 0, 1, '#000000')

    LODOP.SET_PRINT_STYLE('FontColor', '#ffffff')
    LODOP.ADD_PRINT_TEXT('2mm', '86mm', '20mm', '10mm', '代收')
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 14)
    LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)
    LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', 3)

    LODOP.ADD_PRINT_TEXT('8mm', '86mm', '20mm', '10mm', '货款')
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 14)
    LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)
    LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', 3)

    LODOP.SET_PRINT_STYLE('FontColor', '#000000')
    LODOP.ADD_PRINT_TEXT(56, 30, 600, 36, destcode)
    LODOP.SET_PRINT_STYLEA(0, 'FontName', 'Arial')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 36)

    LODOP.ADD_PRINT_BARCODE('31mm', '50mm', '47mm', '7mm', '128C', dest_extra_code)
    //
    // LODOP.ADD_PRINT_TEXT(184, 10, 15, 36, '收\n件\n人')
    // LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    // LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
    // LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -3)

    LODOP.ADD_PRINT_TEXT(155, 40, 332, 20, sjname + '  ' + jphone)
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10)
    LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)
    LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -2)

    LODOP.ADD_PRINT_TEXT(171, 40, 345, 35, sjaddress)
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10)
    LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)
    LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -5)
    LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -2)

    LODOP.ADD_PRINT_TEXT(220, 10, 15, 36, '寄')
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 12)
    LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -5)

    LODOP.ADD_PRINT_TEXT(217, 40, 236, 20, jjname + '  ' + jjtel)
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
    LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -10)
    LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)
    LODOP.ADD_PRINT_TEXT(229, 40, 263, 20, jjaddress)
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
    LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -4)
    LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)

    LODOP.ADD_PRINT_BARCODE('69mm', '7mm', '90mm', '18mm', '128Auto', mailno)

    LODOP.ADD_PRINT_TEXT(342, 8, 61, 23, now_date)
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
    LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -2)

    LODOP.ADD_PRINT_TEXT(352, 8, 61, 23, now_time)
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 11)
    LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -2)

    LODOP.ADD_PRINT_TEXT(369, 8, 61, 23, '打印时间')
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 9)
    LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -2)

    LODOP.ADD_PRINT_TEXT(384, 8, 61, 23, '数量：')
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
    LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -2)

    LODOP.ADD_PRINT_TEXT(397, 8, 61, 23, '重量：')
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
    LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -2)

    LODOP.ADD_PRINT_TEXT(340, 85, 220, 55, sign_need_read)
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 7)
    LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -2)
    LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -2)

    LODOP.ADD_PRINT_TEXT(397, 248, 81, 23, '签收栏')
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 7)
    LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)
    LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -2)

    LODOP.ADD_PRINT_BARCODE(348, 315, '18mm', '18mm', 'QRCode', destcode + '-' + mailno)

    LODOP.ADD_PRINT_BARCODE(417, 155, '50mm', '8mm', '128Auto', mailno)

    LODOP.ADD_PRINT_TEXT(460, 10, 15, 36, '')
    // 收
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
    LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -5)

    LODOP.ADD_PRINT_TEXT(455, 37, 236, 20, sjname + '  ' + jphone)
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 7)
    LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -10)
    LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)
    LODOP.ADD_PRINT_TEXT(466, 37, 275, 20, sjaddress)
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 7)
    LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -2)
    LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)

    LODOP.ADD_PRINT_TEXT(500, 10, 15, 36, '寄')
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 12)
    LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -5)

    LODOP.ADD_PRINT_TEXT(493, 37, 236, 20, jjname + '  ' + jjtel)
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 7)
    LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -10)
    LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)
    LODOP.ADD_PRINT_TEXT(504, 37, 260, 20, jjaddress)
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 7)
    LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -4)
    LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)

    LODOP.ADD_PRINT_BARCODE(455, 312, '21mm', '21mm', 'QRCode', 'http://www.baidu.com')

    LODOP.ADD_PRINT_TEXT(530, 10, 145, 36, '圆通速递')
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 18)
    LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -5)

    LODOP.ADD_PRINT_TEXT(533, 185, 245, 36, mailno)
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 14)
    LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -5)

    LODOP.ADD_PRINT_TEXT(566, 10, 236, 20, '打印时间：' + now_date + ' ' + now_time)
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 7)
    LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -10)
    LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)

    LODOP.ADD_PRINT_TEXT(566, 200, 236, 20, '数量：      重量：     ')
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 7)
    LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -10)
    LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)

    LODOP.ADD_PRINT_TEXT(584, 10, 15, 36, '')
    // 收
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
    LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -5)

    LODOP.ADD_PRINT_TEXT(588, 37, 236, 20, sjname + '  ' + jphone)
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 7)
    LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -10)
    LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)
    LODOP.ADD_PRINT_TEXT(599, 37, 275, 20, sjaddress)
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 7)
    LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -2)
    LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)

    // /*最底下输出自己的订单号*/
    LODOP.ADD_PRINT_TEXT(632, 15, 260, 20, '订单号：【' + dingdanid + '】')
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
    LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -4)
    LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)

    LODOP.ADD_PRINT_TEXT(648, 37, 320, 40, '发货明细：' + goods_detail)
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
    LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -4)
    LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)

    LODOP.PRINT()
  } else if (logistics_code === '1003') { // 圆通
    LODOP.ADD_PRINT_TEXTA('a', 92, 486, 100, 30, sjname) // a
    LODOP.ADD_PRINT_TEXTA('c', 149, 460, 317, 60, sjaddress + '(提前电联)') // c
    LODOP.ADD_PRINT_TEXTA('d', 93, 133, 75, 28, jjname) // d
    LODOP.ADD_PRINT_TEXTA('h', 370, 246, 112, 40, jjname) // h
    LODOP.ADD_PRINT_TEXTA('l', 200, 164, 130, 25, jjtel) // l
    LODOP.ADD_PRINT_TEXTA('m', 200, 522, 300, 25, jphone) // m
    LODOP.ADD_PRINT_TEXTA('n', 55, 299, 74, 25, dingdanid) // n

    LODOP.SET_PRINT_PAGESIZE(1, '230mm', '127mm', '')
    // LODOP.ADD_PRINT_SETUP_BKIMG('<img border="0" src="../img/yt.jpg?id=9">')
    LODOP.SET_SHOW_MODE('BKIMG_WIDTH', '230mm')
    LODOP.SET_SHOW_MODE('BKIMG_HEIGHT', '127mm')
    LODOP.SET_PRINT_STYLEA('All', 'FontSize', 13)
    LODOP.SET_PRINT_STYLEA('All', 'FontName', '宋体')
    LODOP.SET_PRINT_STYLEA('All', 'Bold', 0)
    LODOP.SET_PRINT_STYLEA('2', 'FontSize', 11)
    LODOP.PRINT()
  } else if (logistics_code === '1004') { // 圆通代收
    LODOP.ADD_PRINT_TEXTA('a', 95, 475, 100, 30, sjname) // a
    LODOP.ADD_PRINT_TEXTA('c', 150, 445, 317, 60, sjaddress + '(提前电联)') // c
    LODOP.ADD_PRINT_TEXTA('d', 95, 115, 175, 28, jjname) // d
    LODOP.ADD_PRINT_TEXTA('h', 367, 265, 175, 40, jjname) // h
    LODOP.ADD_PRINT_TEXTA('l', 205, 150, 130, 25, jjtel) // l
    LODOP.ADD_PRINT_TEXTA('m', 200, 503, 300, 25, jphone) // m
    LODOP.ADD_PRINT_TEXTA('n', 55, 255, 86, 25, dingdanid) // n
    LODOP.ADD_PRINT_TEXTA('o', 245, 448, 35, 35, '√') // o
    LODOP.ADD_PRINT_TEXTA('s', 245, 634, 25, 30, chinese_number_map[money1]) // s
    LODOP.ADD_PRINT_TEXTA('r', 245, 604, 25, 30, chinese_number_map[money10]) // r
    LODOP.ADD_PRINT_TEXTA('p', 245, 571, 25, 30, chinese_number_map[money100]) // p
    LODOP.ADD_PRINT_TEXTA('q', 245, 535, 25, 30, chinese_number_map[money1000]) // q
    LODOP.ADD_PRINT_TEXTA('t', 245, 504, 25, 30, chinese_number_map[money10000]) // t
    LODOP.ADD_PRINT_TEXTA('u', 245, 714, 200, 30, money) // u

    LODOP.SET_PRINT_PAGESIZE(1, '230mm', '127mm', '')
    // LODOP.ADD_PRINT_SETUP_BKIMG('<img border="0" src="../img/yt-cod.jpg?id=9">')
    LODOP.SET_SHOW_MODE('BKIMG_WIDTH', '230mm')
    LODOP.SET_SHOW_MODE('BKIMG_HEIGHT', '127mm')
    LODOP.SET_PRINT_STYLEA('All', 'FontSize', 13)
    LODOP.SET_PRINT_STYLEA('All', 'FontName', '宋体')
    LODOP.SET_PRINT_STYLEA('All', 'Bold', 0)
    LODOP.SET_PRINT_STYLEA('2', 'FontSize', 11)
    LODOP.PRINT()
  } else if (logistics_code === '1005') { // EMS
    LODOP.ADD_PRINT_TEXTA('a', 203, 117, 100, 30, sjname) // a
    LODOP.ADD_PRINT_TEXTA('c', 252, 106, 317, 60, sjaddress + '(提前电联)') // c
    LODOP.ADD_PRINT_TEXTA('d', 85, 116, 75, 28, jjname) // d
    LODOP.ADD_PRINT_TEXTA('h', 188, 680, 112, 40, jjname) // h
    LODOP.ADD_PRINT_TEXTA('l', 85, 265, 130, 25, jjtel) // l
    LODOP.ADD_PRINT_TEXTA('m', 203, 270, 300, 25, jphone) // m
    LODOP.ADD_PRINT_TEXTA('n', 55, 208, 94, 25, dingdanid) // n

    LODOP.SET_PRINT_PAGESIZE(1, '230mm', '127mm', '')
    // LODOP.ADD_PRINT_SETUP_BKIMG('<img border="0" src="youzheng.jpg">')
    LODOP.SET_SHOW_MODE('BKIMG_WIDTH', '230mm')
    LODOP.SET_SHOW_MODE('BKIMG_HEIGHT', '127mm')
    LODOP.SET_PRINT_STYLEA('All', 'FontSize', 13)
    LODOP.SET_PRINT_STYLEA('All', 'FontName', '宋体')
    LODOP.SET_PRINT_STYLEA('All', 'Bold', 0)
    LODOP.SET_PRINT_STYLEA('2', 'FontSize', 11)
    LODOP.SET_PRINT_STYLEA('12', 'FontSize', 24)
    LODOP.PRINT()
  } else if (logistics_code === '1009') {
    console.log('德邦')
    LODOP.SET_PRINT_PAGESIZE(1, '100mm', '180mm', '')
    LODOP.SET_SHOW_MODE('BKIMG_WIDTH', '100mm')
    LODOP.SET_SHOW_MODE('BKIMG_HEIGHT', '180mm')

    LODOP.ADD_PRINT_LINE('2mm', '36mm', '2mm', '98mm', 0, 1)
    LODOP.ADD_PRINT_LINE('14mm', '2mm', '14mm', '98mm', 0, 1)
    LODOP.ADD_PRINT_LINE('2mm', '36mm', '14mm', '36mm', 0, 1)
    LODOP.ADD_PRINT_LINE('2mm', '48mm', '14mm', '48mm', 0, 1)
    LODOP.ADD_PRINT_LINE('2mm', '60mm', '14mm', '60mm', 0, 1)
    LODOP.ADD_PRINT_LINE('2mm', '80mm', '14mm', '80mm', 0, 1)
    LODOP.ADD_PRINT_LINE('14mm', '2mm', '108mm', '2mm', 0, 1)
    LODOP.ADD_PRINT_LINE('2mm', '98mm', '108mm', '98mm', 0, 1)
    LODOP.ADD_PRINT_LINE('29mm', '2mm', '29mm', '98mm', 0, 1)
    LODOP.ADD_PRINT_LINE('45mm', '2mm', '45mm', '98mm', 0, 1)
    LODOP.ADD_PRINT_LINE('57mm', '2mm', '57mm', '98mm', 0, 1)
    LODOP.ADD_PRINT_LINE('80mm', '2mm', '80mm', '98mm', 0, 1)
    LODOP.ADD_PRINT_LINE('100mm', '2mm', '100mm', '98mm', 0, 1)
    LODOP.ADD_PRINT_LINE('108mm', '2mm', '108mm', '98mm', 0, 1)
    LODOP.ADD_PRINT_LINE('80mm', '76mm', '100mm', '76mm', 0, 1)
    LODOP.ADD_PRINT_LINE('100mm', '50mm', '108mm', '50mm', 0, 1)

    LODOP.ADD_PRINT_LINE('112mm', '50mm', '112mm', '98mm', 0, 1)
    LODOP.ADD_PRINT_LINE('120mm', '2mm', '120mm', '98mm', 0, 1)
    LODOP.ADD_PRINT_LINE('129mm', '2mm', '129mm', '98mm', 0, 1)
    LODOP.ADD_PRINT_LINE('138mm', '2mm', '138mm', '98mm', 0, 1)
    LODOP.ADD_PRINT_LINE('112mm', '50mm', '120mm', '50mm', 0, 1)
    LODOP.ADD_PRINT_LINE('120mm', '2mm', '138mm', '2mm', 0, 1)
    LODOP.ADD_PRINT_LINE('112mm', '98mm', '138mm', '98mm', 0, 1)

    LODOP.ADD_PRINT_LINE('142mm', '2mm', '142mm', '98mm', 0, 1)
    LODOP.ADD_PRINT_LINE('178mm', '2mm', '178mm', '98mm', 0, 1)
    LODOP.ADD_PRINT_LINE('142mm', '2mm', '178mm', '2mm', 0, 1)
    LODOP.ADD_PRINT_LINE('142mm', '98mm', '178mm', '98mm', 0, 1)
    if (money > 0) {
      // if (true) {
      LODOP.ADD_PRINT_TEXT('6mm', '36mm', '12mm', '12mm', '到付')
      LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
      LODOP.SET_PRINT_STYLEA(0, 'FontSize', 12)
      LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
      LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)

      LODOP.ADD_PRINT_TEXT('4mm', '60mm', '20mm', '8mm', '代收货款')
      LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
      LODOP.SET_PRINT_STYLEA(0, 'FontSize', 11)
      LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
      LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)
      LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)

      LODOP.ADD_PRINT_TEXT('10mm', '60mm', '20mm', '8mm', '¥' + money + '元')
      LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
      LODOP.SET_PRINT_STYLEA(0, 'FontSize', 11)
      LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
      LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)
    }
    LODOP.ADD_PRINT_TEXT('16mm', '2mm', '96mm', '15mm', destcode)
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 20)
    LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
    LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)
	//收货信息
    LODOP.ADD_PRINT_TEXT('34mm', '2mm', '12mm', '12mm', '收')
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 16)
    LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
    LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)
    LODOP.ADD_PRINT_TEXT('30mm', '15mm', '30mm', '12mm', sjname)
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10)
    LODOP.SET_PRINT_STYLEA(0, 'Alignment', 1)
    LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)
    LODOP.ADD_PRINT_TEXT('30mm', '40mm', '40mm', '12mm', sjtel)
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10)
    LODOP.SET_PRINT_STYLEA(0, 'Alignment', 1)
    LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)
    LODOP.ADD_PRINT_TEXT('35mm', '15mm', '75mm', '18mm', sjaddress)
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10)
    LODOP.SET_PRINT_STYLEA(0, 'Alignment', 1)
    LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)

    // 寄件人
    LODOP.ADD_PRINT_TEXT('48mm', '2mm', '12mm', '12mm', '寄')
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 16)
    LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
    LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)
    LODOP.ADD_PRINT_TEXT('48mm', '15mm', '30mm', '12mm', jjname)
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10)
    LODOP.SET_PRINT_STYLEA(0, 'Alignment', 1)
    LODOP.ADD_PRINT_TEXT('48mm', '40mm', '40mm', '12mm', jjtel)
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10)
    LODOP.SET_PRINT_STYLEA(0, 'Alignment', 1)
    LODOP.ADD_PRINT_TEXT('52mm', '15mm', '75mm', '18mm', jjaddress)
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10)
    LODOP.SET_PRINT_STYLEA(0, 'Alignment', 1)
    LODOP.ADD_PRINT_BARCODE('60mm', '13mm', '80mm', '16mm', '128B', mailno)
    LODOP.ADD_PRINT_TEXT('83mm', '4mm', '72mm', '20mm', sign_need_read)
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 7)
    LODOP.SET_PRINT_STYLEA(0, 'Alignment', 1)
    LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -2)
    LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)
    LODOP.ADD_PRINT_TEXT('96mm', '65mm', '20mm', '8mm', '签收栏')
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
    LODOP.SET_PRINT_STYLEA(0, 'Alignment', 1)
    LODOP.ADD_PRINT_TEXT('88mm', '78mm', '20mm', '20mm', '已验视')
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 13)
    LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
    LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)
    LODOP.ADD_PRINT_TEXT('104mm', '50mm', '50mm', '10mm', '烟台卧龙工业园区营业部')
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10)
    LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)

    LODOP.ADD_PRINT_BARCODE('112mm', '55mm', '50mm', '8mm', '128B', mailno)

    LODOP.ADD_PRINT_TEXT('123mm', '2mm', '10mm', '10mm', '收')
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 14)
    LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
    LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)
    LODOP.ADD_PRINT_TEXT('121mm', '15mm', '20mm', '8mm', sjname)
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
    LODOP.SET_PRINT_STYLEA(0, 'Alignment', 1)
    LODOP.ADD_PRINT_TEXT('121mm', '40mm', '40mm', '8mm', sjtel)
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
    LODOP.SET_PRINT_STYLEA(0, 'Alignment', 1)
    LODOP.ADD_PRINT_TEXT('124mm', '15mm', '80mm', '16mm', sjaddress)
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
    LODOP.SET_PRINT_STYLEA(0, 'Alignment', 1)

    LODOP.ADD_PRINT_TEXT('133mm', '2mm', '10mm', '10mm', '寄')
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 14)
    LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
    LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)
    LODOP.ADD_PRINT_TEXT('131mm', '15mm', '20mm', '8mm', jjname)
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
    LODOP.SET_PRINT_STYLEA(0, 'Alignment', 1)
    LODOP.ADD_PRINT_TEXT('131mm', '40mm', '40mm', '8mm', jjtel)
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
    LODOP.SET_PRINT_STYLEA(0, 'Alignment', 1)
    LODOP.ADD_PRINT_TEXT('134mm', '15mm', '80mm', '16mm', jjaddress)
    LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
    LODOP.SET_PRINT_STYLEA(0, 'Alignment', 1)

    LODOP.PRINT()
  }  else if (logistics_code === '1012') { //中通
    if (money > 0){
      LODOP.SET_PRINT_PAGESIZE(1, '76mm', '128mm', '')
      LODOP.SET_SHOW_MODE('BKIMG_WIDTH', '76mm')
      LODOP.SET_SHOW_MODE('BKIMG_HEIGHT', '128mm')
      // LODOP.PRINT_INITA(0,0,289,492,"");
      LODOP.PRINT_INITA(0,0,289,484,"");
      LODOP.ADD_PRINT_LINE(0,0,1,288,0,1);
      LODOP.ADD_PRINT_TEXT(4,178,115,25,"代收：￥"  + money);
      LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
      LODOP.SET_PRINT_STYLEA(0,"Bold",1);
      LODOP.ADD_PRINT_TEXT(19,27,100,20,now_date_zto);
      LODOP.ADD_PRINT_TEXT(36,74,219,30,destcode);
      LODOP.SET_PRINT_STYLEA(0,"FontSize",18);
      LODOP.SET_PRINT_STYLEA(0,"Bold",1);
      LODOP.ADD_PRINT_LINE(67,0,68,288,0,1);
      LODOP.ADD_PRINT_LINE(0,0,484,1,0,1);
      LODOP.ADD_PRINT_LINE(0,288,484,289,0,1);
      LODOP.ADD_PRINT_LINE(485,0,484,289,0,1);
      LODOP.ADD_PRINT_BARCODE(71,25,258,60,"2_5interleaved",mailno);
      LODOP.ADD_PRINT_LINE(135,0,136,289,0,1);
      LODOP.ADD_PRINT_LINE(169,1,170,211,0,1);
      LODOP.ADD_PRINT_TEXT(142,14,111,25,shoujian);
      LODOP.SET_PRINT_STYLEA(0,"FontSize",14);
      LODOP.SET_PRINT_STYLEA(0,"Bold",1);
      LODOP.ADD_PRINT_LINE(136,211,408,212,0,1);
      LODOP.ADD_PRINT_BARCODE(125,219,60,220,"2_5interleaved",mailno);
      LODOP.SET_PRINT_STYLEA(0,"Angle",90);
      LODOP.ADD_PRINT_LINE(364,212,365,288,0,1);
      LODOP.ADD_PRINT_LINE(246,0,247,211,0,1);
      LODOP.ADD_PRINT_LINE(170,36,298,37,0,1);
      LODOP.ADD_PRINT_LINE(298,0,299,211,0,1);
      LODOP.ADD_PRINT_TEXT(258,9,26,35,"寄");
      LODOP.SET_PRINT_STYLEA(0,"FontSize",14);
      LODOP.SET_PRINT_STYLEA(0,"Bold",1);
      LODOP.ADD_PRINT_TEXT(198,9,27,35,"收");
      LODOP.SET_PRINT_STYLEA(0,"FontSize",14);
      LODOP.SET_PRINT_STYLEA(0,"Bold",1);
      LODOP.ADD_PRINT_TEXT(171,36,174,20,sjname);
      LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
      LODOP.SET_PRINT_STYLEA(0,"Bold",1);
      LODOP.ADD_PRINT_TEXT(187,35,176,20,sjtel);
      LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
      LODOP.SET_PRINT_STYLEA(0,"Bold",1);
      LODOP.ADD_PRINT_TEXT(204,35,176,42,sjaddress);
      LODOP.ADD_PRINT_TEXT(249,38,173,30,jjname + jjtel);
      LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
      LODOP.ADD_PRINT_TEXT(272,38,173,35,jjaddress);
      LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
      LODOP.ADD_PRINT_BARCODE(301,3,92,92,"QRCode",mailnos);
      LODOP.ADD_PRINT_TEXT(305,89,99,20,"本次服务使用中通官网");
      LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
      LODOP.ADD_PRINT_TEXT(305,182,29,20,"(www");
      LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
      LODOP.ADD_PRINT_TEXT(316,89,127,20,".zto.com)公示前的快递服务");
      LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
      LODOP.ADD_PRINT_TEXT(329,89,127,20,"协议条款。您对此单的签收代");
      LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
      LODOP.ADD_PRINT_TEXT(342,89,126,20,"表您已收到快件且包装完好无");
      LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
      LODOP.ADD_PRINT_TEXT(354,89,100,15,"损。");
      LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
      LODOP.ADD_PRINT_TEXT(366,89,105,20,"签收人/时间");
      LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
      LODOP.SET_PRINT_STYLEA(0,"Bold",1);
      LODOP.ADD_PRINT_TEXT(386,115,101,20,"已验视 已实名");
      LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
      LODOP.SET_PRINT_STYLEA(0,"Bold",1);
      LODOP.ADD_PRINT_LINE(408,0,409,289,0,1);
      LODOP.ADD_PRINT_TEXT(410,1,284,68,goods_detail);
      LODOP.PRINT()
    }else{
      LODOP.SET_PRINT_PAGESIZE(1, '76mm', '128mm', '')
      LODOP.SET_SHOW_MODE('BKIMG_WIDTH', '76mm')
      LODOP.SET_SHOW_MODE('BKIMG_HEIGHT', '128mm')
      // LODOP.PRINT_INITA(0,0,289,492,"");
      LODOP.PRINT_INITA(0,0,289,484,"");
      LODOP.ADD_PRINT_LINE(0,0,1,288,0,1);
      LODOP.ADD_PRINT_TEXT(4,178,115,25,"代收：￥"  + money);
      LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
      LODOP.SET_PRINT_STYLEA(0,"Bold",1);
      LODOP.ADD_PRINT_TEXT(19,27,100,20,now_date_zto);
      LODOP.ADD_PRINT_TEXT(36,74,219,30,destcode);
      LODOP.SET_PRINT_STYLEA(0,"FontSize",18);
      LODOP.SET_PRINT_STYLEA(0,"Bold",1);
      LODOP.ADD_PRINT_LINE(67,0,68,288,0,1);
      LODOP.ADD_PRINT_LINE(0,0,484,1,0,1);
      LODOP.ADD_PRINT_LINE(0,288,484,289,0,1);
      LODOP.ADD_PRINT_LINE(485,0,484,289,0,1);
      LODOP.ADD_PRINT_BARCODE(71,25,258,60,"2_5interleaved",mailno);
      LODOP.ADD_PRINT_LINE(135,0,136,289,0,1);
      LODOP.ADD_PRINT_LINE(169,1,170,211,0,1);
      LODOP.ADD_PRINT_TEXT(142,14,111,25,shoujian);
      LODOP.SET_PRINT_STYLEA(0,"FontSize",14);
      LODOP.SET_PRINT_STYLEA(0,"Bold",1);
      LODOP.ADD_PRINT_LINE(136,211,408,212,0,1);
      LODOP.ADD_PRINT_BARCODE(125,219,60,220,"2_5interleaved",mailno);
      LODOP.SET_PRINT_STYLEA(0,"Angle",90);
      LODOP.ADD_PRINT_LINE(364,212,365,288,0,1);
      LODOP.ADD_PRINT_LINE(246,0,247,211,0,1);
      LODOP.ADD_PRINT_LINE(170,36,298,37,0,1);
      LODOP.ADD_PRINT_LINE(298,0,299,211,0,1);
      LODOP.ADD_PRINT_TEXT(258,9,26,35,"寄");
      LODOP.SET_PRINT_STYLEA(0,"FontSize",14);
      LODOP.SET_PRINT_STYLEA(0,"Bold",1);
      LODOP.ADD_PRINT_TEXT(198,9,27,35,"收");
      LODOP.SET_PRINT_STYLEA(0,"FontSize",14);
      LODOP.SET_PRINT_STYLEA(0,"Bold",1);
      LODOP.ADD_PRINT_TEXT(171,36,174,20,sjname);
      LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
      LODOP.SET_PRINT_STYLEA(0,"Bold",1);
      LODOP.ADD_PRINT_TEXT(187,35,176,20,sjtel);
      LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
      LODOP.SET_PRINT_STYLEA(0,"Bold",1);
      LODOP.ADD_PRINT_TEXT(204,35,176,42,sjaddress);
      LODOP.ADD_PRINT_TEXT(249,38,173,30,jjname + jjtel);
      LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
      LODOP.ADD_PRINT_TEXT(272,38,173,35,jjaddress);
      LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
      LODOP.ADD_PRINT_BARCODE(301,3,92,92,"QRCode",mailnos);
      LODOP.ADD_PRINT_TEXT(305,89,99,20,"本次服务使用中通官网");
      LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
      LODOP.ADD_PRINT_TEXT(305,182,29,20,"(www");
      LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
      LODOP.ADD_PRINT_TEXT(316,89,127,20,".zto.com)公示前的快递服务");
      LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
      LODOP.ADD_PRINT_TEXT(329,89,127,20,"协议条款。您对此单的签收代");
      LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
      LODOP.ADD_PRINT_TEXT(342,89,126,20,"表您已收到快件且包装完好无");
      LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
      LODOP.ADD_PRINT_TEXT(354,89,100,15,"损。");
      LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
      LODOP.ADD_PRINT_TEXT(366,89,105,20,"签收人/时间");
      LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
      LODOP.SET_PRINT_STYLEA(0,"Bold",1);
      LODOP.ADD_PRINT_TEXT(386,115,101,20,"已验视 已实名");
      LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
      LODOP.SET_PRINT_STYLEA(0,"Bold",1);
      LODOP.ADD_PRINT_LINE(408,0,409,289,0,1);
      LODOP.ADD_PRINT_TEXT(410,1,284,68,goods_detail);
      LODOP.PRINT()
    }
  //   LODOP.SET_PRINT_PAGESIZE(1, '100mm', '180mm', '')
  //   LODOP.SET_SHOW_MODE('BKIMG_WIDTH', '100mm')
  //   LODOP.SET_SHOW_MODE('BKIMG_HEIGHT', '180mm')
  //   // 画线
  //   LODOP.ADD_PRINT_LINE('0mm', '0mm', '0mm', '100mm', 0, 1)
  //   LODOP.ADD_PRINT_LINE('0mm', '100mm', '179mm', '100mm', 0, 1)
  //   LODOP.ADD_PRINT_LINE('0mm', '0mm', '179mm', '0mm', 0, 1)
  //   LODOP.ADD_PRINT_LINE('179mm', '0mm', '179mm', '100mm', 0, 1)
  //   LODOP.ADD_PRINT_LINE('9mm', '0mm', '9mm', '100mm', 0, 1)
  //   LODOP.ADD_PRINT_LINE('24mm', '0mm', '24mm', '100mm', 0, 1)
  //   LODOP.ADD_PRINT_LINE('24mm', '75mm', '34mm', '75mm', 0, 1)
  //   LODOP.ADD_PRINT_LINE('34mm', '0mm', '34mm', '100mm', 0, 1)
  //   LODOP.ADD_PRINT_LINE('34mm', '9mm', '64mm', '9mm', 0, 1)
  //   LODOP.ADD_PRINT_LINE('52mm', '0mm', '52mm', '100mm', 0, 1)
  //   LODOP.ADD_PRINT_LINE('64mm', '0mm', '64mm', '100mm', 0, 1)
  //   LODOP.ADD_PRINT_LINE('89mm', '0mm', '89mm', '100mm', 0, 1)
  //   LODOP.ADD_PRINT_LINE('89mm', '41mm', '107mm', '41mm', 0, 1)
  //   LODOP.ADD_PRINT_LINE('107mm', '0mm', '107mm', '100mm', 0, 1)
  //   LODOP.ADD_PRINT_LINE('121mm', '0mm', '121mm', '100mm', 0, 1)
  //   LODOP.ADD_PRINT_LINE('139mm', '0mm', '139mm', '100mm', 0, 1)
  //   LODOP.ADD_PRINT_LINE('151mm', '0mm', '151mm', '100mm', 0, 1)
  //   LODOP.ADD_PRINT_LINE('179mm', '0mm', '179mm', '100mm', 0, 1)
  //   LODOP.ADD_PRINT_LINE('121mm', '9mm', '179mm', '9mm', 0, 1)
  //   //ADD_PRINT_TEXT(Top,Left,Width,Height,strContent)
  //   if (money > 0) {
  //     LODOP.ADD_PRINT_SHAPE(4, '0mm', '40mm', '60mm', '9mm', 0, 1, '#000000')
  //     LODOP.SET_PRINT_STYLE('FontColor', '#ffffff')
  //     LODOP.ADD_PRINT_TEXT('3mm', '45mm', '60mm', '6mm', '代收货款' + money + '元')
  //     LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
  //     LODOP.SET_PRINT_STYLEA(0, 'FontSize', 12)
  //     LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)
  //     LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', 3)

  //     LODOP.ADD_PRINT_SHAPE(4, '89mm', '75mm', '25mm', '18mm', 0, 1, '#000000')
  //     LODOP.SET_PRINT_STYLE('FontColor', '#ffffff')
  //     LODOP.ADD_PRINT_TEXT('92mm', '77mm', '25mm', '14mm', '代收货款' + money + '元')
  //     LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
  //     LODOP.SET_PRINT_STYLEA(0, 'FontSize', 12)
  //     LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)
  //     LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', 3)

  //     LODOP.SET_PRINT_STYLE('FontColor', '#000000')

  //     LODOP.ADD_PRINT_TEXT('100mm', '60mm', '20mm', '6mm','已验视')
  //     LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
  //     LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10)
  //   } else {
  //     LODOP.ADD_PRINT_TEXT('3mm', '76mm', '24mm', '6mm', '标准快递')
  //     LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
  //     LODOP.SET_PRINT_STYLEA(0, 'FontSize', 12)

  //     LODOP.ADD_PRINT_TEXT('100mm', '80mm', '20mm', '6mm','已验视')
  //     LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
  //     LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10)
  //   }

  //   LODOP.ADD_PRINT_TEXT('10mm', '4mm', '98mm', '15mm', destcode)
  //   LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
  //   LODOP.SET_PRINT_STYLEA(0, 'FontSize', 36)

  //   LODOP.ADD_PRINT_TEXT('26mm', '4mm', '74mm', '10mm', '集包地')
  //   LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
  //   LODOP.SET_PRINT_STYLEA(0, 'FontSize', 18)
  //   LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)

  //   LODOP.ADD_PRINT_TEXT('28mm', '79mm', '22mm', '7mm', now_date_zto)
  //   LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
  //   LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10)

  //   LODOP.ADD_PRINT_TEXT('38mm', '3mm', '4mm', '16mm', '收件')
  //   LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
  //   LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10)

  //   LODOP.ADD_PRINT_TEXT('54mm', '3mm', '4mm', '10mm', '寄件')
  //   LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
  //   LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10)

  //   LODOP.ADD_PRINT_TEXT('37mm', '12mm', '53mm', '5mm', sjname)
  //   LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
  //   LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10)

  //   LODOP.ADD_PRINT_TEXT('37mm', '65mm', '34mm', '5mm', sjtel)
  //   LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
  //   LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10)
  //   LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)

  //   LODOP.ADD_PRINT_TEXT('42mm', '12mm', '86mm', '5mm', sjaddress)
  //   LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
  //   LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10)

  //   LODOP.ADD_PRINT_TEXT('54mm', '12mm', '50mm', '5mm', jjname)
  //   LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
  //   LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10)

  //   LODOP.ADD_PRINT_TEXT('59mm', '12mm', '86mm', '5mm', jjaddress)
  //   LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
  //   LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10)

  //   LODOP.ADD_PRINT_BARCODE('67mm', '5mm', '86mm', '18mm', '128C', mailno)

  //   LODOP.ADD_PRINT_TEXT('90mm', '2mm', '43mm', '16mm', sign_need_read_zto)
  //   LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
  //   LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)

  //   LODOP.ADD_PRINT_TEXT('92mm', '43mm', '20mm', '6mm','签收人')
  //   LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
  //   LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10)

  //   LODOP.ADD_PRINT_TEXT('100mm', '43mm', '20mm', '6mm','时间')
  //   LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
  //   LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10)

  //   LODOP.ADD_PRINT_BARCODE('110mm', '48mm', '50mm', '9mm', '128C', mailno)

  //   LODOP.ADD_PRINT_TEXT('126mm', '3mm', '4mm', '16mm', '收件')
  //   LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
  //   LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10)

  //   LODOP.ADD_PRINT_TEXT('142mm', '3mm', '4mm', '10mm', '寄件')
  //   LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
  //   LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10)

  //   LODOP.ADD_PRINT_TEXT('158mm', '3mm', '4mm', '10mm', '备 注')
  //   LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
  //   LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10)

  //   LODOP.ADD_PRINT_TEXT('125mm', '12mm', '53mm', '5mm', sjname)
  //   LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
  //   LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10)

  //   LODOP.ADD_PRINT_TEXT('125mm', '65mm', '34mm', '5mm', sjtel)
  //   LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
  //   LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10)
  //   LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)

  //   LODOP.ADD_PRINT_TEXT('130mm', '12mm', '86mm', '5mm', sjaddress)
  //   LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
  //   LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10)

  //   LODOP.ADD_PRINT_TEXT('142mm', '12mm', '50mm', '5mm', jjname)
  //   LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
  //   LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10)

  //   LODOP.ADD_PRINT_TEXT('147mm', '12mm', '86mm', '5mm', jjaddress)
  //   LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
  //   LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10)

  //   LODOP.ADD_PRINT_TEXT('147mm', '12mm', '86mm', '5mm', jjaddress)
  //   LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
  //   LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10)

  //   LODOP.ADD_PRINT_TEXT('153mm', '12mm', '86mm', '5mm', goods_detail)
  //   LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
  //   LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
  //   LODOP.PRINT()
  // } else {
  //   LODOP.ADD_PRINT_TEXTA('z', '', 540, 30, '195542') // z
  // }

  }
}
