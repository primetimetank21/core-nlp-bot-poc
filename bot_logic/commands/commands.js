
/** This is where the commands and their metadata goes
 * Information on the commands, command name, description and how to process each command are here
 */

var commands = [
    {
        name: "idea",
        command: "/idea",
        description: "takes in one argument: a string of text that describes the idea.",
        callback: () => {
            // this function parses the information out and sends back an object
            console.log("An idea has been called.")
        }
    },
    {
        // will need to save requests some where to keep track of each ones' status
        name: "request",
        command: "/request",
        description: "takes in one or zero arguments. Will create a new request for a certain product. If the product is not recognized will send list of products.",
        pattern: ""
    },
    {
        // cancel the current request from the user
        name: "cancel",
        command: "/cancel",
        description: "Cancels any current request. If request was submitted, it will update request as canceled.",
    },
    {
        // not going to implement for a while
        name: "status",
        command: "/status",
        description: "get the current status of a pending request",
    }
]

module.exports = commands;