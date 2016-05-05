// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by subject-search.js.
import { name as packageName } from "meteor/subjectro-search";

// Write your tests here!
// Here is an example.
Tinytest.add('subjectro-search - example', function (test) {
  test.equal(packageName, "subjectro-search");
});
