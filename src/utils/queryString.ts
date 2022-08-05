export const queryString = (obj: any) => {
  const str =
    '?' +
    Object.keys(obj)
      .map(key => {
        return `${key}=${encodeURIComponent(obj[key])}`
      })
      .join('&')

  return str
}
