export default async function getBalance(address, provider) {
    const balance = await provider.getBalance(address);
    return balance.toString();
}