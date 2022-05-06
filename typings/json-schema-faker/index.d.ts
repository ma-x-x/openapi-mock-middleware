/* eslint-disable import/no-unresolved */
import 'json-schema-faker-types';

declare module '@faker-js/faker' {
    import faker from 'faker';
    export default faker;
}