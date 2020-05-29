export function handleDisableBtn(event) {
  console.log(event.target.tagName)
  if (event.target.tagName === 'BUTTON') {
    const oldNode = event.target.children[0]
    const node = document.createElement('i')
    event.target.insertBefore(node, oldNode)
    event.target.children[0].setAttribute('class', 'el-icon-loading')
    const calssArry = event.target.getAttribute('class').split(' ')
    calssArry.push('is-loading')
    const classString = calssArry.join(' ')
    event.target.setAttribute('class', classString)
    event.target.setAttribute('disabled', 'disabled')
    console.log(event.target)
  } else if (event.target.tagName === 'SPAN') {
    console.log(event.target.parentNode)
    const oldNode = event.target.parentNode.children[0]
    const node = document.createElement('i')
    // console.log(event.target)
    event.target.parentNode.insertBefore(node, oldNode)
    event.target.parentNode.children[0].setAttribute('class', 'el-icon-loading')
    const calssArry = event.target.parentNode.getAttribute('class').split(' ')
    calssArry.push('is-loading')
    const classString = calssArry.join(' ')
    event.target.parentNode.setAttribute('class', classString)
    event.target.parentNode.setAttribute('disabled', 'disabled')
  }
}
export function stopDisableBtn(event) {
  if (event.target.tagName === 'BUTTON') {
    console.log(event.target.child)
    const child = event.target.children[0]
    event.target.removeChild(child)
    event.target.removeAttribute('disabled')
    // console.log(event.target)
    const classArry = event.target.getAttribute('class').split(' ')
    for (const v of classArry) {
      if (v === 'is-loading') {
        const index = classArry.indexOf(v)
        classArry.splice(index, 1)
        const classString = classArry.join(' ')
        event.target.setAttribute('class', classString)
        console.log(event.target)
      }
    }
  } else if (event.target.tagName === 'SPAN') {
    console.log(event.target.parentNode.child)
    const child = event.target.parentNode.children[0]
    event.target.parentNode.removeChild(child)
    event.target.parentNode.removeAttribute('disabled')
    // console.log(event.target)
    const classArry = event.target.parentNode.getAttribute('class').split(' ')
    for (const v of classArry) {
      if (v === 'is-loading') {
        const index = classArry.indexOf(v)
        classArry.splice(index, 1)
        const classString = classArry.join(' ')
        event.target.parentNode.setAttribute('class', classString)
        console.log(event.target)
      }
    }
  }
}

