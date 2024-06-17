const colors = ['sky', 'red', 'gray', 'green']
export const toColor = (mark: number | string, def = 'black') => {
  return colors[Number(mark) + 2] ?? def
}

export const toColorText = (mark: number | string, def = 'black') => {
  // if (Number(mark) === 3) return def
  return toColor(mark, def)
}
