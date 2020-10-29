var GW_LIST = global.get("GW_LIST") || {};
var GW_AC_LIST = global.get("GW_AC_LIST") || { "testState": 0, "testList": { "online": {}, "offline": {} } };
var GW_AC_SU = global.get("GW_AC_SU") || ["", "", "", "", "", "", "", "", "", "", "", "", "", ""];

var topic = msg.topic || "no topic";
var payload = msg.payload || [];
var output = [null, null, null];

var AC_testState = GW_AC_LIST.testState;

var MQTT_topic = "";
var MQTT_payload = "";

var output;

var output_MQTT = [];
var output_createLog;
var output_update = {};
var output_status = {};

for (var key_Array in GW_AC_SU) {
    var GWID = GW_AC_SU[key_Array];

    if (GWID in GW_LIST) {
        var Unit_TestState = GW_LIST[GWID].AC_TestState;
        var Unit_testStatus = GW_LIST[GWID].AC_testStatus;

        var UNIT_SAVE_name = "GW_TEST_MQTT_" + GWID;

        var UNIT_TEST = global.get(UNIT_SAVE_name) || { "ID": "", "time": "" };
        var UNIT_TEST_time = UNIT_TEST.time;

        var Log_fileName;

        // date processing
        var date = new Date();
        var system_Year = String(date.getFullYear());
        var system_Month = String(date.getMonth() + 1);
        var system_Day = String(date.getDate());
        var system_Hour = String(date.getHours());
        var system_Minute = String(date.getMinutes());
        var system_Second = String(date.getSeconds());

        var date_Comp = system_Year + "/" + system_Month + "/" + system_Day;
        var time_Comp = system_Hour + ":" + system_Minute + ":" + system_Second;

        if (Unit_testStatus === "testing") {
            // log file generation
            Log_fileName = "C:\\GW_TEST_FILES\\GW_LOGS\\" + GWID + "\\" + GWID + "_" + UNIT_TEST_time + "_stopped" + ".csv";

            output_createLog = {
                "filename": Log_fileName,
                "payload": {
                    "date": date_Comp,
                    "time": time_Comp,
                    "Control_ACOverride": "",
                    "Output_ACstate": "",
                    "Output_ACvoltage": "",
                    "Output_ACcurrent": "",
                    "Temp_Geyser": "",
                    "Temp_PCB": "",
                    "Trip_GeyserTempMax": "",
                    "Trip_GeyserTempMin": "",
                    "Trip_DryRun": "",
                    "Trip_Contactor": "",
                    "Trip_PCBtemp": ""
                }
            };

            // output message generation
            GW_LIST[GWID].AC_testStatus = "stopped";
            global.set("GW_LIST", GW_LIST);

            global.set("GWID_MQTT_testing", "noUNIT");

            if ("payload" in output_update) {
                output_update.payload[GWID] = "";
            } else {
                output_update.payload = {
                    [GWID]: ""
                };
            }

            MQTT_topic = "GWR/" + GWID + "/1/SET";
            MQTT_payload = {
                "O": { "ACO": 0 }
            };

            output_MQTT.push({
                "topic": MQTT_topic,
                "payload": MQTT_payload
            });
            break;
        }
    }
}

if ("payload" in output_update) output_update.topic = "UPDATE";
else output_update = null;

output = [
    output_MQTT,
    output_createLog,
    output_update,
    output_status
];

return output;