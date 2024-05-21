import OpenAI from "openai";
import getBalance from "./getBalance";



const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const openai = new OpenAI({apiKey:API_KEY, dangerouslyAllowBrowser: true});


export default async function runConversation(address, provider, message) {
      // Step 1: send the conversation and available functions to the model
    const messages = [
        { role: "user", content: message },
    ];

    async function wgetBalance(address) {
      return await getBalance(address, provider);
    }

    const tools = [
        {
          type: "function",
          function: {
            name: "get_balance",
            description: "Get the current address balance",
            parameters: {
              type: "object",
              properties: {
                address: {
                  type: "string",
                  description: `The address of the address to retrieve the balanche, e.g: ${address}`,
                },
              },
              required: ["address"],
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
            get_balance: wgetBalance,
        };
        
        messages.push(responseMessage);

    for (const toolCall of toolCalls) {
        const functionName = toolCall.function.name;
        const functionToCall = availableFunctions[functionName];
        const functionArgs = JSON.parse(toolCall.function.arguments);
        const functionResponse = await functionToCall(
            functionArgs.address,
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
        return secondResponse.choices[0].message.content;
        }
    }
}