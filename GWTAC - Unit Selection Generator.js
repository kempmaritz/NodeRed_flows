var GW_LIST = global.get("GW_LIST") || {};
var GW_AC_LIST = global.get("GW_AC_LIST") || { "testState": 0, "testList": { "online": {}, "offline": {} } };
var GW_AC_REFUNIT = global.get("GW_AC_REFUNIT") || "noUNIT";
var GW_AC_REFUNIT_2 = global.get("GW_AC_REFUNIT_2") || "noUNIT";
var GW_AC_GEYSERS = global.get("GW_AC_GEYSERS") || 1;

var AC_testState = GW_AC_LIST.testState;
var count_Online = Object.keys(GW_AC_LIST.testList.online).length;
var count_Offline = Object.keys(GW_AC_LIST.testList.offline).length;

var counter_ref = 0;
var counter_out = 0;
var counter_object = 0;

var counter_objSel = 0;

var refObject = {
    "options": [{ "gw5E5CCF7FB0E66F - TestUnit": "gw5E5CCF7FB0E66F" }],
    "payload": "REF"
};

var refObject_2 = {
    "options": [{ "gw5E5CCF7FB0E66F - TestUnit": "gw5E5CCF7FB0E66F" }],
    "payload": "REF2"
};

var outObject = {
    "options": [{ "unavailable": "*" }],
    "payload": "*"
};
var outList;

var output = [];

if (AC_testState === 0) {
    if (count_Online > 0) {
        for (var key_GWID in GW_AC_LIST.testList.online) {
            var key_GWID_value = GW_AC_LIST.testList.online[key_GWID];

            if ((key_GWID_value !== "listed") && (key_GWID_value !== "queued") && (key_GWID_value !== "stopped") && (key_GWID_value !== "testing")) {
                var label = key_GWID + " - " + key_GWID_value;
                var value = key_GWID;

                refObject.options.push({
                    [label]: value });

                if (counter_out === 0) {
                    outObject = {
                        "options": [{
                            [label]: value }],
                        "payload": ""
                    };
                } else {
                    outObject.options.push({
                        [label]: value });
                }

                counter_out++;
            }
        }
    }

    outList = outObject;

    // reference object
    if (GW_AC_REFUNIT in GW_AC_LIST.testList.online) {
        var label = GW_AC_REFUNIT + " - online";
        var value = GW_AC_REFUNIT;

        refObject = {
            "options": [{
                [label]: value }],
            "payload": value
        };
    }

    if (GW_AC_REFUNIT in GW_AC_LIST.testList.offline) {
        var label = GW_AC_REFUNIT + " - offline";
        var value = GW_AC_REFUNIT;

        refObject = {
            "options": [{
                [label]: value }],
            "payload": value
        };
    }

    if (refObject.payload !== "REF") {
        refObject.options.push("clear");
    }

    output[14] = [{
            "options": [],
            "payload": "@"
        },
        refObject
    ];

    // reference object 2
    if (GW_AC_REFUNIT_2 in GW_AC_LIST.testList.online) {
        var label = GW_AC_REFUNIT_2 + " - online";
        var value = GW_AC_REFUNIT_2;

        refObject_2 = {
            "options": [{
                [label]: value }],
            "payload": value
        };
    }

    if (GW_AC_REFUNIT_2 in GW_AC_LIST.testList.offline) {
        var label = GW_AC_REFUNIT_2 + " - offline";
        var value = GW_AC_REFUNIT_2;

        refObject_2 = {
            "options": [{
                [label]: value }],
            "payload": value
        };
    }

    if (refObject_2.payload !== "REF2") {
        refObject_2.options.push("clear");
    }

    output[15] = [{
            "options": [],
            "payload": "@"
        },
        refObject_2
    ];

    for (counter_object = 0; counter_object < 14; counter_object++) {
        outObject = {
            "options": [{ "unavailable": "*" }],
            "payload": "*"
        };

        for (var key_GWID in GW_AC_LIST.testList.online) {
            if ((GW_LIST[key_GWID].AC_TestState === counter_object)) {
                var label = key_GWID + " - online";
                var value = key_GWID;

                outObject = {
                    "options": [{
                        [label]: value }],
                    "payload": value
                };
            }
        }

        for (var key_GWID in GW_AC_LIST.testList.offline) {
            if ((GW_LIST[key_GWID].AC_TestState === counter_object)) {
                var label = key_GWID + " - offline";
                var value = key_GWID;

                outObject = {
                    "options": [{
                        [label]: value }],
                    "payload": value
                };
            }
        }

        if (outObject.payload === "*") {
            outObject = outList;
            if (counter_object === 0) {
                outObject.options.push({ "gw5E5CCF7FB0E66F - TestUnit": "gw5E5CCF7FB0E66F" });
            }
        } else {
            outObject.options.push("clear");
        }

        output[counter_object] = [{
                "options": [],
                "payload": "@"
            },
            outObject
        ];
    }
} else if ((AC_testState === 1) || (AC_testState === 2)) {
    // reference object
    if (GW_AC_REFUNIT in GW_AC_LIST.testList.online) {
        var label = GW_AC_REFUNIT + " - online";
        var value = GW_AC_REFUNIT;

        refObject = {
            "options": [{
                [label]: value }],
            "payload": value
        };
    }

    if (GW_AC_REFUNIT in GW_AC_LIST.testList.offline) {
        var label = GW_AC_REFUNIT + " - offline";
        var value = GW_AC_REFUNIT;

        refObject = {
            "options": [{
                [label]: value }],
            "payload": value
        };
    }

    output[14] = [{
            "options": [],
            "payload": "@"
        },
        refObject
    ];

    for (counter_object = 0; counter_object < 14; counter_object++) {
        outObject = {
            "options": ["-"],
            "payload": "-"
        };

        for (var key_GWID in GW_LIST) {
            if (GW_LIST[key_GWID].AC_TestState === counter_object) {
                var label = key_GWID + " - " + GW_LIST[key_GWID].AC_testStatus;
                var value = key_GWID;

                outObject = {
                    "options": [{
                        [label]: value }],
                    "payload": value
                };
            }
        }

        output[counter_object] = [{
                "options": [],
                "payload": "@"
            },
            outObject
        ];
    }
}


output[16] = [{
        "options": [],
        "payload": "@"
    },
    {
        "options": [{
            ["Geyser Outputs: 1"]: 1 }, {
            ["Geyser Outputs: 2"]: 2 }],
        "payload": GW_AC_GEYSERS
    }
];

output[17] = {
    "topic": "refreshed",
    "AC_testState": AC_testState,
    "count_Online": count_Online,
    "count_Offline": count_Offline,
    "outList": outList
};

return output;