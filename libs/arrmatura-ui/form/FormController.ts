import { Component } from "arrmatura";
import { arrayGroupBy, getPredicat } from "ultimus";
import { Hash, StringHash, Obj, Data } from "ultimus/types";

import { FieldMeta } from "./types";
import { GroupMeta } from "./types";

const getFieldsGroups = (fields: FieldMeta[], names?: StringHash): GroupMeta[] => {
  return Object.values(arrayGroupBy(fields, "group")).map(({ id, ...e }, index) => ({
    name: names?.[id] ?? (index ? id : ""),
    ...e,
    id: String(id),
  }));
};

export class FormController extends Component {
  data: { [k: string]: unknown } = {};
  meta: any;
  error: any;
  fixFirstTab = false;
  change: any;
  tabs: StringHash = {};
  groups: StringHash = {};
  #fields: FieldMeta[] = [];
  counter = 0;

  __init() {
    return null;
  }

  setData(d: Data) {
    const data = { ...d };
    this.log("data", data);
    this.data = data;
  }

  get fieldsGroups(): Obj[] {
    return getFieldsGroups(this.fields, this.groups);
  }

  get tabsInfo() {
    const tabs = Object.values(arrayGroupBy(this.fields, ({ tab = "tab" }) => tab)).map(
      ({ id, items }) => ({
        id,
        name: this.tabs?.[id],
        items: getFieldsGroups(items, this.groups),
      })
    );
    const fixedTab =
      this.fixFirstTab || tabs.length === 1 || tabs[0].id === "top" ? tabs.shift() : null;
    return { fixedTab, initialTab: tabs?.[0]?.id, tabs };
  }

  set metaId(id: unknown) {
    this.#fields = [];
  }

  get fields(): FieldMeta[] {
    if (this.#fields?.length) return this.#fields;

    const getData = () => this.data;

    const getDisabled = () => this.disabled;

    const onChange = (id: string) => {
      return ({ value, key = id }: { value: unknown; key?: string }) => {
        if (this.data[key] === value) return;

        this.log("onChange", key, value);

        this.data = { ...this.data, [key]: value };

        this.change?.(this.data);

        this.up({ touched: true });
      };
    };

    const onChangeFor = new Proxy(
      {},
      {
        get(target: any, prop: string) {
          return target[`$${prop}`] || (target[`$${prop}`] = onChange(prop));
        },
      }
    );

    const metadata =
      this.meta
        ?.filter(({ type, id, name }: StringHash) => {
          if (type === "tab") {
            this.tabs[id] = name;
            return false;
          }
          if (type === "group") {
            this.groups[id] = name;
            return false;
          }
          return true;
        })
        .map((field: StringHash) => {
          const {
            id,
            visible,
            disabled = false,
            name,
            caption = name,
            type,
            multi,
            typeSpec,
            ...rest
          } = field;

          const ff = {
            ...rest,
            id,
            type: multi ? `${type}.Multi` : type,
            typeSpec,
            caption,
            multi,
            error: (this.errors as Hash[])?.find((err) => err.field === id)?.message ?? null,
            onChange: onChange(id),
            onChangeFor,
            get value() {
              // console.log("get value", id, getData()?.[id]);
              return getData()?.[id] ?? null;
            },
            get data() {
              return getData();
            },
            get disabled() {
              return getDisabled() || (disabled && getPredicat(disabled)(getData()));
            },
            get hidden() {
              return !(visible ? getPredicat(visible)(getData()) : true);
            },
          };
          return ff;
        }) ?? [];

    this.#fields = metadata;

    return this.#fields;
  }

  onUploadFiles({ value }: { value: FormData }) {
    this.log("onUploadFiles", value);
  }
}
