import { ClientContext } from './../common/ClientContext';

export interface AuthorisationContext {
    clientContext: ClientContext;
    entityContext: any
}