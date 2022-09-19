# Realtime-Voice-Conditional-Recording

## Remember to fill out the following information:

```js
let from_num = "Number you wish to Dial From";
let to_phone = "PSTN Number you wish to dial too";
let from_sip =`sip:${from_num}@subdomainhere.sip.signalwire.com`;
let to_sip = "sip:resourcenamehere@subdomainhere.sip.signalwire.com";
```

## How to Use:
Make sure to set a `SignalWire Number` to handle Incomming Calls as Relay. Then Make sure to set the `contexts` of the number as the same `contexts` in the script:

```js
const client = new Voice.Client({
  project: "Project ID",
  token: "Auth Token HERE",
  contexts: ["Put Context Here"],
```
 <img src=https://github.com/DevonWhite-SignalWire/realtime-Voice-Conditional-Recording/blob/main/static/guide_pic.PNG>
 
 ## JWT Instructions

 Next you will need to generate a JWT token for the `index.html`
 <ol>
<li> Follow the Getting Started steps in the JavaScript SDK Documentation to generate a JSON Web Token for your project.</li>
<li> Load the index.html file in your browser. You don't need to setup or run any HTTP servers, just double clicking the file or open it directly in your browser. </li>
<li> Fill in your Project ID and JWT. Click Connect and thats it! You'll now be able to dial other web browsers and SIP endpoints from your SignalWire project, as well as dial out to phone numbers. </li>
</ol>

## Making The Call

Once the JWT is generated and you are connected to your client, launch `Voice_Client`. 

Call into the number attached to your Relay Client. Once the call is answered you will be `prompted` to respond back by either saying `Alpha` or `Beta`. Say `Alpha` to connect to your `PSTN` dial_plan and say `Beta` to connect to your `SIP` dial_plan.

Once connected, the call will then proceed to Play Text-To-Speach into the call. Once the `TTS` is completed, the call will hangup the peer, complete the `recording` and then hangup the call.


