Renovate `IndexedDb` from @ANUPAMCHAUDHARY1117
===

[@ANUPAMCHAUDHARY1117](https://gist.github.com/ANUPAMCHAUDHARY1117/) wrote a nice example code of IndexedDB. I put type generics to the code and make it more Typescript.

# Result

[IndexedDb.ts](https://github.com/algorithmx/PythonConsole/blob/main/src/IndexedDb.ts) in my project [PythonConsole](https://github.com/algorithmx/PythonConsole)

# Notes

With the help of plugins in VSCode, I finished the renovation in 5 minutes. The important trick is to explicitly provide `entry.d.ts` of the `idb` package to the copilot as context. The annoying (to a human being) works of searching type definitions and calculating template parameters is a joy to the LLM. Here we just have to understand what is going on. 

## tableNames

Augmenting type generic `DBTypes extends DBSchema` to the class `IndexedDb` requires all the calls to `idb` library functions to be parametrized. In particular, `openDB` in `createObjectStore` need the type parameter `DBTypes` of the class. Then we get `db` as a instance of `IDBPDatabase<DBTypes>`, which in turn dictates the `tableNames` to be `StoreNames<DBTypes>`. I manually determined this by clicking on `objectStoreNames` and looking at the associated source code. 


## getValue(id)

The `id` argument in the function `getValue` was of type `number`. For a generic `DBTypes`, this has to be aligned to the `.get` method of `store`. Clicking on this method and look into the source code, we find the type of its argument is `StoreKey<DBTypes, StoreName> | IDBKeyRange`. Here we decide to use `StoreKey<DBTypes, StoreName>`, where `StoreName` is another template parameter. The copilot suggests me to append this type parameter to the `getValue` function I want to renovate. I agree since I found that the return of `tx.objectStore(...)` carries such parameter. Once `DBTypes extends DBSchema` is fully specified, `StoreName` can be inferred somehow. 

## Other member functions

The above way of thinking is sufficient for the rest part of the renovation task. 

## Example

```typescript
import IndexedDb from './IndexedDb';
import { DBSchema } from 'idb';

interface HistoryItem {
    input: string;
    output: string | null;
}

interface HistoryDBSchema extends DBSchema {
    history: {
        key: number;
        value: {
            id?: number;
            input: string;
            output: string | null;
        };
    };
}

//...

const DB_NAME = 'PythonConsoleDB';
const STORE_NAME = 'history';

const db = new IndexedDb<HistoryDBSchema>(DB_NAME);
await db.createObjectStore([STORE_NAME]);
```
