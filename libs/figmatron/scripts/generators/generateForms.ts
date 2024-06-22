import { dehydrateObject } from "figmatron/src/utils/dehydrateObject";
import { arrayGroupBy, arrayToObject, scalarParse } from "ultimus";

export function generateForms({ forms, formItems, actions, formItemTypes }) {
  const actionsMap = arrayGroupBy(actions, "entity");
  const formsMap = arrayToObject(
    forms.map((form: any) => ({
      ...form,
      fields: [],
      actions: actionsMap[form.id]?.items ?? [],
    }))
  );
  const formItemTypesMap = arrayToObject(formItemTypes, "id", "dataType");

  formItems
    .filter((e) => e.field && !e.deleted)
     
    .map(({ $row, deleted, id, field, ts, ...e }) => ({
      ...dehydrateObject(e),
      id: field,
      uid: id,
      dataType: formItemTypesMap[e.type],
    }))
    .map((e) => Object.entries(e).reduce((acc, e) => Object.assign(acc, { [e[0]]: scalarParse(e[1] as any) }), {}))
    .forEach(({ form, ...field }) => {
      const target = formsMap[form] ?? (formsMap[form] = {});
      (target.fields ?? (target.fields = [])).push(field);
    });

  return formsMap;
}
