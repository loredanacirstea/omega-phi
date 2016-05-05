// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by subjectro-mathjax.js.
import { name as packageName } from "meteor/subjectro-mathjax";

// Write your tests here!
// Here is an example.
Tinytest.add('subjectro-mathjax - example', function (test) {
  test.equal(packageName, "subjectro-mathjax");
});
