const filterObject = (obj: any, fields: any, filterFields: any) => {
  const response: any = {};
  const keys = Array.isArray(obj) ? obj : Object.keys(obj);
  keys.forEach((key: any) => {
    let filterKey = key;
    if (Array.isArray(fields) && fields[0] === "dynamic") {
      filterKey = "dynamic";
    }
    if (fields.indexOf(key) >= 0 || filterKey === "dynamic") {
      if (!filterFields[filterKey]) {
        response[key] = obj[key];
      } else if (Array.isArray(filterFields[filterKey])) {
        response[key] = obj[key]
          ? mask(obj[key], filterFields[filterKey][0])
          : obj[key];
      } else {
        const newFields = Object.keys(filterFields[filterKey]);
        response[key] = obj[key]
          ? Array.isArray(obj[key])
            ? mask(obj[key], filterFields[filterKey])
            : filterObject(obj[key], newFields, filterFields[filterKey])
          : obj[key];
      }
    }
  });
  return response;
};

const mask = (data: any, filterFields: any) => {
  let responseList: any = [];
  const fields = Object.keys(filterFields);
  if (Array.isArray(data)) {
    data.map((obj: any) => {
      responseList.push(filterObject(obj, fields, filterFields));
    });
    return responseList;
  } else {
    return filterObject(data, fields, filterFields);
  }
};

export default mask;

export function removeFieldsFromNestedJSON(obj: any) {
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      removeFieldsFromNestedJSON(obj[i]);
    }
  } else if (typeof obj === "object" && obj !== null) {
    if (obj.hasOwnProperty("created_at")) delete obj.createdAt;
    if (obj.hasOwnProperty("updated_at")) delete obj.updated_at;
    if (obj.hasOwnProperty("created_by")) delete obj.createdBy;
    if (obj.hasOwnProperty("updated_by")) delete obj.updatedBy;
    if (obj.hasOwnProperty("is_active")) delete obj.is_active;
    for (const key in obj) {
      removeFieldsFromNestedJSON(obj[key]);
    }
  }
  return obj;
}
