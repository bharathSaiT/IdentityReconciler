import { findPrimaryContact, findSecondaryContacts, createSecondaryContact } from './db/db_accessor';
import {requestType}  from './model/input';
import { responseType  } from './model/response';

const identityReconcilation = async (request : requestType) =>{
    const email = request.email;
    const phoneNumber = request.phoneNumber;
    let response : responseType | undefined;
    // Find the details of primaryContact
    const primaryContact = await findPrimaryContact(email, phoneNumber);
        const emails = [primaryContact.email];
        const phoneNumbers = [primaryContact.phonenumber];
        const secondaryContactIds:any[] = [];
  
        // Fetch the details of the secondary contacts 
        const secondaryContacts = await findSecondaryContacts(email, phoneNumber); 
        //Verify if any of the secondary contacts are available
        console.log(secondaryContacts)
        if (secondaryContacts.length !== 0) {
          for (let i = 0; i < secondaryContacts.length; i++) {
            if (!emails.includes(secondaryContacts[i].email)) {
              emails.push(secondaryContacts[i].email);
            }
            if (!phoneNumbers.includes(secondaryContacts[i].phonenumber)) {
              phoneNumbers.push(secondaryContacts[i].phonenumber);
            }
            if (!secondaryContactIds.includes(secondaryContacts[i].id)) {
              secondaryContactIds.push(secondaryContacts[i].id);
            }
          }
          response = {
                contact: {
                    primaryContactId: primaryContact.id,
                    emails: emails,
                    phoneNumbers: phoneNumbers,
                    secondaryContactIds: secondaryContactIds,
                }
          }
          return response;
        } 
      
}
export {identityReconcilation}
