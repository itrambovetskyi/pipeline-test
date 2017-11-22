const Utils = require(`./utils.js`);
const mqtt = require(`mqtt`);
const debug = require(`debug`)(`mqtt-device`);

const PROJECT_ID = `innate-life-143723`;
const CLOUD_REGION = `us-central1`;
const REGISTRY_ID = `global-device-registry`;
const DEVICE_ID = `raspberry-pi-2-home`;
const MESSAGE_EVENT_TYPE = `events`;
const MESSAGE_STATE_TYPE = `state`;

const mqttClientId = `projects/${PROJECT_ID}/locations/${CLOUD_REGION}/registries/${REGISTRY_ID}/devices/${DEVICE_ID}`;
const mqttEventTopic = `/devices/${DEVICE_ID}/${MESSAGE_EVENT_TYPE}`;
const mqttStateTopic = `/devices/${DEVICE_ID}/${MESSAGE_STATE_TYPE}`;

const eventNotifier = getNotifier(20000, mqttEventTopic, eventDataGetter);
const stateNotifier = getNotifier(20000, mqttStateTopic, stateDataGetter);

let client = client = mqtt.connect({
    host: `mqtt.googleapis.com`,
    port: `8883`,
    clientId: mqttClientId,
    username: `unused`,
    password: Utils.createJwt(PROJECT_ID, `./keys/rsa_private.pem`),
    protocol: `mqtts`
});


client.on(`connect`, () => {
    debug(`connected`);

    eventNotifier.start();
    stateNotifier.start();
});

client.on(`close`, () => {
    debug(`close`);

    eventNotifier.stop();
    stateNotifier.stop();

    process.exit();
});

client.on(`error`, (err) => {
    debug(`error`, err);
    process.exit();
});


function getNotifier (interval, topic, dataGetter) {
    let intervalId = null;

    return {
        start: () => intervalId = setInterval(() => client.publish(topic, dataGetter()), interval),
        stop: () => clearInterval(intervalId)
    }
}

let temperature = 0;

function eventDataGetter () {
    temperature = (Math.random() * 20) + (Math.random() * 40);

    return JSON.stringify({
        temperature: temperature
    });
}

function stateDataGetter () {
    return JSON.stringify({
        data: temperature < 0 ? `Low temperature` : temperature > 40 ? `High temperature` : `Normal temperature`
    });
}