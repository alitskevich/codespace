

// service component
export class AddTextStore {
  opened = false
  value = ""

  onOpen = () => { return }
  parser = (_: string) => { return }

  open() {
    return { opened: true, value: this.onOpen() }
  }

  submit() {
    this.parser(this.value)
    return { opened: false }
  }

  close() {
    return { opened: false }
  }
}