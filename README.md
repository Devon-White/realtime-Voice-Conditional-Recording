# realtime-Voice-Conditional-Recording

## Remember to fill out the following information:

```js
let from_num = "Number you wish to Dial From";
let to_phone = "PSTN Number you wish to dial too";
let from_sip =`sip:${from_num}@subdomainhere.sip.signalwire.com`;
let to_sip = "sip:resourcenamehere@subdomainhere.sip.signalwire.com";
```

## How to Use:
Make sure Set a SignalWire Number to handle Incomming Calls as Relay. Then Make sure set the `contexts` of the number as the same `contexts` in the script:

```js
const client = new Voice.Client({
  project: "Project ID",
  token: "Auth Token HERE",
  contexts: ["Put Context Here"],
```

