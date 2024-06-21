const contractABI = [
    {
        "inputs": [],
        "name": "contribute",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_goal",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_deadline",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "string",
                "name": "info",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "DebugInfo",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "refund",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "contributions",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "contributors",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "deadline",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getBalance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getContributorsCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "goal",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalFunds",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];





const contractAddress = '0xf9a756893856c20Ff9695AfB21794dEE45b33D04'; // 更新為你的合約地址
const targetNetworkId = '11155111'; // Sepolia 網絡 ID
let web3;
let contract;

window.addEventListener('load', async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        ethereum.on('accountsChanged', handleAccountsChanged);
        ethereum.on('chainChanged', handleChainChanged);
        checkMetaMaskConnection();
    } else if (window.web3) {
        web3 = new Web3(web3.currentProvider);
        checkMetaMaskConnection();
    } else {
        console.log('請安裝 MetaMask 錢包擴充套件');
        showPopup('請安裝 MetaMask 錢包擴充套件');
    }
});

async function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        showPopup('請連接 MetaMask 錢包');
    } else {
        contract = new web3.eth.Contract(contractABI, contractAddress);
        hidePopup();
        updateUI();
    }
}

async function handleChainChanged(chainId) {
    if (chainId !== targetNetworkId) {
        showPopup('當前並非Sepolia 測試鏈，請連接至 Sepolia 測試鏈');
    } else {
        hidePopup();
        updateUI();
    }
}

async function checkMetaMaskConnection() {
    try {
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        const chainId = await ethereum.request({ method: 'net_version' });

        if (accounts.length > 0 && chainId === targetNetworkId) {
            contract = new web3.eth.Contract(contractABI, contractAddress);
            hidePopup();
            updateUI();
        } else if (chainId !== targetNetworkId) {
            showPopup('請將MetaMask連接至 Sepolia 測試網絡');
        } else {
            showPopup('請連接 MetaMask 錢包');
        }
    } catch (error) {
        console.error("你沒有權限訪問你的錢包: ", error);
        showPopup('你沒有權限訪問你的錢包');
    }
}

async function connectMetaMask() {
    try {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const chainId = await ethereum.request({ method: 'net_version' });

        if (accounts.length > 0 && chainId === targetNetworkId) {
            contract = new web3.eth.Contract(contractABI, contractAddress);
            hidePopup();
            updateUI();
        } else if (chainId !== targetNetworkId) {
            showPopup('請將MetaMask連接至 Sepolia 測試網絡');
        }
    } catch (error) {
        console.error("連接 MetaMask 失敗: ", error);
    }
}

function showPopup(message) {
    const popup = document.getElementById('popup');
    popup.querySelector('.popup-content p').textContent = message;
    popup.style.display = 'flex';
}

function hidePopup() {
    document.getElementById('popup').style.display = 'none';
}

async function contribute() {
    try {
        const accounts = await web3.eth.getAccounts();
        const amount = document.getElementById('contributionAmount').value;

        if (amount <= 0) {
            showToast('金額請大於 0，謝謝 ! 這是捐款不是提款');
            return;
        }

        document.getElementById('loading').style.display = 'block';

        console.log(`正在嘗試捐款 ${amount} wei ， 捐款帳號 ${accounts[0]}`);
        await contract.methods.contribute().send({
            from: accounts[0],
            value: amount,
            gas: 300000
        });

        document.getElementById('loading').style.display = 'none';
        console.log("捐款成功");
        showToast('捐款成功 非常感謝您的支持 !');
        updateUI();
    } catch (error) {
        document.getElementById('loading').style.display = 'none';
        console.error("捐款失敗: ", error);
        showToast('捐款失敗，請重新操作一次');
    }
}

async function withdraw() {
    try {
        const accounts = await web3.eth.getAccounts();
        const currentDate = new Date();
        const deadline = new Date('2024-06-30');

        if (currentDate < deadline) {
            showToast('目前還不能提款，請等到截止日期後再提款');
            return;
        }

        console.log(`正在嘗試提款到 ${accounts[0]}`);
        await contract.methods.withdraw().send({ from: accounts[0], gas: 300000 });
        console.log("提款成功");
        showToast('提款成功! 請查看您的錢包');
        updateUI();
    } catch (error) {
        console.error("提款失敗: ", error);
        showToast('提款失敗，請重新操作一次');
    }
}

async function refund() {
    try {
        const accounts = await web3.eth.getAccounts();
        const currentDate = new Date();
        const deadline = new Date('2024-06-30');

        if (currentDate < deadline) {
            showToast('目前還不能退款，請等到截止日期後再退款');
            return;
        }

        console.log(`正在嘗試退款到 ${accounts[0]}`);
        await contract.methods.refund().send({ from: accounts[0], gas: 300000 });
        console.log("退款成功");
        showToast('退款成功! 請查看您的錢包');
        updateUI();
    } catch (error) {
        console.error("退款失敗: ", error);
        showToast('退款失敗，請重新操作一次');
    }
}

async function updateUI() {
    try {
        const totalFundsBigInt = await contract.methods.totalFunds().call();
        const totalFunds = Number(totalFundsBigInt);
        document.getElementById('totalFunds').innerText = totalFunds;

        const contributorsCountBigInt = await contract.methods.getContributorsCount().call();
        const contributorsCount = Number(contributorsCountBigInt);
        document.getElementById('contributorsCount').innerText = contributorsCount;

        const goal = 5000;
        const progress = (totalFunds / goal) * 100;
        document.getElementById('progressBar').style.width = `${progress}%`;
    } catch (error) {
        console.error("ui更新錯誤: ", error);
    }
}

async function checkDeadline() {
    try {
        const deadlineBigInt = await contract.methods.deadline().call();
        const deadline = Number(deadlineBigInt);
        console.log("截止日期: ", new Date(deadline * 1000));
    } catch (error) {
        console.error("目前無法獲取截止日期: ", error);
    }
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}
