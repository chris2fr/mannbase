// place files you want to import through the `$lib` alias in this folder.


import { writable } from 'svelte/store';
import type { ConsultationsResponse } from './pocketbase/generated-types';


export const consultationsStore = writable<Promise<RecordModel[]>>();




// export async function consultations() {
//   return await pb.collection('consultations').getFullList();
// }
