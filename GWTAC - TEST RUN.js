var GW_LIST = global.get("GW_LIST") || {};
var GW_AC_LIST = global.get("GW_AC_LIST") || { "testState": 0, "testList": { "online": {}, "offline": {} } };
var GW_AC_SU = global.get("GW_AC_SU") || ["", "", "", "", "", "", "", "", "", "", "", "", "", ""];
var GW_AC_REFUNIT = global.get("GW_AC_REFUNIT") || "noUNIT";
var UNIT_TEST_ID = global.get("GWID_MQTT_testing") || "noUNIT";

var GW_AC_IECounter = context.get("GW_AC_IECounter") || 0;

var AC_testState = GW_AC_LIST.testState;

var testTime_remaining = 0;

var topic = msg.topic || "no topic";
//var payload				= msg.payload||{};
var unitData = msg.unitData || { "noDATA": 0 };
var refData = msg.refData || { "noDATA": 0 };
var GW_AC_UNIT = "noUNIT";

var output;

var output_MQTT = [];
var output_createLog;
var output_updateLog;
var output_updateGWFU = {};
var output_updateGWTC;
var output_status = {};

var MQTT_topic = "";
var MQTT_payload = "";

var active_unit = false;

if (AC_testState === 1) {
    if (!("noDATA" in unitData)) {
        GW_AC_UNIT = unitData.payload;
    } else if (!("noDATA" in refData)) {
        GW_AC_UNIT = refData.payload;
    }

    // date processing
    var date = new Date();

    var system_Year = String(date.getFullYear());
    while (system_Year.length < 4) system_Year = "0" + system_Year;

    var system_Month = String(date.getMonth() + 1);
    while (system_Month.length < 2) system_Month = "0" + system_Month;

    var system_Day = String(date.getDate());
    while (system_Day.length < 2) system_Day = "0" + system_Day;

    var system_Hour = String(date.getHours());
    while (system_Hour.length < 2) system_Hour = "0" + system_Hour;

    var system_Minute = String(date.getMinutes());
    while (system_Minute.length < 2) system_Minute = "0" + system_Minute;

    var system_Second = String(date.getSeconds());
    while (system_Second.length < 2) system_Second = "0" + system_Second;

    for (var key_Array in GW_AC_SU) {
        var GWID = GW_AC_SU[key_Array];

        if (GWID in GW_LIST) {
            var Unit_TestState = GW_LIST[GWID].AC_TestState;
            var Unit_testStatus = GW_LIST[GWID].AC_testStatus;

            if ((Unit_testStatus === "testing") || (Unit_testStatus === "error_CS") || (Unit_testStatus === "queued")) {
                active_unit = true;

                var GWID_MQTT = "GW_TEST_MQTT_" + GWID;

                var UNIT_TEST = global.get(GWID_MQTT) || { "ID": "", "time": "" };
                var UNIT_TEST_time = UNIT_TEST.time;

                var Log_fileName;

                var time_lapsed = (((Number(system_Day) - Number(UNIT_TEST_time.slice(6, 8))) * 24 + Number(system_Hour) - Number(UNIT_TEST_time.slice(9, 11))) * 60) + Number(system_Minute) - Number(UNIT_TEST_time.slice(11, 13));

                if (!("noDATA" in unitData)) {
                    output_status.time_lapsed = time_lapsed;
                    testTime_remaining = 60 - time_lapsed;
                    output_status.testTime_remaining = testTime_remaining;
                }

                if ((topic === "update") && (Unit_testStatus !== "queued") && (((!("noDATA" in unitData)) && (GW_AC_UNIT === GWID)) || ((!("noDATA" in refData)) && (UNIT_TEST_ID === GWID)))) {
                    var pass = false;
                    var fail = false;
                    var OSR = false;

                    // log file generation
                    Log_fileName = "C:\\GW_TEST_FILES\\GW_LOGS\\" + GWID + "\\" + GWID + "_" + UNIT_TEST_time + ".csv";

                    var date_Comp = system_Year + "/" + system_Month + "/" + system_Day;
                    var time_Comp = system_Hour + ":" + system_Minute + ":" + system_Second;

                    output_updateLog = {
                        "filename": Log_fileName,
                        "payload": {
                            "date": date_Comp,
                            "time": time_Comp,
                            "testTime_remaining": testTime_remaining,
                            "Control_ACOverride": "",
                            "Output_ACstate": "",
                            "Output_ACvoltage": "",
                            "Output_ACcurrent": "",
                            "Temp_Geyser": "",
                            "Temp_PCB": "",
                            "Temp_Sensor": "",
                            "Trip_GeyserTempMax": "",
                            "Trip_GeyserTempMin": "",
                            "Trip_DryRun": "",
                            "Trip_Contactor": "",
                            "Trip_PCBtemp": ""
                        }
                    };

                    if (!("noDATA" in unitData)) {
                        if ("SET" in unitData) {
                            if ("O" in unitData.SET) {
                                output_updateLog.payload.Control_ACOverride = unitData.SET.O.ACO;
                                OSR = true;

                                if (unitData.SET.O.ACO === 0) {
                                    if ((time_lapsed > 55)) {
                                        pass = true;
                                    } else if ((time_lapsed < 56)) {
                                        fail = true;
                                    }
                                }
                            }
                        }

                        if ((time_lapsed > 64)) {
                            fail = true;
                        }

                        if ("STS" in unitData) {
                            if ("O" in unitData.STS) {
                                output_updateLog.payload.Output_ACstate = unitData.STS.O.AC;
                            }

                            if ("A" in unitData.STS) {
                                output_updateLog.payload.Trip_GeyserTempMax = unitData.STS.A.Tr_Th;
                                output_updateLog.payload.Trip_GeyserTempMin = unitData.STS.A.Tr_Te;
                                output_updateLog.payload.Trip_DryRun = unitData.STS.A.Tr_DR;
                                output_updateLog.payload.Trip_Contactor = unitData.STS.A.Tr_CS;
                                output_updateLog.payload.Trip_PCBtemp = unitData.STS.A.Tr_PCB;

                                if ((unitData.STS.A.Tr_Th === 1) || (unitData.STS.A.Tr_Te === 1) || (unitData.STS.A.Tr_DR === 1) || (unitData.STS.A.Tr_CS === 1) || (unitData.STS.A.Tr_PCB === 1)) {
                                    fail = true;
                                }
                            }
                        }

                        if ("A" in unitData) {
                            if ("V" in unitData.A) {
                                output_updateLog.payload.Output_ACvoltage = unitData.A.V.AC;
                            }

                            if ("I" in unitData.A) {
                                output_updateLog.payload.Output_ACcurrent = unitData.A.I.AC;

                                if ((time_lapsed > 5) && (time_lapsed < 55) && (unitData.A.I.AC < 8)) {
                                    GW_AC_IECounter++;
                                    if (GW_AC_IECounter > 5) {
                                        fail = true;
                                    }
                                    context.set("GW_AC_IECounter", GW_AC_IECounter);
                                }
                            }

                            if ("T" in unitData.A) {
                                output_updateLog.payload.Temp_Sensor = unitData.A.T.G;
                                output_updateLog.payload.Temp_PCB = unitData.A.T.PCB;

                                if (unitData.A.T.PCB > 80) {
                                    fail = true;
                                }
                            }
                        }
                    }

                    if (!("noDATA" in refData)) {
                        if ("A" in refData) {
                            if ("T" in refData.A) {
                                output_updateLog.payload.Temp_Geyser = refData.A.T.G;

                                if (refData.A.T.G > 70) {
                                    fail = true;
                                }
                            }
                        }
                    }


                    // test state
                    if (Unit_testStatus === "testing") {
                        if (fail === true) {
                            MQTT_topic = "GWR/" + GWID + "/1/SET";
                            MQTT_payload = {
                                "O": { "ACO": 0 }
                            };

                            output_MQTT.push({
                                "topic": MQTT_topic,
                                "payload": MQTT_payload
                            });

                            Log_fileName = "C:\\GW_TEST_FILES\\GW_LOGS\\" + GWID + "\\" + GWID + "_" + UNIT_TEST_time + "_FAIL.csv";

                            output_createLog = output_updateLog;
                            output_createLog.filename = Log_fileName;

                            global.set("GWID_MQTT_testing", "noUNIT");

                            GW_LIST[GWID].AC_testStatus = "Fail";
                            global.set("GW_LIST", GW_LIST);

                            if ("payload" in output_updateGWFU) {
                                output_updateGWFU.payload[GWID] = "";
                            } else {
                                output_updateGWFU.payload = {
                                    [GWID]: ""
                                };
                            }
                        } else if (pass === true) {
                            Log_fileName = "C:\\GW_TEST_FILES\\GW_LOGS\\" + GWID + "\\" + GWID + "_" + UNIT_TEST_time + "_PASS.csv";

                            output_createLog = output_updateLog;
                            output_createLog.filename = Log_fileName;

                            global.set("GWID_MQTT_testing", "noUNIT");

                            GW_LIST[GWID].AC_testStatus = "Pass";
                            global.set("GW_LIST", GW_LIST);

                            if ("payload" in output_updateGWFU) {
                                output_updateGWFU.payload[GWID] = "";
                            } else {
                                output_updateGWFU.payload = {
                                    [GWID]: ""
                                };
                            }
                        }
                    } else if ((Unit_testStatus === "error_CS") && (pass || fail)) {
                        Log_fileName = "C:\\GW_TEST_FILES\\GW_LOGS\\" + GWID + "\\" + GWID + "_" + UNIT_TEST_time + "_FAIL-CS.csv";

                        output_createLog = output_updateLog;
                        output_createLog.filename = Log_fileName;

                        global.set("GWID_MQTT_testing", "noUNIT");

                        GW_LIST[GWID].AC_testStatus = "FAIL_CS";
                        global.set("GW_LIST", GW_LIST);

                        if ("payload" in output_updateGWFU) {
                            output_updateGWFU.payload[GWID] = "";
                        } else {
                            output_updateGWFU.payload = {
                                [GWID]: ""
                            };
                        }
                    }

                    break;
                } else if ((topic === "run") && (AC_testState === 1)) {
                    if ((Unit_testStatus === "testing") && (GWID in GW_AC_LIST.testList.online)) {
                        if ((time_lapsed > 61)) {
                            global.set("GWID_MQTT_testing", "noUNIT");

                            GW_LIST[GWID].AC_testStatus = "FAIL_TIME";
                            global.set("GW_LIST", GW_LIST);

                            if ("payload" in output_updateGWFU) {
                                output_updateGWFU.payload[GWID] = "";
                            } else {
                                output_updateGWFU.payload = {
                                    [GWID]: ""
                                };
                            }

                            Log_fileName = "C:\\GW_TEST_FILES\\GW_LOGS\\" + GWID + "\\" + GWID + "_" + UNIT_TEST_time + "_FAIL-TIME.csv";

                            var date_Comp = system_Year + "/" + system_Month + "/" + system_Day;
                            var time_Comp = system_Hour + ":" + system_Minute + ":" + system_Second;

                            output_createLog = {
                                "filename": Log_fileName,
                                "payload": {
                                    "date": date_Comp,
                                    "time": time_Comp,
                                    "testTime_remaining": testTime_remaining,

                                    "Control_ACOverride": "",

                                    "Output_ACstate": "",
                                    "Output_ACvoltage": "",
                                    "Output_ACcurrent": "",

                                    "Temp_Geyser": "",
                                    "Temp_PCB": "",
                                    "Temp_Sensor": "",

                                    "Trip_GeyserTempMax": "",
                                    "Trip_GeyserTempMin": "",
                                    "Trip_DryRun": "",
                                    "Trip_Contactor": "",
                                    "Trip_PCBtemp": ""
                                }
                            };
                        } else {
                            MQTT_payload = "";

                            MQTT_topic = "GWA/" + GWID + "/1/SET/O/ACO";

                            output_MQTT.push({
                                "topic": MQTT_topic,
                                "payload": MQTT_payload
                            });

                            MQTT_topic = "GWA/" + GWID + "/1/STS";

                            output_MQTT.push({
                                "topic": MQTT_topic,
                                "payload": MQTT_payload
                            });

                            MQTT_topic = "GWA/" + GWID + "/1/A";

                            output_MQTT.push({
                                "topic": MQTT_topic,
                                "payload": MQTT_payload
                            });

                            MQTT_topic = "GWA/" + GWID + "/1/a";

                            output_MQTT.push({
                                "topic": MQTT_topic,
                                "payload": MQTT_payload
                            });

                            MQTT_topic = "GWA/" + GW_AC_REFUNIT + "/1/A/T";

                            output_MQTT.push({
                                "topic": MQTT_topic,
                                "payload": MQTT_payload
                            });
                        }

                        break;
                    } else if ((Unit_testStatus === "testing") && (GWID in GW_AC_LIST.testList.offline)) {
                        GW_LIST[GWID].AC_testStatus = "error_CS";
                        global.set("GW_LIST", GW_LIST);

                        if ("payload" in output_updateGWFU) {
                            output_updateGWFU.payload[GWID] = "";
                        } else {
                            output_updateGWFU.payload = {
                                [GWID]: ""
                            };
                        }

                        // date processing
                        UNIT_TEST_time = system_Year + system_Month + system_Day + '-' + system_Hour + system_Minute + system_Second;
                        Log_fileName = "C:\\GW_TEST_FILES\\GW_LOGS\\" + GWID + "\\" + GWID + "_" + UNIT_TEST_time + "_ERROR-CS.csv";

                        var date_Comp = system_Year + "/" + system_Month + "/" + system_Day;
                        var time_Comp = system_Hour + ":" + system_Minute + ":" + system_Second;

                        output_createLog = {
                            "filename": Log_fileName,
                            "payload": {
                                "date": date_Comp,
                                "time": time_Comp,
                                "testTime_remaining": testTime_remaining,
                                "Control_ACOverride": "",
                                "Output_ACstate": "",
                                "Output_ACvoltage": "",
                                "Output_ACcurrent": "",
                                "Temp_Geyser": "",
                                "Temp_PCB": "",
                                "Temp_Sensor": "",
                                "Trip_GeyserTempMax": "",
                                "Trip_GeyserTempMin": "",
                                "Trip_DryRun": "",
                                "Trip_Contactor": "",
                                "Trip_PCBtemp": ""
                            }
                        };

                        output_status.error_CS = "ERROR: Disconnected during testing";

                        // stop for loop
                        break;
                    } else if ((Unit_testStatus === "error_CS")) {
                        if ((time_lapsed > 61)) {
                            global.set("GWID_MQTT_testing", "noUNIT");

                            GW_LIST[GWID].AC_testStatus = "FAIL_CS";
                            global.set("GW_LIST", GW_LIST);

                            if ("payload" in output_updateGWFU) {
                                output_updateGWFU.payload[GWID] = "";
                            } else {
                                output_updateGWFU.payload = {
                                    [GWID]: ""
                                };
                            }
                        } else {
                            output_status.error_CS = "ERROR: waiting for save start";
                        }

                        if (GWID in GW_AC_LIST.testList.online) {
                            GW_LIST[GWID].AC_testStatus = "testing";
                            global.set("GW_LIST", GW_LIST);



                            // date processing
                            UNIT_TEST_time = system_Year + system_Month + system_Day + '-' + system_Hour + system_Minute + system_Second;
                            Log_fileName = "C:\\GW_TEST_FILES\\GW_LOGS\\" + GWID + "\\" + GWID + "_" + UNIT_TEST_time + "_ERROR-CS-RECONNECTED.csv";

                            var date_Comp = system_Year + "/" + system_Month + "/" + system_Day;
                            var time_Comp = system_Hour + ":" + system_Minute + ":" + system_Second;

                            output_createLog = {
                                "filename": Log_fileName,
                                "payload": {
                                    "date": date_Comp,
                                    "time": time_Comp,
                                    "testTime_remaining": testTime_remaining,
                                    "Control_ACOverride": "",
                                    "Output_ACstate": "",
                                    "Output_ACvoltage": "",
                                    "Output_ACcurrent": "",
                                    "Temp_Geyser": "",
                                    "Temp_PCB": "",
                                    "Temp_Sensor": "",
                                    "Trip_GeyserTempMax": "",
                                    "Trip_GeyserTempMin": "",
                                    "Trip_DryRun": "",
                                    "Trip_Contactor": "",
                                    "Trip_PCBtemp": ""
                                }
                            };

                            output_status.error_CS = "ERROR-CORRECTION: Reconnected during testing";
                        }

                        // stop for loop
                        break;
                    } else if ((Unit_testStatus === "queued") && (GWID in GW_AC_LIST.testList.online)) {
                        // date processing
                        UNIT_TEST_time = system_Year + system_Month + system_Day + '-' + system_Hour + system_Minute + system_Second;
                        UNIT_TEST.time = UNIT_TEST_time;

                        testTime_remaining = 60;
                        output_status.testTime_remaining = testTime_remaining;

                        // output message generation
                        GW_LIST[GWID].AC_testStatus = "testing";
                        GW_AC_IECounter = 0;
                        global.set("GW_LIST", GW_LIST);
                        context.set("GW_AC_IECounter", GW_AC_IECounter);

                        if ("payload" in output_updateGWFU) {
                            output_updateGWFU.payload[GWID] = "";
                        } else {
                            output_updateGWFU.payload = {
                                [GWID]: ""
                            };
                        }

                        UNIT_TEST.ID = GWID;

                        global.set(GWID_MQTT, UNIT_TEST);
                        global.set("GWID_MQTT_testing", GWID);

                        MQTT_topic = "GWR/" + GWID + "/1/SET";
                        MQTT_payload = {
                            "O": { "ACO": 1 }
                        };

                        output_MQTT.push({
                            "topic": MQTT_topic,
                            "payload": MQTT_payload
                        });

                        // log file generation
                        Log_fileName = "C:\\GW_TEST_FILES\\GW_LOGS\\" + GWID + "\\" + GWID + "_" + UNIT_TEST_time + ".csv";

                        var date_Comp = system_Year + "/" + system_Month + "/" + system_Day;
                        var time_Comp = system_Hour + ":" + system_Minute + ":" + system_Second;

                        output_createLog = {
                            "filename": Log_fileName,
                            "payload": {
                                "date": date_Comp,
                                "time": time_Comp,
                                "testTime_remaining": testTime_remaining,
                                "Control_ACOverride": "",
                                "Output_ACstate": "",
                                "Output_ACvoltage": "",
                                "Output_ACcurrent": "",
                                "Temp_Geyser": "",
                                "Temp_PCB": "",
                                "Temp_Sensor": "",
                                "Trip_GeyserTempMax": "",
                                "Trip_GeyserTempMin": "",
                                "Trip_DryRun": "",
                                "Trip_Contactor": "",
                                "Trip_PCBtemp": ""
                            }
                        };

                        // stop for loop
                        break;
                    }
                }
            }
        }
    }

    if (active_unit === false) {
        output_updateGWTC = {
            "payload": "STOP"
        };
    }
}

if ("payload" in output_updateGWFU) output_updateGWFU.topic = "UPDATE";
else output_updateGWFU = null;

output = [
    output_MQTT,
    output_createLog,
    output_updateLog,
    output_updateGWFU,
    output_updateGWTC,
    output_status
];

return output;