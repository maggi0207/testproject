import { processReceiveData } from './Utils';  // Adjust the path as needed

describe('processReceiveData function', () => {
    it('should return ipAddress when field is ipAddress', () => {
        const longPollEvent = "";
        const longPollPayload = { field: "ipAddress", value: "192.168.1.1" };
        const result = processReceiveData(longPollEvent, longPollPayload);
        expect(result).toEqual({ ipAddress: "192.168.1.1" });
    });

    it('should return an object with tacsignature when longPollEvent is submitSignature and tacsignature is present', () => {
        const longPollEvent = "submitSignature";
        const longPollPayload = { tacsignature: "base64encodedstring" };
        const result = processReceiveData(longPollEvent, longPollPayload);
        expect(result).toEqual({
            tacsignature: "data:image/png;base64,base64encodedstring"
        });
    });

    it('should return an object with safetechSessionId when longPollEvent is submitSignature and safetechSessionId is present', () => {
        const longPollEvent = "submitSignature";
        const longPollPayload = { safetechSessionId: "sessionId123" };
        const result = processReceiveData(longPollEvent, longPollPayload);
        expect(result).toEqual({ safetechSessionId: "sessionId123" });
    });

    it('should return an object with both tacsignature and safetechSessionId when both are present', () => {
        const longPollEvent = "submitSignature";
        const longPollPayload = {
            tacsignature: "base64encodedstring",
            safetechSessionId: "sessionId123"
        };
        const result = processReceiveData(longPollEvent, longPollPayload);
        expect(result).toEqual({
            tacsignature: "data:image/png;base64,base64encodedstring",
            safetechSessionId: "sessionId123"
        });
    });

    it('should return an empty object for longPollEvent submitSignature with no relevant fields', () => {
        const longPollEvent = "submitSignature";
        const longPollPayload = {};
        const result = processReceiveData(longPollEvent, longPollPayload);
        expect(result).toEqual({});
    });

    it('should return an empty object for unknown longPollEvent and payload', () => {
        const longPollEvent = "unknownEvent";
        const longPollPayload = {};
        const result = processReceiveData(longPollEvent, longPollPayload);
        expect(result).toEqual({});
    });

    it('should handle undefined payload gracefully', () => {
        const longPollEvent = "submitSignature";
        const result = processReceiveData(longPollEvent, undefined);
        expect(result).toEqual({});
    });
});
