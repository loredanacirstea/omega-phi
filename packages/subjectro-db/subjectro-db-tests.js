// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by subject-db.js.
import { name as packageName } from "meteor/subjectro-db";

// Write your tests here!
// Here is an example.
Tinytest.add('subjectro-db - example', function (test) {
  test.equal(packageName, "subjectro-db");
});
