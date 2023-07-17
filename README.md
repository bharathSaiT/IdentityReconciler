# IdentityReconciler
identify and keep track of a customer's identity across multiple transactions.

## Details
We are storing our data in postgres DB , in a table - 'contact'.

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


## EndPoint
### POST request.
<a>url: https://bitespeedv1.onrender.com/identify</a>
#### example body :
{
  "email": "bitespeed@fast.com",
  "phoneNumber": "9998883331"
}
