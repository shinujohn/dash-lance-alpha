import * as express from "express";
import { Promise } from "rsvp";
import { ErrorType } from "./../enums/common/errorType";

export class ApiSetup {

    static version: string = null;

    static GetContextRoot() {
        return `/api${this.version ? "/" + this.version : ""}`;
    }

    static init(router: express.Router) {
        console.log('Base class api init')
    }

    static getErrorCode(error: any) {
        switch (error.message) {
            case ErrorType.notFount:
                return 404;
            case ErrorType.invalidParameter:
                return 400;
            case ErrorType.unauthorised:
                return 401;
            case ErrorType.duplicate:
                return 409;
            case ErrorType.invalidData:
                return 400;
        }

        return 500;
    };
}

