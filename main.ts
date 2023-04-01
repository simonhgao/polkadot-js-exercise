import { ApiPromise, WsProvider } from '@polkadot/api';
import { EventRecord } from '@polkadot/types/interfaces';

const WEB_SOCKET = 'ws://localhost:9944';

// connect to substrate chain
const connectSubstrate = async () => {
    const wsProvider = new WsProvider(WEB_SOCKET);
    const api = await ApiPromise.create({ provider: wsProvider, types: {} });
    await api.isReady;
    console.log("connect to substrate OK!");
    return api;
};


const main = async () => {
    // Create our API with a default connection to the local node
    const api = await connectSubstrate();

    // Subscribe to system events via storage
    api.query.system.events((events: any) => {
        console.log(`Received ${events.length} events:\n`);
        // Loop through the Vec<EventRecord>
        events.forEach((record: EventRecord) => {
            // Extract the phase, event and the event types
            const { event: { method, section, meta, data }, phase } = record;

            // If the event is a transfer event
            if (section === 'balances' && method === 'Transfer') {
                const [from, to, value] = data;

                console.log(`\n\n========= Transfer Event =========\n\n`);
                console.log(`From: ${from}\nTo: ${to}\nValue: ${value}`);
                console.log(`\n\n=================================\n\n`);
            }

            // Show the info of event
            console.log(`${section}:${method}:: (phase=${phase.toString()})\n`);
            // Show the meta data of event
            console.log(`${meta.toString()}\n`);
        });
    });
};

main().catch((error) => {
    console.error(error);
    process.exit(-1);
});