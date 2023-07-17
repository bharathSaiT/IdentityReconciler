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
        //Verify if any of the secondary contacts are available and populate the array data accordingly
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
        }
          // If the primary Contact exists and the request has either of phoneNumber or email common to an existing contact,
          // but contains new information,we are creating a new “secondary”Contact" .
          if ((email && !emails.includes(email)) || (phoneNumber && !phoneNumbers.includes(phoneNumber))) {
            const row = await createSecondaryContact(email, phoneNumber, primaryContact.id);
            secondaryContactIds.push(row.id);
          }
  
          //update emails array if email is new
          if (email && !emails.includes(email)) {
            emails.push(email);
          }
          //update phoneNumber array if phoneNumber is new
          if (phoneNumber && !phoneNumbers.includes(phoneNumber)) {
            phoneNumbers.push(phoneNumber);
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
export {identityReconcilation}
