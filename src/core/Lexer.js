export function splitInput(env, input) {
    let args = [];
    let file = '';
    let redirect = false;

    let left = input;
    let res = '';
    while (left.length > 0) {
        if (left[0] === ' ') {
            left = left.slice(1);
            if (res !== '') {
                if (redirect) {
                    file = res;
                    redirect = false;
                } else {
                    args.push(res);
                }
            }

            res = '';
            continue;
        } else if (left[0] === '>') {
            redirect = true;
            left = left.slice(1);

            if (res !== '')
                args.push(res);
            res = '';
            continue;
        }

        let result, remain;
        if (left[0] === '"') {
            [result, remain] = doubleQuotes(env, left);
        } else if (left[0] === "'") {
            [result, remain] = singleQuotes(left);
        } else {
            [result, remain] = notQuoted(env, left);
        }

        res += result;
        left = remain;
    }
    if (res !== '') {
        if (redirect)
            file = res;
        else
            args.push(res);
    }

    return [args.shift(), args, file];
}

function doubleQuotes(env, input) {
    let res = '';
    let i = 1;
    for (; i < input.length && input[i] !== '"'; i++) {
        if (input[i] === '\\') {
            i++;
            if (input[i] === '\\')
                res += '\\';
            else if (input[i] === '"')
                res += '"';
            else if (input[i] === '$')
                res += '$';
            else
                res += `\\${input[i] ?? ''}`;
        } else if (input[i] === '$') {
            const [result, index] = variable(env, input.slice(i));
            res += result;
            i += index - 1;
        } else {
            res += input[i];
        }
    }

    return [res, input.slice(i + 1)];
}

function singleQuotes(input) {
    const text = input.slice(1);
    const index = text.indexOf("'");
    if (index === -1)
        return [text, ''];

    return [text.slice(0, index), text.slice(index + 1)];
}

function notQuoted(env, input) {
    let res = '';
    let i = 0;
    for (; i < input.length; i++) {
        if (input[i] === ' ' || input[i] === '"' || input[i] === "'")
            break;

        if (input[i] === '\\') {
            res += input[++i] ?? '';
        } else if (input[i] === '$') {
            const [result, index] = variable(env, input.slice(i));
            res += result;
            i += index - 1;
        } else {
            res += input[i];
        }
    }

    return [res, input.slice(i)];
}

function variable(env, input) {
    const regex = /^\$(\?|[a-zA-Z_][a-zA-Z0-9_]*)/
    const res = input.match(regex);
    if (!res)
        return ['$', 1];

    return [env.vars[res[1]] ?? '', res[0].length];
}
