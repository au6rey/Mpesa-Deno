import { Mpesa } from "../src/mod.ts";
import "https://deno.land/x/dotenv/load.ts";
import {
  ConsumerKey,
  ConsumerSecret,
  SecurityCred,
  Initiator,
  PhoneNumber,
  ShortCode,
  AccountReference,
  PassKey,
  CallBackURL,
} from "./values.ts";

import {
  AccountBalanceInterface,
  B2CInterface,
  C2BRegisterInterface,
  ReversalInterface,
  StkPushInterface,
  StkQueryInterface,
  TransactionStatusInterface,
  StkPushResponseInterface,
  C2BSimulateInterface,
} from "../src/models/interfaces.ts";

import { assertExists } from "https://deno.land/std@0.96.0/testing/asserts.ts";
import { description } from "https://deno.land/x/describe/mod.ts";
import { delay } from "https://deno.land/std@0.97.0/async/delay.ts";

let lnmCheckoutRequestId: string;
const mpesa = new Mpesa(
  {
    clientKey: ConsumerKey,
    clientSecret: ConsumerSecret,
    securityCredential: SecurityCred,
  },
  "sandbox"
);

Deno.test(
  description({
    name: "Lipa Na Mpesa Online",
    given: "Correct parameters",
    should: "Pass",
  }),
  async () => {
    const input: StkPushInterface = {
      BusinessShortCode: ShortCode,
      Amount: 1,
      PartyA: PhoneNumber,
      PartyB: ShortCode.toString(),
      PhoneNumber: PhoneNumber,
      AccountReference: AccountReference,
      passKey: PassKey,
      TransactionType: "CustomerPayBillOnline",
      TransactionDesc: "Test The API",
      CallBackURL: CallBackURL,
    };

    const response: void | StkPushResponseInterface = await mpesa
      .lnmOnline(input)
      .catch((err) => console.error(err));
    if (response) {
      assertExists(response.ResponseCode);
      lnmCheckoutRequestId = response.CheckoutRequestID;
    } else throw Error("No response for Lipa Na Mpesa Online Query");
  }
);

Deno.test(
  description({
    name: "B2C",
    given: "Correct parameters",
    should: "Pass",
  }),
  async () => {
    const input: B2CInterface = {
      Initiator: Initiator,
      Amount: 1,
      PartyA: ShortCode.toString(),
      PartyB: PhoneNumber,
      CommandID: "BusinessPayment",
      QueueTimeOutURL: CallBackURL,
      ResultURL: CallBackURL,
    };

    const response = await mpesa.b2c(input).catch((err) => console.error(err));
    if (response) assertExists(response.ResponseCode);
    else throw new Error("No response for B2C");
  }
);

Deno.test(
  description({
    name: "Transaction Status",
    given: "Correct parameters",
    should: "Pass",
  }),
  async () => {
    const input: TransactionStatusInterface = {
      Initiator: Initiator,
      TransactionID: PhoneNumber,
      PartyA: ShortCode.toString(),
      CommandID: "TransactionStatusQuery",
      IdentifierType: "1",
      QueueTimeOutURL: CallBackURL,
      ResultURL: CallBackURL,
    };

    const response = await mpesa
      .transactionStatus(input)
      .catch((err) => console.error(err));
    if (response) assertExists(response.ResponseCode);
    else throw new Error("No response for Transaction Status");
  }
);

Deno.test(
  description({
    name: "Reversal",
    given: "Correct parameters",
    should: "Pass",
  }),
  async () => {
    const input: ReversalInterface = {
      Initiator: Initiator,
      TransactionID: PhoneNumber,
      CommandID: "TransactionReversal",
      Amount: 1,
      ReceiverParty: ShortCode.toString(),
      RecieverIdentifierType: "4",
      QueueTimeOutURL: CallBackURL,
      ResultURL: CallBackURL,
    };

    const response = await mpesa
      .reversal(input)
      .catch((err) => console.error(err));
    if (response) assertExists(response.ResponseCode);
    else throw new Error("No response for Reversal");
  }
);

Deno.test(
  description({
    name: "C2B Simulate",
    given: "Correct parameters",
    should: "Pass",
  }),
  async () => {
    const input: C2BSimulateInterface = {
      ShortCode: ShortCode,
      CommandID: "CustomerPayBillOnline",
      Amount: 1,
      Msisdn: parseInt(PhoneNumber),
      BillRefNumber: undefined,
    };

    const response = await mpesa
      .c2bSimulate(input)
      .catch((err) => console.error(err));
    if (response) {
      assertExists(response.ResponseDescription);
    } else throw new Error("No response for C2B Simulate");
  }
);

Deno.test(
  description({
    name: "C2B Register",
    given: "Correct parameters",
    should: "Pass",
  }),
  async () => {
    const input: C2BRegisterInterface = {
      ShortCode: ShortCode,
      ResponseType: "Cancelled",
      ConfirmationURL: CallBackURL,
      ValidationURL: CallBackURL,
    };

    const response = await mpesa
      .c2bRegister(input)
      .catch((err) => console.error(err));
    if (response) {
      assertExists(response.ResponseDescription);
    } else throw new Error("No response for C2B Register");
  }
);

Deno.test(
  description({
    name: "Account Balance",
    given: "Correct parameters",
    should: "Pass",
  }),
  async () => {
    await delay(1000);
    const input: AccountBalanceInterface = {
      Initiator: Initiator,
      PartyA: ShortCode.toString(),
      IdentifierType: "4",
      CommandID: "AccountBalance",
      QueueTimeOutURL: CallBackURL,
      ResultURL: CallBackURL,
    };

    const response = await mpesa
      .accountBalance(input)
      .catch((err) => console.error(err));
    if (response) assertExists(response.ResponseCode);
    else throw new Error("No response for Account Balance");
  }
);
Deno.test(
  description({
    name: "Lipa Na Mpesa Online Query",
    given: "Correct parameters",
    should: "Pass",
  }),
  async () => {
    await delay(15000);
    const input: StkQueryInterface = {
      BusinessShortCode: ShortCode,
      passKey: PassKey,
      CheckoutRequestID: lnmCheckoutRequestId,
    };

    const response = await mpesa
      .lnmQuery(input)
      .catch((err) => console.error(err));
    if (response) assertExists(response.ResponseCode);
    else throw new Error("No response for Online Query");
  }
);
