export const toColor = (mark: number) => {
  if (mark <= 0) return 'sky-400'
  if (mark <= 20) return 'red-400'
  if (mark <= 60) return 'amber-400'
  if (mark <= 90) return 'green-400'
  return 'white'

}