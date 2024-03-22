export class DataTypes {
  static BorrowBookData = {
    username: "",
    book_name: "",
  };
  static ReturnBookData = {
    username: "",
    book_name: "",
  };
  static BookData = {
    book_name: "",
    authors: [],
    faculty: "",
    subject: "",
    amount: "",
  };
  static ShowUserBooks = {
    username: "",
  };
}

export const checkData = (data, schema) => {
  for (let key in schema) {
    if (!data[key] || typeof data[key] != typeof schema[key]) {
      throw new Error("You have entered wrong or incomplete data! Try again");
    }
  }
};

export const openDb = async () => {
  return new Promise((resolve, reject) => {
    let request = indexedDB.open("libraryDatabase", 1);
    request.onupgradeneeded = function (event) {
      let db = event.target.result;
      db.createObjectStore("user", { keyPath: "username", unique: true });
      db.createObjectStore("book", { keyPath: "book_name", unique: true });
      db.createObjectStore("rental", {
        keyPath: "id",
        autoIncrement: true,
        unique: true,
      });
    };
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
    request.onerror = (event) => {
      reject("Error occured");
    };
  });
};

export const addData = (store, data, db, onSuccessMsg = "") => {
  return new Promise((resolve, reject) => {
    let transaction = db.transaction([store], "readwrite");
    let objStore = transaction.objectStore(store);
    objStore.add(data);
    transaction.oncomplete = (event) => {
      onSuccessMsg
        ? console.log(onSuccessMsg)
        : console.log("Succesfully added data to", store);

      resolve(event);
    };
    transaction.onerror = (err) => {
      console.error("Couldn't add data to", store, " beacuse of error: ", err);
      transaction.abort();
    };
  });
};

export const getObject = (store, key, db) => {
  let transaction = db.transaction([store], "readonly");
  let objStore = transaction.objectStore(store);
  const getRequest = objStore.get(key);
  console.group("Get object function");
  const promise = new Promise((resolve, reject) => {
    getRequest.onsuccess = (event) => {
      !event.target.result
        ? console.warn("No data was found in", store)
        : console.log("Succesfully retrieved data from ", store);
      console.groupEnd();
      resolve(event.target.result);
    };
    getRequest.onerror = (err) => {
      reject(err);
    };
  });

  transaction.onerror = (err) => {
    console.error(err);
    transaction.abort();
    console.groupEnd();
  };

  return promise;
};

export const getData = async (store, db, conditions, onlyFirst = false) => {
  return new Promise((resolve, reject) => {
    let transaction = db.transaction([store], "readonly");
    let objStore = transaction.objectStore(store);
    let request = objStore.openCursor();
    let result = [];

    request.onsuccess = (event) => {
      let cursor = event.target.result;
      let isGood = true;
      if (cursor) {
        for (let condition of conditions) {
          if (!condition[1](cursor.value[condition[0]])) {
            isGood = false;
            break;
          }
        }
        if (isGood) {
          result.push(cursor.value);
          if (onlyFirst) {
            resolve(result);
            return;
          }
        }
        cursor.continue();
      } else {
        resolve(result);
      }
    };
    request.onerror = (err) => {
      reject(err);
    };
  });
};

export const deleteObject = async (store, key, db) => {
  let transaction = db.transaction([store], "readwrite");
  let objStore = transaction.objectStore(store);
  const deleteRequest = objStore.delete(key);
  deleteRequest.onsuccess = (event) => {
    console.log("You have succesfully deleted object from ", store);
  };
  transaction.onerror = (err) => {
    console.error(
      "Couldn't delete data from ",
      store,
      " beacuse of error: ",
      err
    );
    transaction.abort();
    reject(err);
  };
};

export const updateObject = async (store, data, db) => {
  let transaction = db.transaction([store], "readwrite");
  let objStore = transaction.objectStore(store);
  const updateRequest = objStore.put(data);
  updateRequest.onsuccess = (event) => {
    console.log("You have succesfully updated object from ", store);
  };
  transaction.onerror = (err) => {
    console.error(
      "Couldn't update object from ",
      store,
      " beacuse of error: ",
      err
    );
    transaction.abort();
    reject(err);
  };
};
