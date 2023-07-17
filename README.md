# IdentityReconciler
identify and keep track of a customer's identity across multiple transactions.

## Details
We are storing our data in __postgres DB__ , in a table - 'contact'.

Structure of the data:
```
{
  id                   Int                   
  phoneNumber          String?
  email                String?
  linkedId             Int? // the ID of another Contact linked to this one
  linkPrecedence       "secondary"|"primary" // "primary" if it's the first Contact in the link
  createdAt            DateTime              
  updatedAt            DateTime              
  deletedAt            DateTime?
}
```

#### Backend 
NodeJs with TypeScript , Express are used to build `identify` endpoint .

## EndPoint
### POST request.
<a>url: https://bitespeedv1.onrender.com/identify</a>
#### example body :
{
  "email": "bitespeed@fast.com",
  "phoneNumber": "9998883331"
}

## Functionality of endpoint
- If both the email & phone number in the Request are new  information-> primary contact gets created -> we get the response with an empty secondaryArray.
- If both the email & phone number belong to either one primary contact / one secondary contact ->appropriate reconcilated data is given as output
- If either of the email or the phone number is new information with the other attribute common to existing information -> create a new secondary contact -> appropriate reconcilated data is given as output
- If the email and phone number belong to different primary contacts, the primary contact which is old is retained as primary , the other primary contacts will be marked as secondary , and the contacts whose linkedId is mapped to the converted secondary contacts are updated to the reatined primary contact id -> appropriate reconcilated data is given as output

