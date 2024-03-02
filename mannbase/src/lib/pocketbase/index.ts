import PocketBase, { RecordService, type AuthProviderInfo, type RecordModel } from "pocketbase";
// import {PocketBase} from "pocketbase/index";
import { type TypedPocketBase, Collections } from "$lib/pocketbase/generated-types";

import { readable, type Readable, type Subscriber, writable, type Writable } from "svelte/store";
import { browser } from "$app/environment";
import { base } from "$app/paths";
// import { invalidateAll } from "$app/navigation";

export const client = new PocketBase(
  browser ? window.location.origin + "/" + base : undefined
) as TypedPocketBase;

export async function login(
  email: string,
  password: string,
  register = false,
  rest: { [key: string]: any } = {}
) {
  if (register) {
    const user = { ...rest, email, password, confirmPassword: password };
    await client.collection("users").create(user);
  }
  await client.collection("users").authWithPassword(email, password);
}

export function logout() {
  client.authStore.clear();
}
// export interface RecordServiceStore<T = any> extends Readable<RecordService> {};
// export interface RecordModelArrayStore<T = any> extends Readable<RecordModel[]> {};
// // export function getRecordModelArray<T>M
// // export const recordModelArray = writable<RecordModel[]>();
// export async function getPocketItems<T>(idOrName: string): Promise<RecordModelArrayStore<T>> {
//   let result = client.collection(idOrName).getFullList({});
//   let set: Subscriber<RecordModelArrayStore<T>>;
//   const store = readable<RecordModelArrayStore<T>>(result, (_set) => {
//     set = _set;
//   });
//   return result;
// }

// export interface CollectionsStore<T = any> extends Readable<Collections>{};
// export interface RecordsModelArrayStore<T = any> extends Readable<T[]>{};
// export interface RecordModelArrayStore<T = Promise<ConsultationsResponse<unknown>[]>> extends Readable{};

// export function watch<T> (
//   idOrName: string,
//   // queryParams = {} as any,
//   // page = 1,
//   // perPage = 20,
//   realtime = browser
// ): Promise<RecordsModelArrayStore<T>> {
//   const collection = client.collection(idOrName).getFullList({});
//   // const collections = new Object() as CollectionsStore;
//   const store = readable<RecordModel[]>(collection, )
//   return collection;
// };

// export const recordModelArray = client.collection('consultations').getFullList({}) as RecordModelArrayStore;


/*
 * Save (create/update) a record (a plain object). Automatically converts to
 * FormData if needed.
 */
export async function save(collection: string, record: any, create = false) {
  // convert obj to FormData in case one of the fields is instanceof FileList
  const data = object2formdata(record);
  if (record.id && !create) {
    // "create" flag overrides update
    return await client.collection(collection).update(record.id, data);
  } else {
    return await client.collection(collection).create(data);
  }
}

// convert obj to FormData in case one of the fields is instanceof FileList
function object2formdata(obj: {}) {
  // check if any field's value is an instanceof FileList
  if (
    !Object.values(obj).some(
      (val) => val instanceof FileList || val instanceof File
    )
  ) {
    // if not, just return the original object
    return obj;
  }
  // otherwise, build FormData (multipart/form-data) from obj
  const fd = new FormData();
  for (const [key, val] of Object.entries(obj)) {
    if (val instanceof FileList) {
      for (const file of val) {
        fd.append(key, file);
      }
    } else if (val instanceof File) {
      // handle File before "object" so that it doesn't get serialized as JSON
      fd.append(key, val);
    } else if (Array.isArray(val)) {
      // for some reason, multipart/form-data wants arrays to be comma-separated strings
      fd.append(key, val.join(","));
    } else if (typeof val === "object") {
      fd.append(key, JSON.stringify(val));
    } else {
      fd.append(key, val as any);
    }
  }
  return fd;
}

// export interface PageStore<T = any> extends Readable<RecordService> {
// }

// export function watch<T>(
//   idOrName: string,
//   queryParams = {} as any,
//   page = 1,
//   perPage = 20,
//   realtime = browser
// ): Promise<PageStore<T>> {
//   // const recService = new RecordService();
//   // const collection =  client.collection(idOrName);
//   // let result = new ListResult(page, perPage, 0, 0, [] as T[]);
//   let result = getResult(idOrName, page, perPage, queryParams);
//   let set: Subscriber<RecordService>;
//   const store = readable<RecordService>(result, (_set) => {
//     set = _set;
//     // fetch first page
//     collection
//       .getList(page, perPage, queryParams)
//       .then((r) => set((result = r)));
//     // watch for changes (only if you're in the browser)
//     if (realtime)
//       collection.subscribe("*", ({ action, record }) => {
//         (async function (action: string) {
//           // see https://github.com/pocketbase/pocketbase/discussions/505
//           async function expand(expand: any, record: any) {
//             return expand
//               ? await collection.getOne(record.id, { expand })
//               : record;
//           }
//           switch (action) {
//             case "update":
//               record = await expand(queryParams.expand, record);
//               return result.items.map((item) =>
//                 item.id === record.id ? record : item
//               );
//             case "create":
//               record = await expand(queryParams.expand, record);
//               const index = result.items.findIndex((r) => r.id === record.id);
//               // replace existing if found, otherwise append
//               if (index >= 0) {
//                 result.items[index] = record;
//                 return result.items;
//               } else {
//                 return [...result.items, record];
//               }
//             case "delete":
//               return result.items.filter((item) => item.id !== record.id);
//           }
//           return result.items;
//         })(action).then((items) => set((result = { ...result, items })));
//       });
//   });
//   async function getResult(idOrName: string, page: number, perPage: number, queryParams: any) {
//     return await client.collection(idOrName).getList(page, perPage, queryParams);
//   }
//   async function setPage(newpage: number) {
//     const { page, totalPages, perPage } = result;
//     if (page > 0 && page <= totalPages) {
//       set((result = await collection.getList(newpage, perPage, queryParams)));
//     }
//   }
//   return {
//     ...store,
//     setPage,
//     async next() {
//       setPage(result.page + 1);
//     },
//     async prev() {
//       setPage(result.page - 1);
//     },
//   };
// }

export async function providerLogin(
  provider: AuthProviderInfo,
  authCollection: RecordService
) {
  const authResponse = await authCollection.authWithOAuth2({
    provider: provider.name,
    createData: {
      // emailVisibility: true,
    },
  });
  // update user "record" if "meta" has info it doesn't have
  const { meta, record } = authResponse;
  let changes = {} as { [key: string]: any };
  if (!record.name && meta?.name) {
    changes.name = meta.name;
  }
  if (!record.avatar && meta?.avatarUrl) {
    const response = await fetch(meta.avatarUrl);
    if (response.ok) {
      const type = response.headers.get("content-type") ?? "image/jpeg";
      changes.avatar = new File([await response.blob()], "avatar", { type });
    }
  }
  if (Object.keys(changes).length) {
    authResponse.record = await save(authCollection.collectionIdOrName, {
      ...record,
      ...changes,
    });
  }
  return authResponse;
}
