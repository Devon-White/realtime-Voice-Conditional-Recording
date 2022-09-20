import {Voice} from "@signalwire/realtime-api";

const sleep = (seconds) => new Promise(resolve => setTimeout(resolve, seconds*1000))

const client = new Voice.Client({
  project: "Project ID Here",
  token: "Auth Token Here",
  contexts: ["test"],
});


// Initiate Logic on Call Received
client.on("call.received", async (call) => {
  try {
    await call.answer();
    console.log(tester);

    console.log("Inbound call answered");
    console.log(call.id);
    const thing = await call.playTTS({text: "Welcome to SignalWire!"});
    await thing.waitForEnded();
    await Menu(call);
  } catch (error) {
    console.error("Error answering inbound call", error);
  }}
)


  // Function For connecting Call
  async function connect_call(call, plan) {

    console.log(plan)
    let peer = await call.connect(plan);
    console.log(call.id);
    console.log(peer.id);
    const recording = await call.recordAudio({
      beep: true,
      direction: "both",
      terminators: '#',
      endSilenceTimeout: 20
    });
    console.log("Recording Started")
    console.log(recording)
    const peer1_say = await call.playTTS({text: "You are peer 1"});
    await peer1_say.waitForEnded();
    const peer2_say = await peer.playTTS({text: "You are peer 2. Please Say. I am peer 2"});
    await peer2_say.waitForEnded();
    await sleep(10);
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
    let from_num = call.from;
    let to_phone = "PSTN Number you wish to dial too";
    let from_sip = `sip:${from_num}@subdomainhere.sip.signalwire.com`;
    let to_sip = "sip:resourcenamehere@subdomainhere.sip.signalwire.com";

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
    if (type === "no_input" || type === "no_match") {
    const invalid_response = await call.playTTS({text: "We did not receive a valid response."});
    await invalid_response.waitForEnded();
    await Menu(call);

    }
    else {
      console.log(prompt.result.params.text);
      let say_result = prompt.result.params.text;



    // If response is Alpha we connect them to our PSTN plan (which for this demo is used to dial out to a Verto Endpoint)
    if (await say_result === "Alpha") {
        let plan = new Voice.DeviceBuilder().add(
    Voice.DeviceBuilder.Phone({
      from: `${from_num}`,
      to: `${to_phone}`,
      timeout: 30,
    })
    );
        await connect_call(call, plan);
  }


    // If Response is Beta we connect them to the SIP plan
    else if (say_result === "beta") {
        let plan = new Voice.DeviceBuilder().add(
    Voice.DeviceBuilder.Sip({
      from: `${from_sip}`,
      to: `${to_sip}`,
      timeout: 30,
    })
);
        await connect_call(call, plan);
    }

    // If we do not see a matching response, prompt menu again to allow resubmission of response
    else {
      tester = "We have changed"
      const retry = await call.playTTS({text: "Sorry, we did not recognize your response."});
      await retry.waitForEnded();
      await Menu(call);

    }}}

