
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MockTokenModule = buildModule("MockTokenModule", (m) => {
  const mockToken = m.contract("MockToken");
  return { mockToken };
});

export default MockTokenModule;
