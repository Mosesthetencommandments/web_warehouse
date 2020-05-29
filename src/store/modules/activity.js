import { getSystemActivityList } from '@/api/system'

function getDateArry(begin, end) {
  let columnList = []
  var ab = begin.split('-')
  var ae = end.split('-')
  var db = new Date()
  db.setUTCFullYear(ab[0], ab[1] - 1, ab[2])
  var de = new Date()
  de.setUTCFullYear(ae[0], ae[1] - 1, ae[2])
  var unixDb = db.getTime()
  var unixDe = de.getTime()
  for (var k = unixDb; k <= unixDe;) {
    columnList.push(getformat(new Date(parseInt(k))).toString())
    k = k + 24 * 60 * 60 * 1000
  }
  return columnList
}

function getformat(Date) {
  let s = ''
  s += Date.getFullYear() + '-'
  if (Date.getMonth() + 1 < 10) {
    s += '0' + (Date.getMonth() + 1) + '-'
  } else {
    s += (Date.getMonth() + 1) + '-'
  }
  if (Date.getDate() < 10) {
    s += '0' + Date.getDate()
  } else {
    s += Date.getDate()
  }
  return (s)
}

const activity = {
  state: {
    activityDate: []
  },
  mutations: {
    SET_ACTIVITY: (state, data) => {
      state.activityDate = data
    }
  },
  actions: {
    // 获取活动时间
    GetActivity({ commit }) {
      getSystemActivityList({ page_size: 0 }).then(res => {
        const arr = []
        const list = res.data.map(item => {
          item.data_range = [item.start_at, item.terminal_at]
          return item.data_range
        })
        list.forEach(item => {
          arr.push(...getDateArry(item[0], item[1]))
        })
        commit('SET_ACTIVITY', arr)
      })
    }
  }
}

export default activity
