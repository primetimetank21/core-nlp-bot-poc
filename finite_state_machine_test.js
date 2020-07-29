var StateMachine = require('javascript-state-machine');

function print (obj) {
  console.log(obj)
}

/*
A brief overview:

- the transitions describe going from one state to the other.
- the methods are automatically called when the corresponding transition is called

Life Cycle Transition to help with clean up and initialization before a state (really helpful)
onBeforeTransition - fired before any transition
onLeaveState - fired when leaving any state
onTransition - fired during any transition
onEnterState - fired when entering any state
onAfterTransition - fired after any transition
*/

var fsm = new StateMachine({
  //init: 'InitState',
  transitions: [
    {name: 'initialize', from: 'none', to: 'InitState'},
    {name: 'costRequest', from: 'InitState', to:'RequestState'}, // user makes a request -> a request is detected
    {name: 'ideaSubmission', from: 'RequestState', to:'ReviewState'}, // user submits an idea, goes to review
    {name: 'reset', from: "*", to: 'InitState'} // probably won't use very often
  ],
  methods: {
    onCostRequest: () => {
      print("Cost Request")
      // to do things asyncly you need to use promises
    },
    onIdeaSubmission: () => {
      console.log('Submitted')
    },
    onReset: () => {
      print('Reset')
    },
    onTransition: (lifecycle) => {
      console.log("From State: " + lifecycle.from);
      console.log("To State: " + lifecycle.to + "\n"); // 'step'
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 1000)
      })

    }
  }
});

// setting up lifecyle events
fsm.initialize().then(() => {
  print(fsm.state)
  fsm.costRequest().then(() => {
    print(fsm.state);
  })
});
// fsm.costRequest();
// print(fsm.state);
