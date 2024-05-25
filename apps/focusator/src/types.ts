
export type Stemm = {
  id: string,
  names: Record<string, number>,
}

export type BaseWord = {
  id: string,
  name: string,
  type: 'gap' | 'aux' | 'word' | 'space'
  stemm?: Stemm,
  info?: any,
  seen?: number,
  acquired?: number,
  count?: number,
  sentences?: string[]
}
