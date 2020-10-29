var UNIT_TEST_ID = global.get("GWID_MQTT_testing") || "noUNIT";
var GW_AC_REFUNIT = global.get("GW_AC_REFUNIT") || "noUNIT";

var output = null;

var output_unit_Temp_Geyser = null;
var output_unit_Temp_Heatsink = null;
var output_unit_I_AC = null;
var output_unit_I_PV = null;
var output_unit_P_AC = null;
var output_unit_P_PV = null;

var output_ref_Temp_Geyser = null;
var output_ref_Temp_Heatsink = null;
var output_ref_I_AC = null;
var output_ref_I_PV = null;

var output_time_running = null;
var output_time_remaining = null;

var data;

if ("unitData" in msg) {
    data = msg.unitData;

    if ("A" in data) {
        if ("T" in data.A) {
            output_unit_Temp_Geyser = {
                "topic": "Temp: unit sensor(°C)",
                "payload": data.A.T.G
            };
            output_unit_Temp_Heatsink = {
                "topic": "Temp: unit heatsink(°C)",
                "payload": data.A.T.PCB
            };
        }

        if ("I" in data.A) {
            output_unit_I_AC = {
                "topic": "Current: unit AC(A)",
                "payload": data.A.I.AC
            };
            output_unit_I_PV = {
                "topic": "Current: unit PV(A)",
                "payload": data.A.I.PV
            };
        }
    } else if ("a" in data) {
        if ("I" in data.a) {
            output_unit_P_AC = {
                "topic": "Power: unit AC(Wh)",
                "payload": (data.a.I.AC) * (230 * 230 / 3000)
            };
            output_unit_P_PV = {
                "topic": "Power: unit PV(Wh)",
                "payload": (data.a.I.PV) * (230 * 230 / 3000)
            };
        }
    }
} else if (UNIT_TEST_ID === "noUNIT") {
    output_unit_Temp_Geyser = {
        "topic": "Temp: unit sensor(°C)",
        "payload": 0
    };
    output_unit_Temp_Heatsink = {
        "topic": "Temp: unit heatsink(°C)",
        "payload": 0
    };
    output_unit_I_AC = {
        "topic": "Current: unit AC(A)",
        "payload": 0
    };
    output_unit_I_PV = {
        "topic": "Current: unit PV(A)",
        "payload": 0
    };
    output_unit_P_AC = {
        "topic": "Power: unit AC(Wh)",
        "payload": 0
    };
    output_unit_P_PV = {
        "topic": "Power: unit PV(Wh)",
        "payload": 0
    };
}

if ("refData" in msg) {
    data = msg.refData;

    if ("A" in data) {
        if ("T" in data.A) {
            output_ref_Temp_Geyser = {
                "topic": "Temp: Geyser(°C)",
                "payload": data.A.T.G
            };
            output_ref_Temp_Heatsink = {
                "topic": "Temp: ref heatsink(°C)",
                "payload": data.A.T.PCB
            };
        }

        if ("I" in data.A) {
            output_ref_I_AC = {
                "topic": "Current: ref AC(A)",
                "payload": data.A.I.AC
            };
            output_ref_I_PV = {
                "topic": "Current: ref PV(A)",
                "payload": data.A.I.PV
            };
        }
    }
} else if (GW_AC_REFUNIT === "noUNIT") {
    output_ref_Temp_Geyser = {
        "topic": "Temp: Geyser(°C)",
        "payload": 0
    };
    output_ref_Temp_Heatsink = {
        "topic": "Temp: ref heatsink(°C)",
        "payload": 0
    };
    output_ref_I_AC = {
        "topic": "Current: ref AC(A)",
        "payload": 0
    };
    output_ref_I_PV = {
        "topic": "Current: ref PV(A)",
        "payload": 0
    };
}

if ("time_lapsed" in msg) {
    output_time_running = { "payload": msg.time_lapsed };
}

if ("testTime_remaining" in msg) {
    output_time_remaining = { "payload": msg.testTime_remaining };
}

output = [
    output_unit_Temp_Geyser,
    output_unit_Temp_Heatsink,
    output_unit_I_AC,
    output_unit_I_PV,
    output_unit_P_AC,
    output_unit_P_PV,
    output_ref_Temp_Geyser,
    output_ref_Temp_Heatsink,
    output_ref_I_AC,
    output_ref_I_PV,
    output_time_running,
    output_time_remaining
];

return output;