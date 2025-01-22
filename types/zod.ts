export type ZodErrorSlimResponse = {
    success: boolean;
    errors: {
        path: string,
        message: string,
    }[],
};