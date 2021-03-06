import { UiAppFeatureType, UiAppRequestType } from '../constants';
import { getLogger } from '../utils/logger';
import { MockFramePostChildClient, mockContext } from '../utils/testUtils';

import { DDModalClient } from './modal';

let mockFramepostClient: MockFramePostChildClient;
let client: DDModalClient;

beforeEach(() => {
    mockFramepostClient = new MockFramePostChildClient();
    client = new DDModalClient(
        true,
        getLogger({ debug: true }),
        mockFramepostClient as any
    );
});

describe('modal.open()', () => {
    test('sends an open modal request with definition to parent', async () => {
        mockFramepostClient.init({
            ...mockContext,
            app: {
                ...mockContext.app,
                features: [UiAppFeatureType.MODALS]
            }
        });
        const requestMock = jest
            .spyOn(mockFramepostClient, 'request')
            .mockImplementation(() => null);

        const response = await client.open({
            key: 'my-modal',
            source: 'modal.html'
        });

        expect(response).toEqual(null);

        expect(requestMock).toHaveBeenCalledWith(UiAppRequestType.OPEN_MODAL, {
            key: 'my-modal',
            source: 'modal.html'
        });
    });

    test('sends an open modal request with key to parent', async () => {
        mockFramepostClient.init({
            ...mockContext,
            app: {
                ...mockContext.app,
                features: [UiAppFeatureType.MODALS]
            }
        });
        const requestMock = jest
            .spyOn(mockFramepostClient, 'request')
            .mockImplementation(() => null);

        const response = await client.open('my-modal');

        expect(response).toEqual(null);

        expect(requestMock).toHaveBeenCalledWith(
            UiAppRequestType.OPEN_MODAL,
            'my-modal'
        );
    });

    test('throws an error if modal definition is invalid', async () => {
        mockFramepostClient.init({
            ...mockContext,
            app: {
                ...mockContext.app,
                features: [UiAppFeatureType.MODALS]
            }
        });

        let error;

        try {
            // @ts-ignore
            await client.open({
                source: 'modal.html'
            });
        } catch (e) {
            error = e;
        }

        expect(error).toBeInstanceOf(Error);
    });

    test('ignores request if key is empty', async () => {
        mockFramepostClient.init({
            ...mockContext,
            app: {
                ...mockContext.app,
                features: [UiAppFeatureType.MODALS]
            }
        });
        const requestMock = jest
            .spyOn(mockFramepostClient, 'request')
            .mockImplementation(() => null);

        const response = await client.open('');

        expect(response).toBeUndefined();

        expect(requestMock).not.toHaveBeenCalled();
    });

    test('throws an error if app does not have modals feature enabled', async () => {
        mockFramepostClient.init();

        let error;

        try {
            await client.open({
                key: 'my-modal',
                source: 'modal.html'
            });
        } catch (e) {
            error = e;
        }

        expect(error).toBeInstanceOf(Error);
    });
});

describe('modal.close()', () => {
    test('sends an close modal request to parent', async () => {
        mockFramepostClient.init({
            ...mockContext,
            app: {
                ...mockContext.app,
                features: [UiAppFeatureType.MODALS]
            }
        });
        const requestMock = jest
            .spyOn(mockFramepostClient, 'request')
            .mockImplementation(() => null);

        const response = await client.close('my-modal');

        expect(response).toEqual(null);

        expect(requestMock).toHaveBeenCalledWith(
            UiAppRequestType.CLOSE_MODAL,
            'my-modal'
        );
    });

    test('Throws an error if the app does not have the modals feature enabled', async () => {
        mockFramepostClient.init();

        let error;

        try {
            await client.close('my-modal');
        } catch (e) {
            error = e;
        }

        expect(error).toBeInstanceOf(Error);
    });
});
