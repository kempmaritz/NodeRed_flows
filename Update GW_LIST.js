var GW_LIST = global.get("GW_LIST") || {};

var topic = msg.topic;
var payload = msg.payload;

var output = {};

var index_1 = topic.indexOf("/");
var index_2 = topic.indexOf("/", index_1 + 1);

var GW_ID = topic.slice(index_1 + 1, index_2);

if (GW_ID in GW_LIST) {
    GW_LIST[GW_ID].CW = payload;

    output = {
        "topic": "UPDATE",
        "payload": {
            [GW_ID]: ""
        }
    };
} else {
    GW_LIST[GW_ID] = {
        "CW": payload,
        "AC_TestState": "unknown",
        "AC_testStatus": "unknown",
        "PV_TestState": "unknown",
        "PV_testStatus": "unknown",
        "ERROR": 0
    };

    output = {
        "topic": "ADD",
        "payload": {
            [GW_ID]: ""
        }
    };
}

global.set("GW_LIST", GW_LIST);

return output;