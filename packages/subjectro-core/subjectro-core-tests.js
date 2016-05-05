// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by subject-core.js.
import { name as packageName } from "meteor/subjectro-core";

// Write your tests here!
// Here is an example.
Tinytest.add('subjectro-core - example', function (test) {
  test.equal(packageName, "subjectro");
});
