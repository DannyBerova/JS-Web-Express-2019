const storage = require("./storage");

storage.load();

storage.put("first", "firstPlayer");
storage.put("second", "secondPlayer");
storage.put("third", "thirdPlayer");
console.log(storage.get("first"));
storage.put("fouth", "fourthPlayer");
console.log(JSON.stringify(storage.getAll(), null, 4));
storage.delete("second");
storage.update("first", "updatedPlayer");

storage.saveSync();
// storage.save();

storage.clear();
console.log(JSON.stringify(storage.getAll(), null, 4));

storage.loadSync();
// storage.load();

console.log(JSON.stringify(storage.getAll(), null, 4));

// // Testing invalid input
// storage.put('first', 'firstPlayer');
// storage.put('second', 'secondPlayer');
// storage.delete('second'); // invalid key
// storage.put(2, 'somePlayer'); // invalid type
// storage.put('test', 'val');
// storage.put('test', 'anotherVal'); // existing key