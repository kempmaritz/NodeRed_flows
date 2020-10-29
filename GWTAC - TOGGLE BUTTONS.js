var GW_AC_LIST = global.get("GW_AC_LIST") || { "testState": 0, "testList": { "online": {}, "offline": {} } };

var AC_testState = GW_AC_LIST.testState;
var unitSelect_online = 0;
var unitSelect_offline = 0;

var output_status = {};

var output_Start = { "enabled": false };
var output_Stop = { "enabled": false };
var output_Reset = { "enabled": false };

var key_GWID_value = GW_AC_LIST.testList.online[key_GWID];

for (var key_GWID in GW_AC_LIST.testList.online) {
    key_GWID_value = GW_AC_LIST.testList.online[key_GWID];

    if ((key_GWID_value === "listed")) unitSelect_online++;
}

for (var key_GWID in GW_AC_LIST.testList.offline) {
    key_GWID_value = GW_AC_LIST.testList.offline[key_GWID];

    if ((key_GWID_value === "listed")) unitSelect_offline++;
}

output_status.unitSelect_online = unitSelect_online;
output_status.unitSelect_offline = unitSelect_offline;

if (AC_testState === 0) {
    output_status.AC_testState = 0;

    if (unitSelect_online > 0) {
        output_status.option = 0;

        output_Start.enabled = true;
        output_Stop.enabled = false;
        output_Reset.enabled = true;
    } else if (unitSelect_offline > 0) {
        output_status.option = 1;

        output_Start.enabled = false;
        output_Stop.enabled = false;
        output_Reset.enabled = true;
    } else {
        output_status.option = 2;

        output_Start.enabled = false;
        output_Stop.enabled = false;
        output_Reset.enabled = false;
    }
} else if (AC_testState === 1) {
    output_status.AC_testState = 1;

    output_Start.enabled = false;
    output_Stop.enabled = true;
    output_Reset.enabled = false;
} else if (AC_testState === 2) {
    output_status.AC_testState = 2;

    output_Start.enabled = false;
    output_Stop.enabled = false;
    output_Reset.enabled = true;
}

var output = [
    output_Start,
    output_Stop,
    output_Reset,
    output_status
];

return output;