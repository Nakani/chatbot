const fs = require('fs');
    const util = require('util');
    const {struct} = require('pb-util');
    // Imports the Dialogflow library
    const dialogflow = require('dialogflow');

    // Instantiates a session client
    const sessionClient = new dialogflow.SessionsClient();

    // The path to identify the agent that owns the created intent.
    const sessionPath = sessionClient.sessionPath(projectId, sessionId);

    // Read the content of the audio file and send it as part of the request.
    const readFile = util.promisify(fs.readFile);
    const inputAudio = await readFile(filename);
    const request = {
      session: sessionPath,
      queryInput: {
        audioConfig: {
          audioEncoding: encoding,
          sampleRateHertz: sampleRateHertz,
          languageCode: languageCode,
        },
      },
      inputAudio: inputAudio,
    };

    // Recognizes the speech in the audio and detects its intent.
    const [response] = await sessionClient.detectIntent(request);

    console.log('Detected intent:');
    const result = response.queryResult;
    // Instantiates a context client
    const contextClient = new dialogflow.ContextsClient();

    console.log(`  Query: ${result.queryText}`);
    console.log(`  Response: ${result.fulfillmentText}`);
    if (result.intent) {
      console.log(`  Intent: ${result.intent.displayName}`);
    } else {
      console.log(`  No intent matched.`);
    }
    const parameters = JSON.stringify(struct.decode(result.parameters));
    console.log(`  Parameters: ${parameters}`);
    if (result.outputContexts && result.outputContexts.length) {
      console.log(`  Output contexts:`);
      result.outputContexts.forEach(context => {
        const contextId = contextClient.matchContextFromContextName(context.name);
        const contextParameters = JSON.stringify(
          struct.decode(context.parameters)
        );
        console.log(`    ${contextId}`);
        console.log(`      lifespan: ${context.lifespanCount}`);
        console.log(`      parameters: ${contextParameters}`);
      });
    }
