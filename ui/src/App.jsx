import { useState } from 'react'
import MagicBox from './components/MagicBox/MagicBox';
import Connect from './components/ConnectWalletButton/ConnectWalletButton';
import TextArea from './components/TextArea/textArea';
import Title from './components/DappTitle/Title';

import injectProvider from './assets/InjectProvider';
import runConversation from './assets/runConversation';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState("");
  const [provider, setProvider] = useState(undefined);
  const [buttonState, setButtonState] = useState("Connect");
  const [address, setAddress] = useState("");
  const [signer, setSigner] = useState();
  const [response, setResponse] = useState("Waiting for OpenAI");

  async function askToConnect() { 
    try {
      const _provider = await injectProvider();
      const _signer = await _provider.getSigner();
      const _address = await _signer.getAddress();
      
      setProvider(_provider);
      setSigner(_signer);
      setAddress(_address);
      setButtonState("Connected");
    } catch (error) {
      console.error("Failed to connect", error);
    }
  } 

  const handleClick = async () => {
    setResponse(await runConversation(address, provider, prompt));
  };


  return (
    <>
    <Title/>
    <Connect address={address} buttonState={buttonState} askToConnect={askToConnect}/>
    <MagicBox prompt={prompt} setPrompt={setPrompt} handleClick={handleClick}/>
    <TextArea message={response}/>
    </>
  )
}

export default App
