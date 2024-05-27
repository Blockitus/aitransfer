// AliasModule.js
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const AggregatorModule = buildModule("TokenAggregator", (m) => {
  const aggregator = m.contract("TokenAggregator");
  return { aggregator };
});

export default AggregatorModule;

