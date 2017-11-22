const Utils = require(`./utils.js`);
const mqtt = require(`mqtt`);
const debug = require(`debug`)(`mqtt-dev-device`);

const PROJECT_ID = `innate-life-143723`;
const CLOUD_REGION = `us-central1`;
const REGISTRY_ID = `global-device-registry`;
const DEVICE_ID = `development-device`;
const MESSAGE_EVENT_TYPE = `events`;
const MESSAGE_STATE_TYPE = `state`;

const mqttClientId = `projects/${PROJECT_ID}/locations/${CLOUD_REGION}/registries/${REGISTRY_ID}/devices/${DEVICE_ID}`;
const mqttEventTopic = `/devices/raspberry-pi-2-home/${MESSAGE_EVENT_TYPE}`;
const mqttStateTopic = `/devices/raspberry-pi-2-home/${MESSAGE_STATE_TYPE}`;

const client = mqtt.connect({
    host: `mqtt.googleapis.com`,
    port: `8883`,
    clientId: mqttClientId,
    username: `unused`,
    password: Utils.createJwt(PROJECT_ID, `./keys/rsa_private.pem`),
    protocol: `mqtts`
});


client.on(`connect`, () => {
    debug(`connected`);

    client.subscribe(mqttEventTopic, (err) => { if (err) { console.warn(err); } });
    client.subscribe(mqttStateTopic, (err) => { if (err) { console.warn(err); } });
});

client.on(`message`, (topic, message) => {
    debug(`message`, topic, message.toString());
});

client.on(`close`, () => {
    debug(`close`);

    client.reconnect();
});

client.on(`error`, (err) => {
    debug(`error`, err);
});
