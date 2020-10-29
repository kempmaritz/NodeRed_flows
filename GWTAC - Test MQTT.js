var UNIT_TEST_ID = global.get("GWID_MQTT_testing") || "noUNIT";
var GW_AC_REFUNIT = global.get("GW_AC_REFUNIT") || "noUNIT";

var GW_AC_LIST = global.get("GW_AC_LIST") || { "testState": 0, "testList": { "online": {}, "offline": {} } };

var AC_testState = GW_AC_LIST.testState;

var testUnit_SET = UNIT_TEST_ID + "/1/SET";
var testUnit_STS = UNIT_TEST_ID + "/1/STS";
var testUnit_A = UNIT_TEST_ID + "/1/A";
var testUnit_a = UNIT_TEST_ID + "/1/a";

var refUnit_SET = GW_AC_REFUNIT + "/1/SET";
var refUnit_STS = GW_AC_REFUNIT + "/1/STS";
var refUnit_A = GW_AC_REFUNIT + "/1/A";

var topic = msg.topic || "";
var payload = msg.payload || "";

var output_1 = null;
var output_2 = null;
var output = [null, null];

if ((topic !== "") && (payload !== "")) {
    if (topic.indexOf(testUnit_SET) === 3) {
        output_1 = {
            "topic": "update",
            "unitData": {
                "payload": UNIT_TEST_ID,
                "SET": payload
            }
        };
    } else if (topic.indexOf(testUnit_STS) === 3) {
        output_1 = {
            "topic": "update",
            "unitData": {
                "payload": UNIT_TEST_ID,
                "STS": payload
            }
        };
    } else if (topic.indexOf(testUnit_A) === 3) {
        output_1 = {
            "topic": "update",
            "unitData": {
                "payload": UNIT_TEST_ID,
                "A": payload
            }
        };
    } else if (topic.indexOf(testUnit_a) === 3) {
        output_1 = {
            "topic": "update",
            "unitData": {
                "payload": UNIT_TEST_ID,
                "a": payload
            }
        };
    }

    if (topic.indexOf(refUnit_SET) === 3) {
        if (output_1 === null) {
            output_1 = {
                "topic": "update",
                "refData": {
                    "payload": GW_AC_REFUNIT,
                    "SET": payload
                }
            };
        } else {
            output_1.refData = {
                "payload": GW_AC_REFUNIT,
                "SET": payload
            };
        }

    } else if (topic.indexOf(refUnit_STS) === 3) {

        if (output_1 === null) {
            output_1 = {
                "topic": "update",
                "refData": {
                    "payload": GW_AC_REFUNIT,
                    "STS": payload
                }
            };
        } else {
            output_1.refData = {
                "payload": GW_AC_REFUNIT,
                "STS": payload
            };
        }
    } else if (topic.indexOf(refUnit_A) === 3) {
        if (output_1 === null) {
            output_1 = {
                "topic": "update",
                "refData": {
                    "payload": GW_AC_REFUNIT,
                    "A": payload
                }
            };
        } else {
            output_1.refData = {
                "payload": GW_AC_REFUNIT,
                "A": payload
            };
        }
    }
}
return output_1;