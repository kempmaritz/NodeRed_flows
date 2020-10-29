var GW_LIST_js = global.get("GW_LIST") || {};
var GW_LIST_csv = global.get("GW_LIST_file") || {};

var topic = msg.topic;
var payload = msg.payload;

var output_temp = [];

var output_1 = {};
var output_2 = {};
var output_3 = {};

if (topic === "STARTUP") {
    output_3.GW_LIST_S = 1;

    GW_LIST_csv = {};

    for (var key_Array in payload) {
        var ID = payload[key_Array].ID;
        var CW_S = payload[key_Array].CW_S;
        var CW_I = payload[key_Array].CW_I;
        var AC_TestState = payload[key_Array].AC_TestState;
        var AC_testStatus = payload[key_Array].AC_testStatus;
        var PV_TestState = payload[key_Array].PV_TestState;
        var PV_testStatus = payload[key_Array].PV_testStatus;
        var ERROR = payload[key_Array].ERROR;

        GW_LIST_csv[ID] = {
            "CW": {
                "S": CW_S,
                "I": CW_I
            },
            "AC_TestState": AC_TestState,
            "AC_testStatus": AC_testStatus,
            "PV_TestState": PV_TestState,
            "PV_testStatus": PV_testStatus,
            "ERROR": ERROR
        };
    }

    for (var key_ID in GW_LIST_csv) {
        output_temp = [
            key_ID,
            GW_LIST_csv[key_ID].CW.S,
            GW_LIST_csv[key_ID].CW.I,
            GW_LIST_csv[key_ID].AC_TestState,
            GW_LIST_csv[key_ID].AC_testStatus,
            GW_LIST_csv[key_ID].PV_TestState,
            GW_LIST_csv[key_ID].PV_testStatus,
            GW_LIST_csv[key_ID].ERROR
        ];

        if ("payload" in output_2) {
            output_2.payload.push(output_temp);
        } else {
            output_2.payload = [output_temp];
        }
    }

    GW_LIST_js = GW_LIST_csv;
    global.set("GW_LIST", GW_LIST_js);
} else if (topic === "UPDATE") {
    output_3.GW_LIST_U = 1;

    for (var key_ID in GW_LIST_csv) {
        if (key_ID in payload) {
            GW_LIST_csv[key_ID] = GW_LIST_js[key_ID];
        }

        output_temp = [
            key_ID,
            GW_LIST_csv[key_ID].CW.S,
            GW_LIST_csv[key_ID].CW.I,
            GW_LIST_csv[key_ID].AC_TestState,
            GW_LIST_csv[key_ID].AC_testStatus,
            GW_LIST_csv[key_ID].PV_TestState,
            GW_LIST_csv[key_ID].PV_testStatus,
            GW_LIST_csv[key_ID].ERROR
        ];

        if ("payload" in output_2) {
            output_2.payload.push(output_temp);
        } else {
            output_2.payload = [output_temp];
        }
    }
} else if (topic === "ADD") {
    output_3.GW_LIST_A = 1;

    for (var key_ID in GW_LIST_js) {
        if ((!(key_ID in GW_LIST_csv)) && (key_ID !== "_msgid")) {
            GW_LIST_csv[key_ID] = GW_LIST_js[key_ID];

            output_temp = [
                key_ID,
                GW_LIST_csv[key_ID].CW.S,
                GW_LIST_csv[key_ID].CW.I,
                GW_LIST_csv[key_ID].AC_TestState,
                GW_LIST_csv[key_ID].AC_testStatus,
                GW_LIST_csv[key_ID].PV_TestState,
                GW_LIST_csv[key_ID].PV_testStatus,
                GW_LIST_csv[key_ID].ERROR
            ];

            if ("payload" in output_1) {
                output_1.payload.push(output_temp);
            } else {
                output_1.payload = [output_temp];
            }
        }
    }
} else if (topic === "REFRESH") output_3.GW_LIST_R = 1;

var output = [null, null, output_3];

if ("payload" in output_1) output[0] = output_1;

if ("payload" in output_2) output[1] = output_2;

global.set("GW_LIST_file", GW_LIST_csv);

return output;