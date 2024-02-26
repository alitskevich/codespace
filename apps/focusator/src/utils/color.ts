const colors = ['sky', 'red', 'amber', 'green']
export const toColor = (mark: number | string, def = 'black') => {
  return colors[Number(mark)] ?? def
}

export const toColorText = (mark: number | string, def = 'black') => {
  // if (Number(mark) === 3) return def
  return toColor(mark, def)
}
