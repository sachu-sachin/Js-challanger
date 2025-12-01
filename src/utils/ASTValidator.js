import * as acorn from 'acorn';

export class ASTValidator {
    constructor(code) {
        this.code = code;
        this.ast = null;
        this.errors = [];
    }

    parse() {
        try {
            this.ast = acorn.parse(this.code, {
                ecmaVersion: 2020,
                sourceType: 'module'
            });
            return true;
        } catch (e) {
            this.errors.push(`Syntax Error: ${e.message}`);
            return false;
        }
    }

    validate(requirements) {
        if (!this.ast && !this.parse()) {
            return { valid: false, errors: this.errors };
        }

        for (const rule of requirements) {
            const passed = this.checkRule(rule);
            if (!passed) {
                // If a rule fails, we stop and return the error
                // We could collect all errors, but usually failing the first one is enough
                return { valid: false, errors: this.errors };
            }
        }

        return { valid: true, errors: [] };
    }

    checkRule(rule) {
        switch (rule.type) {
            case 'declaration':
                return this.checkDeclaration(rule);
            case 'assignment':
                return this.checkAssignment(rule);
            case 'methodCall':
                return this.checkMethodCall(rule);
            case 'callExpression':
                return this.checkCallExpression(rule);
            case 'structure':
                return this.checkStructure(rule);
            case 'anyOf':
                return this.checkAnyOf(rule);
            case 'noHardcodedConsole':
                return this.checkNoHardcodedConsole(rule);
            case 'specificStructure':
                return this.checkSpecificStructure(rule);
            default:
                console.warn(`Unknown rule type: ${rule.type}`);
                return true; // Ignore unknown rules
        }
    }

    checkStructure(rule) {
        let found = false;
        this.traverse(node => {
            if (node.type === rule.nodeType) {
                found = true;
            }
        });

        if (!found) {
            this.errors.push(`Missing required structure: ${rule.nodeType}`);
        }
        return found;
    }

    checkAnyOf(rule) {
        // rule.rules is an array of rules
        // We need at least one to pass
        // We shouldn't pollute this.errors with failures from the ones that didn't pass
        // unless ALL fail.

        const originalErrors = [...this.errors];
        const tempErrors = [];

        for (const subRule of rule.rules) {
            // We need to temporarily capture errors for this sub-rule
            const preErrorCount = this.errors.length;
            const passed = this.checkRule(subRule);

            if (passed) {
                // If one passes, we are good!
                // Remove any errors added by this successful check (should be none if passed, but just in case)
                // actually if it passed, checkRule shouldn't have added errors.
                // But we need to revert errors from *previous* failed sub-rules in this loop?
                // No, we just need to reset errors to originalErrors and return true.
                this.errors = originalErrors;
                return true;
            } else {
                // If failed, collect the errors but don't keep them in the main list yet
                const newErrors = this.errors.slice(preErrorCount);
                tempErrors.push(...newErrors);
                // Reset main errors for the next iteration
                this.errors = originalErrors;
            }
        }

        // If we get here, none passed.
        // We should probably report a generic error or the specific errors.
        // For "anyOf", a generic error is usually better, or a list of options.
        this.errors.push(`Must match at least one of the required patterns.`);
        return false;
    }

    checkDeclaration(rule) {
        let found = false;

        // Simple traversal
        // In a real production app, use a proper walker like acorn-walk
        this.traverse(node => {
            if (node.type === 'VariableDeclaration') {
                if (rule.kind && node.kind !== rule.kind) return;

                for (const decl of node.declarations) {
                    if (decl.id.name === rule.name) {
                        // Found the variable name
                        // Check init value if required
                        if (rule.initValue !== undefined) {
                            if (!decl.init) return; // No init value
                            if (decl.init.type === 'Literal' && decl.init.value == rule.initValue) {
                                found = true;
                            }
                        } else {
                            found = true;
                        }
                    }
                }
            }
        });

        if (!found) {
            const valueMsg = rule.initValue !== undefined ? ` initialized to ${rule.initValue}` : '';
            this.errors.push(`Missing required declaration: ${rule.kind} ${rule.name}${valueMsg}`);
        }
        return found;
    }

    checkAssignment(rule) {
        let found = false;
        this.traverse(node => {
            if (node.type === 'AssignmentExpression') {
                if (node.left.name === rule.name) {
                    if (rule.value !== undefined) {
                        if (node.right.type === 'Literal' && node.right.value == rule.value) {
                            found = true;
                        }
                    } else {
                        found = true;
                    }
                }
            }
        });

        if (!found) {
            const valueMsg = rule.value !== undefined ? ` to ${rule.value}` : '';
            this.errors.push(`Missing required assignment: ${rule.name} = ...${valueMsg}`);
        }
        return found;
    }

