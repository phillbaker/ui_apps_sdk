import { DDClient } from './client';
import { AppContext, ClientOptions } from './types';

let client: DDClient;

/**
 * Initializes a client, or returns an existing one if already initialized. User can provide an optional
 * callback to be executed with app context data when it is sent from the parent.
 */
export const init = (
    options?: ClientOptions,
    callback?: (context: AppContext) => void
): DDClient => {
    if (!client) {
        client = new DDClient(options);
    }

    if (callback) {
        client.getContext().then(callback);
    }

    return client;
};
