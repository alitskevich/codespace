import { Component } from "arrmatura";
import { Hash } from "ultimus";

export class FieldFileController extends Component {
  disabled: any;
  value?: string;
  field = "file";

  change(_data?: Hash) {
    //no-op
  }

  uploadFiles(_data?: { value: FormData; field: string }) {
    //no-op
  }

  get files() {
    return JSON.parse(this.value ?? "[]");
  }

  set files(files) {
    const value = JSON.stringify(files);
    this.change({ value });
    this.value = value;
  }

  onAppendFiles({ value = [] }) {
    if (this.disabled) return;

    const files = this.files;

    const formData = new FormData();

    [...value].forEach((file) => {
      const { lastModified, name, type } = file;
      formData.append(name, file, name);
      files.push({
        id: `${name}#${lastModified}`,
        name,
        type,
        objectUrl: URL.createObjectURL(file),
      });
    });

    this.uploadFiles({ value: formData, field: this.field });

    return { files };
  }
}
