
require('dotenv').config();
const OpenAI = require("openai");
const { ethers } = require("ethers");

const API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({apikey:API_KEY});

const provider =  new ethers.JsonRpcProvider(process.env.INFURA_API_KEY)

const myaccount = '0x8d98929F87cd5169b30b1C0be585685bF8ba1198';

async function getBalance(account) {
    const balance = await provider.getBalance(account); 
    return balance.toString();
}

getBalance(myaccount).then(console.log);

async function runConversation() {
  // Step 1: send the conversation and available functions to the model
  const messages = [
    { role: "user", content: "How much money do I have left in my account?" },
  ];
  const tools = [
    {
      type: "function",
      function: {
        name: "get_balance",
        description: "Get the current account balance",
        parameters: {
          type: "object",
          properties: {
            account: {
              type: "string",
              description: "The address of the account to retrieve the balanche, e.g:" + myaccount,
            },
          },
          required: ["account"],
        },
      },
    },
];

const response = await openai.chat.completions.create({
    model:"gpt-3.5-turbo-0125",
    messages: messages,
    tools: tools,
    tool_choice: "auto"
});
const responseMessage = response.choices[0].message;
//Step 2: check if the model wanted to call a function
const toolCalls =  responseMessage.tool_calls;
if(responseMessage.tool_calls){
    //call the function
    const availableFunctions = {
        get_balance: getBalance,
    };
    messages.push(responseMessage);
    for (const toolCall of toolCalls) {
        const functionName = toolCall.function.name;
        const functionToCall = availableFunctions[functionName];
        const functionArgs = JSON.parse(toolCall.function.arguments);
        const functionResponse = await functionToCall(
            functionArgs.account
        );
        messages.push({
            tool_call_id: toolCall.id,
            role: "tool",
            name: functionName,
            content: functionResponse
        });
        
        const secondResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-0125",
            messages: messages,
        });
        return secondResponse.choices;
    }
}


}


runConversation().then(console.log)