    checkMethodCall(rule) {
        let found = false;
        this.traverse(node => {
            if (node.type === 'CallExpression' && node.callee.type === 'MemberExpression') {
                const objectName = node.callee.object.name;
                const methodName = node.callee.property.name;

                if (objectName === rule.object && methodName === rule.method) {
                    found = true;
                }
            }
        });

        if (!found) {
            this.errors.push(`Missing required method call: ${rule.object}.${rule.method}()`);
        }
        return found;
    }

    checkCallExpression(rule) {
        let found = false;
        this.traverse(node => {
            if (node.type === 'CallExpression') {
                // Check if it's a direct call (e.g., myFunc()) or member call (e.g., console.log())
                let calleeName = '';
                if (node.callee.type === 'Identifier') {
                    calleeName = node.callee.name;
                } else if (node.callee.type === 'MemberExpression') {
                    calleeName = `${node.callee.object.name}.${node.callee.property.name}`;
                }

                if (calleeName === rule.callee) {
                    // Check arguments if required
                    if (rule.arguments) {
                        // Check if at least one argument matches the requirement
                        // This is a simplification; for more complex checks we might need more detailed rules
                        const hasMatchingArg = node.arguments.some(arg => {
                            if (rule.arguments.includes(arg.name)) return true; // Identifier match
                            if (arg.type === 'Literal' && rule.arguments.includes(arg.value)) return true; // Literal match
                            return false;
                        });

                        if (hasMatchingArg) {
                            found = true;
                        }
                    } else {
                        found = true;
                    }
                }
            }
        });

        if (!found) {
            const argsMsg = rule.arguments ? ` with arguments: ${rule.arguments.join(', ')}` : '';
            this.errors.push(`Missing required call: ${rule.callee}(${argsMsg})`);
        }
        return found;
    }

    checkNoHardcodedConsole(rule) {
        let hasHardcoded = false;
        this.traverse(node => {
            if (node.type === 'CallExpression') {
                let isConsoleLog = false;
                if (node.callee.type === 'MemberExpression') {
                    if (node.callee.object.name === 'console' && node.callee.property.name === 'log') {
                        isConsoleLog = true;
                    }
                }

                if (isConsoleLog) {
                    // Check if all arguments are static
                    const allStatic = node.arguments.every(arg => this.isStatic(arg));
                    if (allStatic && node.arguments.length > 0) {
                        hasHardcoded = true;
                    }
                }
            }
        });

        if (hasHardcoded) {
            this.errors.push('Hardcoded console.log statements are not allowed. Use variables or expressions.');
            return false;
        }
        return true;
    }

    isStatic(node) {
        if (node.type === 'Literal') return true;
        if (node.type === 'ArrayExpression') {
            return node.elements.every(el => this.isStatic(el));
        }
        if (node.type === 'ObjectExpression') {
            return node.properties.every(prop => this.isStatic(prop.value));
        }
        // Template literals with no expressions are static
        if (node.type === 'TemplateLiteral') {
            return node.expressions.length === 0;
        }
        return false;
    }

    checkSpecificStructure(rule) {
        let found = false;
        this.traverse(node => {
            if (node.type === rule.nodeType) {
                // Check properties
                let match = true;
                if (rule.properties) {
                    for (const [key, value] of Object.entries(rule.properties)) {
                        // Handle nested checks if value is an object with 'name', 'value', etc.
                        // For simplicity, we'll assume value is an object describing the expected node property
                        if (!this.matchesShape(node[key], value)) {
                            match = false;
                            break;
                        }
                    }
                }
                if (match) found = true;
            }
        });

        if (!found) {
            this.errors.push(`Missing required code structure: ${rule.description || rule.nodeType}`);
        }
        return found;
    }

    matchesShape(node, shape) {
        if (!node) return false;
        if (typeof shape !== 'object') return node === shape;

        for (const key in shape) {
            if (key === 'nodeType') {
                if (node.type !== shape.nodeType) return false;
            } else if (typeof shape[key] === 'object' && shape[key] !== null) {
                if (!this.matchesShape(node[key], shape[key])) return false;
            } else {
                if (node[key] !== shape[key]) return false;
            }
        }
        return true;
    }

    traverse(callback) {
        const visit = (node) => {
            if (!node || typeof node !== 'object') return;

            if (node.type) {
                callback(node);
            }

            for (const key in node) {
                if (key === 'loc' || key === 'start' || key === 'end') continue;

                const child = node[key];
                if (Array.isArray(child)) {
                    child.forEach(visit);
                } else {
                    visit(child);
                }
            }
        };

        visit(this.ast);
    }
}
