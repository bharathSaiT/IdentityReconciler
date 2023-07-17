import {client} from './db_client';

  /**
 * Function to find the primary contact for a given email or phone number
 * @param email 
 * @param phoneNumber 
 * @returns primaryContact
 */
  const findPrimaryContact = async (email: string, phoneNumber: string): Promise<any> => {
    try {
          // Fetch the primary contact , based on the records which might match with the given email & phonenumber
          const primaryContactQuery = {
          text: 'SELECT * FROM contact WHERE (email = $1 OR phoneNumber = $2) AND linkPrecedence = $3',
          values: [email, phoneNumber, 'primary'],
        };
        const result = await client.query(primaryContactQuery);
      
      console.info("searching primary data completed");
      
      if (result.rows.length === 0) {
          // Fetch the primary contact , based on the linkedId of the record corresponding to the given email & phonenumber
            const primaryIdQuery = {
              text: 'SELECT * FROM contact WHERE id IN (SELECT linkedid FROM contact WHERE (email = $1 OR phoneNumber = $2)) ',
              values: [email, phoneNumber],
            };
            const result = await client.query(primaryIdQuery);
          
          // Return the primaryContact object
            if(result.rows.length === 0) 
            {
              console.info("created a new primary contact");
              return createPrimaryContact(email,phoneNumber);
            }
            else if (result.rows.length > 1) {
              console.info("update the primary contacts to secondary based on the age of the data ");
                return updatePrimaryToSecondary(result);
            }
            console.info("fetched primary id using the linkedId of secondary contact");
            return result.rows[0];
          
      }
      else if (result.rows.length > 1) {
          // Update the primary contacts to secondary contacts and return the primary contact
          console.info("update the primary contacts to secondary based on the age of the data ");
          return updatePrimaryToSecondary(result);
      }
      // Return the primaryContact object
      return result.rows[0];
    } 
    catch (error) {
      console.error('Error executing query:', error);
    }
  };
  /**
   * Function to fetch all the secondary contacts linked to the email & phoneNumber
   * @param email 
   * @param phoneNumber 
   * @returns Array of secondary contacts
   */
  const findSecondaryContacts = async (email: string, phoneNumber: string): Promise<any[]> => {
    //get the primaryId related to provided email , phoneNumber
    const primaryContact = await findPrimaryContact(email, phoneNumber);
    const primaryId = primaryContact.id;
  
    try {
      const query = {
        text: 'SELECT * FROM contact WHERE (linkedid = $1) AND linkPrecedence = $2',
        values: [primaryId, 'secondary'],
      };
  
      const result = await client.query(query);
      return result.rows;
    } 
    catch (error) {
      console.error('Error executing query:', error);
      return [];
    }
  };
  /**
   * function to create a primary contact corresponding to the provided email and phoneNumber
   * @param email 
   * @param phoneNumber 
   * @returns the created primaryContact
   */
  const createPrimaryContact = async (email: string, phoneNumber: string): Promise<any> => {
    try {
      const query = {
        text: `INSERT INTO Contact (phonenumber, email, linkprecedence)
        VALUES ($1, $2, $3)`,
        values: [phoneNumber, email, 'primary'],
      };
        console.log("at createPrimaryContact");
        const result = await client.query(query);
        // Fetch the newly created primary contact
        return findPrimaryContact(email,phoneNumber);
    } catch (error) {
      console.error('Error executing query:', error);
    }
  };
  /**
   * Function to create secondary contacts for corresponding 
   * @param email 
   * @param phoneNumber 
   * @param linkedId 
   * @returns 
   */
  const createSecondaryContact = async (
    email: string,
    phoneNumber: string,
    linkedId: number
  ): Promise<any> => {
    try {
      const query = {
        text: `INSERT INTO Contact (phonenumber, email, linkprecedence, linkedid)
        VALUES ($1, $2, $3, $4)`,
        values: [phoneNumber, email, 'secondary', linkedId],
      };
  
      await client.query(query);
  
      const getId = {
        text: 'SELECT id FROM contact WHERE (email = $1 AND phoneNumber = $2 AND linkedid = $3 AND linkPrecedence = $4)',
        values: [email, phoneNumber, linkedId, 'secondary'],
      };
  
      const result = await client.query(getId);
      console.log('at createSecondaryContact ');
      return result.rows[0];
    } catch (error) {
      console.error('Error executing query:', error);
    }
  };
  /**
   * Function to update primary contacts to seconday contacts
   * @param result : Array of primary contacts
   * @returns : the og primary contact
   */
  const updatePrimaryToSecondary = async (result : any): Promise<any> => {
  
      //sort in ascending order of date 
      result.rows.sort((a: { createdat: string | number | Date; }, b: { createdat: string | number | Date; }) => new Date(a.createdat).getTime() - new Date(b.createdat).getTime());
      const updatedObjects = result.rows.slice(1);
  
      //get the primaryId , by getting the oldest created contact record
      const primaryId = result.rows[0].id;
      
      //update all the elements ,linkprecedence to secondary and linkedId from null to primaryId
      const modifyPrimary = {
          text: `UPDATE contact SET linkprecedence = $1 ,linkedid=$2 WHERE id IN (${updatedObjects.map((obj: { id: any; }) => obj.id).join(', ')})`,
          values: ['secondary' ,primaryId]
      };
      await client.query(modifyPrimary);
  
      // Update the linkedId for all the elements whose current linkedId was among the above updates contacts
      const updateLinkedId ={
          text: `UPDATE contact SET linkedid = $1 WHERE linkedid IN (${updatedObjects.map((obj: { id: any; }) => obj.id).join(', ')})`,
          values: [primaryId]
      }
      await client.query(updateLinkedId);
  
      //return the primaryContact object
      return result.rows[0];
  };

export { findPrimaryContact , findSecondaryContacts, createPrimaryContact, createSecondaryContact, updatePrimaryToSecondary};
