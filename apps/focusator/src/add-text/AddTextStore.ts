

// service component
export class AddTextStore {
  opened = false
  value = ""

  fromClipboard = () => { return '' }
  parser = (_: string) => { return }

  open() {
    return { opened: true, value: this.fromClipboard() }
  }

  submit() {
    this.parser(this.value)
    return { opened: false }
  }

  close() {
    return { opened: false }
  }
}