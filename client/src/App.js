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
      <h1>🚀 Task Manager DApp</h1>

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