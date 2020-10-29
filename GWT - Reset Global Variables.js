var topic = msg.topic;
var payload = msg.payload;

if (topic === "Reset") {
    if (payload === "GW_LIST") {
        global.set("GW_LIST", {});
        msg.reset = "GW_LIST";
    } else if (payload === "GW_LIST_file") {
        global.set("GW_LIST_file", {});
        msg.reset = "GW_LIST_file";
    } else if (payload === "GW_AC_LIST") {
        global.set("GW_AC_LIST", { "testState": 0, "testList": { "online": {}, "offline": {} } });
        msg.reset = "GW_AC_LIST";
    } else if (payload === "GW_AC_SU") {
        global.set("GW_AC_SU", ["", "", "", "", "", "", "", "", "", ""]);
        msg.reset = "GW_AC_SU";
    }
}

return msg;