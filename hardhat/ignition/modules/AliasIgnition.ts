// AliasModule.js
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const AliasModule = buildModule("AliasModule", (m) => {
  const alias = m.contract("Alias");
  return { alias };
});

export default AliasModule;
