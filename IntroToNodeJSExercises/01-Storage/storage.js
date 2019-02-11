const fs = require("fs");
const path = require("path");
const notifications = require("./notifications");

const fileName = "storage.json";
const filePath = "./data/";
const fullFilePath = path.join(filePath, fileName);
const utf8 = "utf8";

let storage = {};

function isValidType(key) {
    return typeof key === "string";
}

function exists(key) {
    return storage.hasOwnProperty(key);
}

function isEmpty(collection) {
    return Object.keys(collection).length == 0;
}

module.exports = {
    put: (key, value) => {
        if (!isValidType(key)) {
            throw new Error(notifications.invalidKeyTypeMsg);
        }
        if (exists(key)) {
            throw new Error(notifications.keyAlreadyExistsMsg);
        }

        storage[key] = value;
    },
    get: key => {
        if (!isValidType(key)) {
            throw new Error(notifications.invalidKeyTypeMsg);
        }
        if (!exists(key)) {
            throw new Error(notifications.keyDoesNotExistMsg);
        }

        return storage[key];
    },
    getAll: () => {
        return isEmpty(storage) ? notifications.storageIsEmptyMsg : storage;
    },
    update: (key, newValue) => {
        if (!isValidType(key)) {
            throw new Error(notifications.invalidKeyTypeMsg);
        }
        if (!exists(key)) {
            throw new Error(notifications.keyDoesNotExistMsg);
        }

        storage[key] = newValue;
    },
    delete: key => {
        if (!isValidType(key)) {
            throw new Error(notifications.invalidKeyTypeMsg);
        }
        if (!exists(key)) {
            throw new Error(notifications.keyDoesNotExistMsg);
        }

        delete storage[key];
    },
    clear: () => {
        storage = {};
        // console.log(notifications.storageClearedMsg);
    },
    saveSync: () => {
        let dataJson = JSON.stringify(storage, null, 4);
        fs.writeFileSync(fullFilePath, dataJson, utf8);
        // console.log(notifications.fileSavedMsg);
    },
    save: () => {
        return new Promise((resolve, reject) => {
            let dataJson = JSON.stringify(storage, null, 4);
            fs.writeFile(fullFilePath, dataJson, err => {
                if (err) {
                    reject(err);
                    console.log(err);
                    return;
                }

                resolve();
                // console.log(notifications.fileSavedMsg);
            });
        });
    },
    loadSync: () => {
        if (fs.existsSync(fullFilePath)) {
            let dataJson = fs.readFileSync(fullFilePath, utf8);
            storage = JSON.parse(dataJson);
            // console.log(notifications.fileLoadedMsg);
        }
    },
    load: () => {
        return new Promise((resolve, reject) => {
            fs.exists(fullFilePath, exists => {
                if (exists) {
                    fs.readFile(fullFilePath, utf8, (err, data) => {
                        if (err) {
                            reject(err);
                            console.log(err);
                            return;
                        }

                        storage = JSON.parse(data);
                        resolve();
                        // console.log(notifications.fileLoadedMsg);
                    });
                }
            });
        });
    }
}