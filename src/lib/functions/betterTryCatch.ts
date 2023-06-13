interface Return<T> {
    error?: any;
    result?: T;
}

export default function betterTryCatch<T>(theFunction: (...args: any) => T, ...args: any): {
    error: unknown;
    result?: undefined;
} | {
    error?: undefined;
    result: T;
} {
    try {
        let result = theFunction(...args);
        return {
            result
        }
    } catch (err) {
        return {
            error: err
        }
    }
}


function test(arg0: string): string {
    return arg0;
}
function test2(arg0: number): number {
    return arg0;
}

function add(val1: number, val2: number) {
    return val1 + val2;
}


test("wow");
test2(12);

const data = betterTryCatch(add, 1, 2);

if (data.error) {
    console.log(data.error);
} else {
    data.result
}