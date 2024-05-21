import { ethers } from "ethers";

async function injectProvider () {
    let provider = window.ethereum;
    if (provider !== undefined) {
        try {
            //const provider = new ethers.providers.Web3Provider(window.ethereum)
            const walletProvider = new ethers.BrowserProvider(provider);
            await walletProvider.send("eth_requestAccounts", []);
            return (walletProvider);
        }
        catch (error) {
            if (error.code === 4001) {
                alert("The user rejected the request.");
            }
            throw(error);
        }
    } else {
        alert("You need to install a Provider. Try with Metamask.");
    }
}

export default injectProvider;