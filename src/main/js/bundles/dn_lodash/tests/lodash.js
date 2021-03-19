import registerSuite from "intern!object";
import assert from "intern/chai!assert";
import module from "module";
import { join } from "../index"
import { join as join2 } from "../reduced"

registerSuite({
    name: module.id,
    "join1 sample": function () {
        const str = join(['a', 'b', 'c'], '~');
        assert.equal(str, "a~b~c");
    },
    "join2 sample": function () {
        const str = join2(['a', 'b', 'c'], '~');
        assert.equal(str, "a~b~c");
    }
});
