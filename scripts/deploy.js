async function main() {
  const TaskManager = await ethers.getContractFactory("TaskManager");

  const contract = await TaskManager.deploy();

  // ✅ NEW WAY (Ethers v6)
  await contract.waitForDeployment();

  console.log("Contract deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});