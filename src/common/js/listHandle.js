export default function handleList(list) {
  let ret = []

  list.forEach((item) => {
    ret.push(parseInt(item.dissid))
  })

  return ret
}