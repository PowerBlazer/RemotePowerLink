import { classNames } from './classNames';

describe('classNames', () => {
    test('with only first param', () => {
        expect(classNames('someClass')).toBe('someClass');
    });

    test('with additional class', () => {
        const expected = 'someClass class1 class2';
        expect(classNames('someClass', {}, ['class1', 'class2'])).toBe(expected);
    });

    test('with mods', () => {
        const expected = 'someClass class1 class2 horered scrollable';
        expect(classNames(
            'someClass',
            { horered: true, scrollable: true },
            ['class1', 'class2'])
        ).toBe(expected);
    });

    test('with mods false', () => {
        const expected = 'someClass class1 class2 horered';
        expect(classNames(
            'someClass',
            { horered: true, scrollable: false },
            ['class1', 'class2'])
        ).toBe(expected);
    });

    test('with mods undefined', () => {
        const expected = 'someClass class1 class2 horered';
        expect(classNames(
            'someClass',
            { horered: true, scrollable: undefined },
            ['class1', 'class2'])
        ).toBe(expected);
    });
});
