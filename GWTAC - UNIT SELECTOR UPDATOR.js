var GW_LIST = global.get("GW_LIST") || {};
var GW_AC_LIST = global.get("GW_AC_LIST") || { "testState": 0, "testList": { "online": {}, "offline": {} } };
var GW_AC_SU = ["", "", "", "", "", "", "", "", "", "", "", "", "", ""];
var GW_AC_REFUNIT = global.get("GW_AC_REFUNIT") || "noUNIT";

var topic = Number(msg.topic);
var payload = msg.payload;

var AC_testState = GW_AC_LIST.testState;

var unitCounter = 0;

var output = [null, null];

var output_Update = {};
var output_status = {};

if (msg.topic === "REF") {
    if (payload === "clear") {
        GW_AC_REFUNIT = "noUNIT";
    } else {
        GW_AC_REFUNIT = payload;
    }

    global.set("GW_AC_REFUNIT", GW_AC_REFUNIT);

    output_Update = {
        "topic": "REFRESH",
        "payload": ""
    };
    output_status.REF = GW_AC_REFUNIT;
    output[0] = output_Update;
    output[1] = output_status;
    return output;
} else if ((payload !== "RESET") || ((payload === "RESET") && (AC_testState === 0))) {
    for (var i = 0; i < 14; i++) {
        var reset = false;

        if (topic === i) {
            if (payload === "clear") {
                reset = true;
            } else {
                GW_AC_SU[i] = payload;
            }
        } else if ((payload === "RESET") && (AC_testState === 0)) {
            reset = true;
        }

        for (var key_GWID in GW_LIST) {
            if (GW_LIST[key_GWID].AC_TestState === i) {
                if ((GW_AC_SU[i] === "") && (!reset)) {
                    GW_AC_SU[i] = key_GWID;
                } else {
                    reset = true;
                }

                if (reset) {
                    if ((GW_LIST[key_GWID].AC_TestState !== "-") || (GW_LIST[key_GWID].AC_testStatus !== "-")) {
                        if ("payload" in output_Update) {
                            output_Update.payload[key_GWID] = "";
                        } else {
                            output_Update.payload = {
                                [key_GWID]: ""
                            };
                        }
                    }

                    GW_LIST[key_GWID].AC_TestState = "-";
                    GW_LIST[key_GWID].AC_testStatus = "-";
                }
            }
        }
    }


    for (var i = 0; i < 14; i++) {
        if (GW_AC_SU[i] !== "") {
            GW_LIST[GW_AC_SU[i]].AC_TestState = unitCounter;

            if (AC_testState === 0) GW_LIST[GW_AC_SU[i]].AC_testStatus = "listed";

            unitCounter++;

            if ("payload" in output_Update) {
                output_Update.payload[GW_AC_SU[i]] = "";
            } else {
                output_Update.payload = {
                    [GW_AC_SU[i]]: ""
                };
            }
        }
    }

    output_status.GW_AC_SU = GW_AC_SU;

    if ("payload" in output_Update) {
        output_Update.topic = "UPDATE";
        output[0] = output_Update;
    } else {
        output[0] = null;
    }

    output[1] = output_status;

    global.set("GW_LIST", GW_LIST);
    global.set("GW_AC_SU", GW_AC_SU);

}

return output;