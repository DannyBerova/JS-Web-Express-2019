const storage = require("./storage");

//USE CASE SCENARIO - SYNC, ASYNC, INVALID INPUT

//Test sync functionality!!!:
try {
    storage.put("fi", "firstPlayer");
    storage.put("second", "secondPlayer");
    storage.put("third", "thirdPlayer");
    console.log(storage.get("fi"));
    storage.put("fourth", "fourthPlayer");
    storage.put("fifth", "fifthPlayer");
    console.log(JSON.stringify(storage.getAll(), null, '\t'));
    storage.delete("second");
    storage.update("fi", "updatedPlayer");
    
    storage.saveSync();
    console.log(JSON.stringify(storage.getAll(), null, '\t'));

    storage.clear();
    console.log(JSON.stringify(storage.getAll(), null, '\t'));
 // clear is not saved
    storage.loadSync();
    console.log(JSON.stringify(storage.getAll(), null, '\t'));
} catch (err) {
    console.log(err.message);
}

//Test async functionality!!!:

// (async function () {
//     try {
//         await storage.put("first", "firstPlayer");
//         await storage.put("second", "secondPlayer");
//         await storage.put("third", "thirdPlayer");
//         console.log(await storage.get("first"));
//         await storage.put("fouth", "fourthPlayer");
//         await storage.put("fifth", "fifthPlayer");
//         console.log(JSON.stringify(await storage.getAll(), null, '\t'));
//         await storage.delete("second");
//         await storage.update("first", "updatedPlayer");
        
//         await storage.save();
//         console.log(JSON.stringify(await storage.getAll(), null, '\t'));

//         await storage.clear();
//         console.log(JSON.stringify(await storage.getAll(), null, '\t'));
//         //clear is not saved
//         await storage.load();
//         console.log(JSON.stringify(await storage.getAll(), null, '\t'));
//     } catch (err) {
//         console.log(err.message);
//     }
// })();


// // Testing invalid input
//case 1
// storage.put('first', 'firstPlayer');
// storage.put('first', 'firstPlayer');

//case 2
// storage.put('first', 'firstPlayer');
// storage.delete('second'); // invalid key

//case 3
// storage.put(2, 'somePlayer'); // invalid type

//case 4
// storage.put('test', 'val');
// storage.put('test', 'anotherVal'); // existing key