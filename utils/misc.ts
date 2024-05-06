export const keyFromName = (data: {[key: string]: string}) => {
  const map = {}
  for (const key in data) {
    const name = data[key]
    map[name] = key
  }
  return map
} 