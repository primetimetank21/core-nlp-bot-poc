// function addUser(username, callback) {
//     setTimeout(() => {
//         console.log(username + " added.")

//         // call callback after the main contents are finished
//         callback(username); // you pass in getUser here (parmeters that usually go into it g o here)
//     }, 200)
// }

// function getUser(username) {
//     setTimeout(() => {
//         console.log(username + " gotten.")
//     }, 100)
// }

// addUser("Jake", getUser)

let _ = require("lodash");

let main_string = "Hey beautiful! I ran across some of your beautiful art on Pinterest and google and wanted to use it as a logo for my lash brand. I just wanted to ask permission before I used it. I look forward to hearing from you!!".split(" ")
let str_set = new Set(main_string)
let products = ["logos", "book illustrations", "book covers", "portraits"]

// add the products
function weaklyConfirm(set, arr){
    for (let i = 0; i < arr.length; i++){
        if(set.has(arr[i])){
            console.log("true")
        }
    }
}

weaklyConfirm(str_set, products);
 