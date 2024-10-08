alert("JavaScript works!");
console.log("script loaded");
// Import functionality from other modules
//import { count, increment } from './counter.js';
import counter from './counter.js';


// Define variables

// Attach event listeners to elements

// Startup code that runs at or during page load
console.log(counter.count);
counter.increment();
console.log(counter.count);
counter.increment();
console.log(counter.count);

// Functions to define specific behaviours

// Functions for general use
