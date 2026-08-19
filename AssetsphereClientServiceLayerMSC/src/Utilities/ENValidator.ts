import EnvKeyNotFoundException from "../Exceptions/EnvKeyNotFoundException";

export default class ENValidator {
    public static current = new ENValidator();

    public getValue(key: string): string {
        const value = import.meta.env[key];

        if (!value) {
            throw new EnvKeyNotFoundException(key);
        }

        return value;
    }
}