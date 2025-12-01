import * as acorn from 'acorn';

export class LoopProtector {
    constructor(timeout = 2000) {
        this.timeout = timeout;
        this.guardName = '_checkLoop';
    }

    protect(code) {
        try {
            const ast = acorn.parse(code, {
                ecmaVersion: 2020,
                sourceType: 'module',
                locations: true,
                ranges: true
            });

            const loops = [];
            this.traverse(ast, (node) => {
                if (['WhileStatement', 'DoWhileStatement', 'ForStatement', 'ForInStatement', 'ForOfStatement'].includes(node.type)) {
                    loops.push(node);
                }
            });

            // Sort loops by start index in descending order to modify string safely
            loops.sort((a, b) => b.start - a.start);

            let modifiedCode = code;

            for (const loop of loops) {
                const body = loop.body;

                if (body.type === 'BlockStatement') {
                    // Inject at the beginning of the block
                    // body.start points to '{', so we insert after it
                    const insertPos = body.start + 1;
                    modifiedCode = modifiedCode.slice(0, insertPos) + `${this.guardName}();` + modifiedCode.slice(insertPos);
                } else {
                    // Wrap single statement in block
                    const bodyStart = body.start;
                    const bodyEnd = body.end;
                    const originalBody = modifiedCode.slice(bodyStart, bodyEnd);
                    const newBody = `{${this.guardName}();${originalBody}}`;
                    modifiedCode = modifiedCode.slice(0, bodyStart) + newBody + modifiedCode.slice(bodyEnd);
                }
            }

            return modifiedCode;
        } catch (e) {
            console.error("Loop protection failed:", e);
            // If parsing fails, return original code (it might be a syntax error that the runner will catch)
            return code;
        }
    }

    traverse(node, callback) {
        if (!node || typeof node !== 'object') return;

        if (node.type) {
            callback(node);
        }

        for (const key in node) {
            if (key === 'loc' || key === 'range' || key === 'start' || key === 'end') continue;

            const child = node[key];
            if (Array.isArray(child)) {
                child.forEach(c => this.traverse(c, callback));
            } else {
                this.traverse(child, callback);
            }
        }
    }
}
