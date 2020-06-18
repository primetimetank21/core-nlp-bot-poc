function addUser(username, callback) {
    setTimeout(() => {
        console.log(username + " added.")

        // call callback after the main contents are finished
        callback(username); // you pass in getUser here (parmeters that usually go into it g o here)
    }, 200)
}

function getUser(username) {
    setTimeout(() => {
        console.log(username + " gotten.")
    }, 100)
}

addUser("Jake", getUser)