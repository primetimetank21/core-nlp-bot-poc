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

seems like the best way to deal with async calls is by putting the promises in the transition functions instead :)
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
    onCostRequest: (lifecycle, timeout) => {
      print("Cost Request Transition....")

      console.log("From State: " + lifecycle.from);
      console.log("To State: " + lifecycle.to + "\n"); // 'step'
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, timeout)
      })
      // to do things asyncly you need to use promises
    },
    onIdeaSubmission: () => {
      console.log('Submitted')
    },
    onReset: () => {
      print('Reset')
    },
    onTransition: (lifecycle, timeout) => {
      console.log("From State: " + lifecycle.from);
      console.log("To State: " + lifecycle.to + "\n"); // 'step'
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, timeout)
      })
    }
  }
});

// add an observe methods
fsm.observe('onInitState', () => {
  console.log('entered the INIT STATE');
});

// THIS ONE WAS CALLED the transtion observer states work?
fsm.observe('onInitialize', () => {
  console.log('INTIALIZED....');
})
// var fsm2 = new StateMachine({
//   init: 'A',
//   transitions: [
//     { name: 'step', from: 'A', to: 'B' }
//   ],
//   methods: {
//     onStep: function() { console.log('stepped');         },
//     onA:    function() { console.log('entered state A'); },
//     onB:    function() { console.log('entered state B'); },
//   }
// });

// setting up lifecyle events
fsm.initialize(500).then(() => {
  print("Current State: " + fsm.state)
  fsm.costRequest(2000).then(() => {
    print("Current State: " + fsm.state);
  })
});

