export default class ENVKeyNotFoundException extends Error {
    constructor(key: string) {
        super(`Environment variable "${key}" was not found.`);
        this.name = "ENVKeyNotFoundException";
    }
}