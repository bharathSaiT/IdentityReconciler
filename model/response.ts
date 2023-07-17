import { type } from "os";
import { string } from "prop-types";

type responseType = {
    contact : contactType
}
type contactType = {
    primaryContactId :number,
    emails : string[],
    phoneNumbers : number[],
    secondaryContactIds: number[]
}

export {responseType};
