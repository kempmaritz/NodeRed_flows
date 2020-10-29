var GW_LIST = global.get("GW_LIST") || {};
var GW_AC_LIST = global.get("GW_AC_LIST") || { "testState": 0, "testList": { "online": {}, "offline": {} } };
var GW_AC_SU = global.get("GW_AC_SU") || ["", "", "", "", "", "", "", "", "", "", "", "", "", ""];

var payload = msg.payload;

var AC_testState = GW_AC_LIST.testState;

var output = [];

var output_Run;
var output_Stop;
var output_Update = {};
var output_Status = {};

if (!((payload === "RESET") && (AC_testState === 0))) {
    output_Status.GW_AC_SU = GW_AC_SU;

    if (payload === "START") {
        AC_testState = 1;
    } else if (payload === "STOP") {
        AC_testState = 2;
    } else if (payload === "RESET") {
        AC_testState = 0;
    }

    for (var key_Array in GW_AC_SU) {
        var GWID = GW_AC_SU[key_Array];

        if (GWID !== "") {
            if (GWID in GW_LIST) {
                var GWID_TestState = GW_LIST[GWID].AC_TestState;
                var GWID_testStatus = GW_LIST[GWID].AC_testStatus;

                if (AC_testState === 1) {
                    GW_LIST[GWID].AC_testStatus = "queued";

                    if ("payload" in output_Update) {
                        output_Update.payload[GWID] = "";
                    } else {
                        output_Update.payload = {
                            [GWID]: ""
                        };
                    }
                } else if (AC_testState === 2) {
                    global.set("GWID_MQTT_testing", "noUNIT");

                    if ((GWID_testStatus === "queued")) {
                        GW_LIST[GWID].AC_testStatus = "removed from queue";
                    } else if ((GWID_testStatus === "error_CS")) {
                        GW_LIST[GWID].AC_testStatus = "FAIL_CS";
                    }

                    if ("payload" in output_Update) {
                        output_Update.payload[GWID] = "";
                    } else {
                        output_Update.payload = {
                            [GWID]: ""
                        };
                    }
                } else if (AC_testState === 0) {
                    if ((GWID_testStatus === "stopped") || (GWID_testStatus === "removed from queued") || (GWID_testStatus === "FAIL_CS") || (GWID_testStatus === "FAIL_TIME") || (GWID_testStatus === "Fail")) {
                        GW_LIST[GWID].AC_testStatus = "listed";
                    } else if (GWID_testStatus === "Pass") {
                        GW_LIST[GWID].AC_TestState = "Pass";
                    } else {
                        GW_LIST[GWID].AC_TestState = "-";
                        GW_LIST[GWID].AC_testStatus = "-";
                    }

                    if ("payload" in output_Update) {
                        output_Update.payload[GWID] = "";
                    } else {
                        output_Update.payload = {
                            [GWID]: ""
                        };
                    }
                }
            }
        }
    }

    if (AC_testState === 1) output_Run = { "topic": "run" };
    if (AC_testState === 2) output_Stop = { "topic": "stop" };

    GW_AC_LIST.testState = AC_testState;

    global.set("GW_AC_LIST", GW_AC_LIST);
    global.set("GW_LIST", GW_LIST);
}

if ("payload" in output_Update) {
    output_Update.topic = "UPDATE";
} else {
    output_Update = null;
}

output = [
    output_Run,
    output_Stop,
    output_Update,
    output_Status
];

return output;