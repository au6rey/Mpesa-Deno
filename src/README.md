# Mpesa-Deno


A Deno module for M-Pesa Daraja API calls.

Ready to use:
- [LIPA NA MPESA STK PUSH](#lipa-na-mpesa-online)
- [LIPA NA MPESA QUERY](#lipa-na-mpesa-online-query)
- [C2B](#c2b)
- [B2C](#business-to-customer-b2c)
- [TRANSACTION STATUS](#transaction-status)
- [ACCOUNT BALANCE](#account-balance)
- [REVERSAL](#reversal)

## Adding to your project
Import the module from Deno.land as follows;
```javascript
import { Mpesa } from "https://deno.land/x/mpesa/mod.ts";

```
## Requirements
You will need the following from Safaricom:
1.  Consumer Key.
2.  Consumer Secret.
3.  Security Credentials for Production/Sandbox environment.
4.  [Callback server with Mpesa apis whitelisted]

## How to use
```javascript
const credentials = {
    clientKey: 'YOUR_CONSUMER_KEY_HERE',
    clientSecret: 'YOUR_CONSUMER_SECRET_HERE',
    securityCredential: 'YOUR_SECURITY_CREDENTIAL',
};

//Environment is a string and may be either `sandbox` or `production`
const environment = "sandbox"
const mpesa = new Mpesa(credentials, environment);
```

## Methods

##### Register

The C2B Register URL API registers the 3rd party’s confirmation and validation URLs to M-Pesa ; which then maps these URLs to the 3rd party shortcode. Whenever M-Pesa receives a transaction on the shortcode, M-Pesa triggers a validation request against the validation URL and the 3rd party system responds to M-Pesa with a validation response (either a success or an error code). The response expected is the success code the 3rd party

M-Pesa completes or cancels the transaction depending on the validation response it receives from the 3rd party system. A confirmation request of the transaction is then sent by M-Pesa through the confirmation URL back to the 3rd party which then should respond with a success acknowledging the confirmation.

```javascript
mpesa
  .c2bregister({
    ShortCode: "Short Code",
    ConfirmationURL: "Confirmation URL",
    ValidationURL: "Validation URL",
    ResponseType: "Response Type",
  })
  .then((response) => {
    //Do something with the response
    //eg
    console.log(response);
  })
  .catch((error) => {
    //Do something with the error;
    //eg
    console.error(error);
  });
```

1.  ShortCode - The short code of the organization.
2.  ResponseType - Default response type for timeout.
3.  ConfirmationURL- Confirmation URL for the client.
4.  ValidationURL - Validation URL for the client.
#### Lipa na mpesa online

Lipa na M-Pesa Online Payment API is used to initiate a M-Pesa transaction on behalf of a customer using STK Push. This is the same technique mySafaricom App uses whenever the app is used to make payments.

```javascript
mpesa
  .lnmOnline({
    BusinessShortCode: 123456,
    Amount: 1000 /* 1000 is an example amount */,
    PartyA: "Party A",
    PhoneNumber: "Phone Number",
    CallBackURL: "CallBack URL",
    AccountReference: "Account Reference",
    passKey: "Lipa Na Mpesa Pass Key",
    TransactionType: "Transaction Type" /* OPTIONAL */,
    TransactionDesc: "Transaction Description" /* OPTIONAL */,
  })
  .then((response) => {
    //Do something with the response
    //eg
    console.log(response);
  })
  .catch((error) => {
    //Do something with the error;
    //eg
    console.error(error);
  });
```

1.  BusinessShortCode - The organization shortcode used to receive the transaction.
2.  Amount - The amount to be transacted.
3.  PartyA - The MSISDN sending the funds.
4.  PartyB - The organization shortcode receiving the funds. Default is the BusinessShorCode.
5.  PhoneNumber - The MSISDN sending the funds.
6.  CallBackURL - The url to where responses from M-Pesa will be sent to.
7.  AccountReference - Used with M-Pesa PayBills.
8.  TransactionDesc - A description of the transaction.
9.  passKey - Lipa Na Mpesa Pass Key.
10. Transaction Type - Default is `CustomerPayBillOnline`

#### Lipa na mpesa online query

```javascript
mpesa
  .lnmQuery({
    BusinessShortCode: 123456,
    CheckoutRequestID: "Checkout Request ID",
    passKey: "Lipa Na Mpesa Pass Key",
  })
  .then((response) => {
    //Do something with the response
    //eg
    console.log(response);
  })
  .catch((error) => {
    //Do something with the error;
    //eg
    console.error(error);
  });
```

1.  BusinessShortCode - Business Short Code
2.  CheckoutRequestID - Checkout RequestID
3.  Lipa Na Mpesa Pass Key

##### Simulate

```javascript
mpesa
  .c2bsimulate({
    ShortCode: 123456,
    Amount: 1000 /* 1000 is an example amount */,
    Msisdn: 254792123456,
    CommandID: "Command ID" /* OPTIONAL */,
    BillRefNumber: "Bill Reference Number" /* OPTIONAL */,
  })
  .then((response) => {
    //Do something with the response
    //eg
    console.log(response);
  })
  .catch((error) => {
    //Do something with the error;
    //eg
    console.error(error);
  });
```

1.  ShortCode - 6 digit M-Pesa Till Number or PayBill Number
2.  CommandID - Unique command for each transaction type. Default is `CustomerPayBillOnline`
3.  Amount - The amount been transacted.
4.  MSISDN - MSISDN (phone number) sending the transaction, start with country code without the plus(+) sign.
5.  BillRefNumber - Bill Reference Number (Optional).

#### Account Balance

The Account Balance API requests for the account balance of a shortcode.

```javascript
mpesa
  .accountBalance({
    Initiator: "Initiator Name",
    PartyA: "Party A",
    IdentifierType: "Identifier Type",
    QueueTimeOutURL: "Queue Timeout URL",
    ResultURL: "Result URL",
    CommandID: "Command ID" /* OPTIONAL */,
    Remarks: "Remarks" /* OPTIONAL */,
  })
  .then((response) => {
    //Do something with the response
    //eg
    console.log(response);
  })
  .catch((error) => {
    //Do something with the error;
    //eg
    console.error(error);
  });
```

1.  Initiator - This is the credential/username used to authenticate the transaction request.
2.  CommandID - A unique command passed to the M-Pesa system. Default is `AccountBalance`
3.  PartyB - The shortcode of the organisation receiving the transaction.
4.  ReceiverIdentifierType - Type of the organisation receiving the transaction.
5.  Remarks - Comments that are sent along with the transaction.
6.  QueueTimeOutURL - The timeout end-point that receives a timeout message.
7.  ResultURL - The end-point that receives a successful transaction.

#### Transaction Status

Transaction Status API checks the status of a B2B, B2C and C2B APIs transactions.

```javascript
mpesa
  .transactionStatus({
    Initiator: "Initiator",
    TransactionID: "Transaction ID",
    PartyA: "Party A",
    IdentifierType: "Identifier Type",
    ResultURL: "Result URL",
    QueueTimeOutURL: "Queue Timeout URL",
    CommandID: "Command ID" /* OPTIONAL */,
    Remarks: "Remarks" /* OPTIONAL */,
    Occasion: "Occasion" /* OPTIONAL */,
  })
  .then((response) => {
    //Do something with the response
    //eg
    console.log(response);
  })
  .catch((error) => {
    //Do something with the error;
    //eg
    console.error(error);
  });
```

1.  Initiator - The name of Initiator to initiating the request.
2.  CommandID - Unique command for each transaction type, possible values are: `TransactionStatusQuery`.
3.  TransactionID - Organization Receiving the funds.
4.  Party A - Organization /MSISDN sending the transaction.
5.  IdentifierType - Type of organization receiving the transaction.
6.  ResultURL - The path that stores information of transaction.
7.  QueueTimeOutURL - The path that stores information of time out transaction.
8.  Remarks - Comments that are sent along with the transaction.
9.  Occasion - Optional.


#### Reversal

Reverses a B2B, B2C or C2B M-Pesa transaction.

```javascript
mpesa
  .reversal({
    Initiator: "Initiator",
    TransactionID: "Transaction ID",
    Amount: 1000 /* 1000 is an example amount */,
    ReceiverParty: "Reciever Party",
    ResultURL: "Result URL",
    QueueTimeOutURL: "Queue Timeout URL",
    CommandID: "Command ID" /* OPTIONAL */,
    RecieverIdentifierType: 11 /* OPTIONAL */,
    Remarks: "Remarks" /* OPTIONAL */,
    Occasion: "Ocassion" /* OPTIONAL */,
  })
  .then((response) => {
    //Do something with the response
    //eg
    console.log(response);
  })
  .catch((error) => {
    //Do something with the error;
    //eg
    console.error(error);
  });
```

1.  Initiator - This is the credential/username used to authenticate the transaction request.
2.  TransactionID - Organization Receiving the funds.
3.  Amount - The Amount To Be Reversed
4.  PartyA - Organization/MSISDN sending the transaction.
5.  RecieverIdentifierType - Type of organization receiving the transaction. Default is `11`
6.  ResultURL - The path that stores information of transaction.
7.  QueueTimeOutURL - The path that stores information of time out transaction.
8.  Remarks - Comments that are sent along with the transaction.
9.  Occasion - Optional.
10. Command ID - Default is `TransactionReversal`

| Name                                               | Role        |
| -------------------------------------------------- | ----------- |
| [Newton Munene](https://github.com/newtonmunene99) | Contributor |
| [Aubrey O](https://github.com/au6rey)              | Contributor |

