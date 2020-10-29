var GW_LIST = global.get("GW_LIST") || {};
var GW_AC_LIST = global.get("GW_AC_LIST") || { "testState": 0, "testList": { "online": {}, "offline": {} } };

for (var key_GWID in GW_LIST) {
    if ((GW_LIST[key_GWID].AC_testStatus !== "Pass")) {
        if ((GW_LIST[key_GWID].CW.S === 1) && (GW_LIST[key_GWID].CW.I === 1)) {
            GW_AC_LIST.testList.online[key_GWID] = GW_LIST[key_GWID].AC_testStatus;

            if (key_GWID in GW_AC_LIST.testList.offline) {
                delete GW_AC_LIST.testList.offline[key_GWID];
            }
        } else {
            GW_AC_LIST.testList.offline[key_GWID] = GW_LIST[key_GWID].AC_testStatus;

            if (key_GWID in GW_AC_LIST.testList.online) {
                delete GW_AC_LIST.testList.online[key_GWID];
            }
        }
    } else {
        if (key_GWID in GW_AC_LIST.testList.offline) {
            delete GW_AC_LIST.testList.offline[key_GWID];
        }

        if (key_GWID in GW_AC_LIST.testList.online) {
            delete GW_AC_LIST.testList.online[key_GWID];
        }
    }
}

global.set("GW_AC_LIST", GW_AC_LIST);

output = {
    "GW_AC_LIST": GW_AC_LIST
};

return output;