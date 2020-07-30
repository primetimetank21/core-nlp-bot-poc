
/** This is where the commands and their metadata goes
 * Information on the commands, command name, description and how to process each command are here
 */

var commands = [
    {
        name: "idea",
        command: "/idea",
        description: "takes in one argument: a string of text that describes the idea.",
        arguments: 1
    },
    {
        // will need to save requests some where to keep track of each ones' status
        name: "request",
        command: "/request",
        description: "takes in one or zero arguments. Will create a new request for a certain product. If the product is not recognized will send list of products.",
        arguments: 1
    },
    {
        // cancel the current request from the user
        name: "cancel",
        command: "/cancel",
        description: "Cancels any current request. If request was submitted, it will update request as canceled.",
        arguments: 0
    },
    {
        // not going to implement for a while
        name: "status",
        command: "/status",
        description: "get the current status of a pending request",
        argument: 1
    }
]