"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generator_1 = require("./generator");
describe('generator', () => {
    describe('handleExamples', () => {
        it('should return the first example in the given examples object', () => {
            expect((0, generator_1.handleExamples)({
                first: {
                    value: {
                        id: 3,
                    },
                },
                second: {
                    value: {
                        id: 7,
                    },
                },
            })).toStrictEqual({ id: 3 });
        });
        it('should return an empty string on incorrect examples', () => {
            expect((0, generator_1.handleExamples)('string')).toBe('');
        });
    });
});
//# sourceMappingURL=generator.spec.js.map