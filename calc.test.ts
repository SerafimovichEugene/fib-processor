import { sumInColumn } from './calc';

describe('calc module', () => {
    describe('summ in column', () => {
        it('', () => {
            const x = '3';
            const y = '2';
            expect(sumInColumn(x, y)).toEqual('5');
        })
        it('', () => {
            const x = '9';
            const y = '9';
            expect(sumInColumn(x, y)).toEqual('18');
        })
        it('', () => {
            const x = '123';
            const y = '123';
            expect(sumInColumn(x, y)).toEqual('246');
        })
        it('', () => {
            const x = '12';
            const y = '8';
            expect(sumInColumn(x, y)).toEqual('20');
        })
        it('', () => {
            const x = '8';
            const y = '13';
            expect(sumInColumn(x, y)).toEqual('21');
        })
        it('', () => {
            const x = '999';
            const y = '9999';
            expect(sumInColumn(x, y)).toEqual('10998');
        })
        it('', () => {
            const x = '999';
            const y = '9999';
            expect(sumInColumn(x, y)).toEqual('10998');
        })

        it('', () => {
            const x = '2';
            const y = '9999';
            expect(sumInColumn(x, y)).toEqual('10001');
        })
        it('', () => {
            const x = '3';
            const y = '-2';
            expect(() => { sumInColumn(x, y) }).toThrowError();
        })
        it('', () => {
            const x = '123';
            const y = '1f3';
            expect(() => { sumInColumn(x, y) }).toThrowError();
        })
        it('', () => {
            const x = '';
            const y = '';
            expect(() => { sumInColumn(x, y) }).toThrowError();
        })
    });
});