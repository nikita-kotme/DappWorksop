Below is a step-by-step, copy-paste friendly guide to build a fully working Ethereum DApp (Task Manager) using:
•	Hardhat
•	Solidity
•	Ethers.js
•	React
•	MetaMask
________________________________________
 FULL DAPP DEVELOPMENT (STEP-BY-STEP)
________________________________________
PHASE 1: PROJECT SETUP (15–20 min)
✅ Step 1: Create Project Folder
mkdir dapp-workshop
cd dapp-workshop
________________________________________
✅ Step 2: Initialize Node Project
npm init -y
________________________________________
✅ Step 3: Install Hardhat
npm install --save-dev hardhat
________________________________________
✅ Step 4: Initialize Hardhat
npx hardhat --init
👉 Choose:
•	“Create a basic sample project”
•	Press Enter for all defaults
________________________________________
✅ Step 5: Install Dependencies
npm install --save-dev @nomicfoundation/hardhat-toolbox dotenv
________________________________________
✅ Step 6: Fix ES Module Issue (IMPORTANT)
👉 Open package.json
❌ REMOVE this line if present:
"type": "module"
________________________________________
PHASE 2: ENV + CONFIG (10 min)
✅ Step 7: Create .env
touch .env
Add:
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
PRIVATE_KEY=YOUR_WALLET_PRIVATE_KEY
________________________________________
✅ Step 8: Update Hardhat Config
👉 Open hardhat.config.js
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
const { SEPOLIA_RPC_URL, PRIVATE_KEY } = process.env;
module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
    },
  },
};
________________________________________
PHASE 3: SMART CONTRACT (20 min)
✅ Step 9: Create Contract File
Path:
contracts/TaskManager.sol
________________________________________
✅ Step 10: Add Contract Code
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
contract TaskManager {
    struct Task {
        uint id;
        string content;
        bool completed;
    }
    uint public taskCount = 0;
    mapping(uint => Task) public tasks;
    function createTask(string memory _content) public {
        taskCount++;
        tasks[taskCount] = Task(taskCount, _content, false);
    }
    function toggleCompleted(uint _id) public {
        Task memory _task = tasks[_id];
        _task.completed = !_task.completed;
        tasks[_id] = _task;
    }
}
________________________________________
✅ Step 11: Compile Contract
npx hardhat compile
✅ You should see: Compilation successful
________________________________________
PHASE 4: DEPLOYMENT (20 min)
✅ Step 12: Create Deploy Script
Path:
scripts/deploy.js
________________________________________
✅ Step 13: Add Code
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
________________________________________
✅ Step 14: Get Sepolia ETH
•	Open MetaMask
•	Switch to Sepolia
•	Use faucet (Google: “Sepolia faucet”)
________________________________________
✅ Step 15: Deploy Contract
npx hardhat run scripts/deploy.js --network sepolia
✅ Output:
Contract deployed to: 0xABC123...
👉 SAVE THIS ADDRESS
________________________________________
PHASE 5: FRONTEND (30–40 min)
________________________________________
✅ Step 16: Create React App
npx create-react-app client
cd client
npm install ethers
________________________________________
✅ Step 17: Clean App
Delete:
•	App.css
•	logo.svg
________________________________________
✅ Step 18: Replace src/App.js
import { useState, useEffect } from "react";
import { ethers } from "ethers";
const contractAddress = "0xF54D4F72705b9272Cf08c97258Cdbcb51641c26B";
const abi = [
  "function createTask(string memory _content)",
  "function taskCount() view returns (uint)",
  "function tasks(uint) view returns (uint, string memory, bool)",
  "function toggleCompleted(uint _id)"
];
function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  async function connectWallet() {
    const { ethereum } = window;
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    setAccount(accounts[0]);
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    setContract(contract);
  }
  async function loadTasks() {
    const count = await contract.taskCount();
    let temp = [];
    for (let i = 1; i <= count; i++) {
      const task = await contract.tasks(i);
      temp.push(task);
    }
    setTasks(temp);
  }
  async function addTask() {
    const tx = await contract.createTask(input);
    await tx.wait();
    setInput("");
    loadTasks();
  }
  async function toggle(id) {
    const tx = await contract.toggleCompleted(id);
    await tx.wait();
    loadTasks();
  }
  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h1> Task Manager DApp</h1>
      <button onClick={connectWallet}>Connect Wallet</button>
      <br /><br />
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter task"
      />
      <button onClick={addTask}>Add</button>
      <br /><br />
      <button onClick={loadTasks}>Load Tasks</button>
      {tasks.map((t, i) => (
        <div key={i}>
          <p>
             {t[1]} - {t[2] ? "✅" : "❌"}
          </p>
         <button onClick={() => toggle(t[0])}>Toggle</button>
        </div>
      ))}
    </div>
  );
}

export default App;
________________________________________
✅ Step 19: Run Frontend
npm start
________________________________________
FINAL OUTPUT
Students can:
•	Connect MetaMask
•	Add tasks
•	Toggle completion
•	See blockchain transactions
________________________________________
