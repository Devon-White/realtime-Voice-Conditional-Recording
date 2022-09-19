import {Voice} from "@signalwire/realtime-api";

// Creates a sleep function to wait X seconds before moving to next task
const sleep = (seconds) => new Promise(resolve => setTimeout(resolve, seconds*1000))



// Establishing our Client
const client = new Voice.Client({
  project: "Project ID Here",
  token: "Auth Token Here",
  contexts: ["test"],
});

// Set your From and To numbers Here
let from_num = "Number you wish to Dial From";
let to_phone = "PSTN Number you wish to dial too";
let from_sip =`sip:${from_num}@subdomainhere.sip.signalwire.com`;
let to_sip = "sip:resourcenamehere@subdomainhere.sip.signalwire.com";


// Plan 1 to call out to a PSTN number
let plan_1 = new Voice.DeviceBuilder().add(
Voice.DeviceBuilder.Phone({
  from: `${from_num}`,
  to: `${to_phone}`,
  timeout: 30,
})
);

// Plan 2 to call out to a SIP number
let plan_2 = new Voice.DeviceBuilder().add(
Voice.DeviceBuilder.Sip({
  from: `${from_sip}`,
  to: `${to_sip}`,
  timeout: 30,
})
);


// Initiates Logic on Call Received
client.on("call.received", async (call) => {
  try {
    await call.answer();
    console.log("Inbound call answered");
    const thing = await call.playTTS({text: "Welcome to SignalWire!"});
    await thing.waitForEnded();
    await Menu(call);
  } catch (error) {
    console.error("Error answering inbound call", error);
  }}
)


  // Function For connecting Call, starting recording, and playTTS to both Peers of the call
  async function connect_call(call, plan) {
    let peer = await call.connect(plan);
    const recording = await call.recordAudio({
      beep: true,
      direction: "both",
      terminators: '#',
      endSilenceTimeout: 20
    });
    console.log("Recording Started")
    const peer1_say = await call.playTTS({text: "You are peer 1"});
    await peer1_say.waitForEnded();
    const peer2_say = await peer.playTTS({text: "You are peer 2. Please Say. I am peer 2"});
    await peer2_say.waitForEnded();
    await sleep(5)
    const end_say = await peer.playTTS({text: "Ending Call and Saving Recording."});
    await end_say.waitForEnded();
    peer.hangup();
    const goodbye_say = await call.playTTS({text: "The peer disconnected"});
    await goodbye_say.waitForEnded();
    await recording.stop();
    await call.hangup();
    console.log(recording.url);

  }
  // Function For Menu and Prompting User for speech
  async function Menu(call) {
    const prompt = await call.prompt({
     playlist: new Voice.Playlist().add(
       Voice.Playlist.TTS({ text: "Please say. Alpha. To be transferred to a. Verto endpoint. or say. Beta. To be transferred to a. SIP endpoint."})

     ),
    speech: {
      endSilenceTimeout: 1,
      speechTimeout: 60,
      language: "en-US",
      hints: [],
    },
    });

    // Waits for users response then stores the text of the response.
    const { type, speech, terminator } = await prompt.waitForResult();
    console.log(prompt.result.params.text)
    let say_result = prompt.result.params.text

    // If response is Alpha we connect them to our PSTN plan (which for this demo is used to dial out to a Verto Endpoint)
    if (await say_result === "Alpha") {
      await connect_call(call, plan_1);
  }
    // If Response is Beta we connect them to the SIP plan
    else if (say_result === "beta") {
      await connect_call(call, plan_2);
    }

    // If we do not see a matching response, prompt menu again to allow resubmission of response
    else {
      const retry = await call.playTTS({text: "Sorry, we did not recognize your response."});
      await retry.waitForEnded();
      await Menu(call);

    }}