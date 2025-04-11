import { ethers } from 'ethers';
import { Database } from './supabase-types';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
const CONTRACT_ABI = [
  {
    "inputs": [
      {"name": "electionId", "type": "bytes32"},
      {"name": "candidateId", "type": "bytes32"}
    ],
    "name": "castVote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "candidateId", "type": "bytes32"}
    ],
    "name": "getVoteCount",
    "outputs": [
      {"name": "", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "electionId", "type": "bytes32"},
      {"name": "voter", "type": "address"}
    ],
    "name": "hasUserVoted",
    "outputs": [
      {"name": "", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "voter", "type": "address"},
      {"indexed": true, "name": "electionId", "type": "bytes32"},
      {"indexed": true, "name": "candidateId", "type": "bytes32"},
      {"indexed": false, "name": "timestamp", "type": "uint256"}
    ],
    "name": "VoteCast",
    "type": "event"
  }
];

// Ganache network configuration
const GANACHE_NETWORK_CONFIG = {
  chainId: '0x539', // Hex format for chainId
  chainName: 'Ganache',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: ['http://127.0.0.1:7545']
};

export class VotingContractService {
  private contract: ethers.Contract;
  private provider: ethers.BrowserProvider;

  constructor() {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }
    
    this.provider = new ethers.BrowserProvider(window.ethereum);
    this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.provider);
  }

  async setupGanacheNetwork() {
    try {
      // Request network switch
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: GANACHE_NETWORK_CONFIG.chainId }],
      });
    } catch (switchError: any) {
      // If the network doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [GANACHE_NETWORK_CONFIG],
          });
        } catch (addError) {
          console.error('Error adding Ganache network:', addError);
          throw addError;
        }
      } else {
        console.error('Error switching to Ganache network:', switchError);
        throw switchError;
      }
    }
  }

  async castVote(electionId: string, candidateId: string): Promise<ethers.TransactionResponse> {
    try {
      // Request account access first
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      const signer = await this.provider.getSigner();
      const contractWithSigner = this.contract.connect(signer);
      
      const electionIdBytes = ethers.getBytes(ethers.id(electionId));
      const candidateIdBytes = ethers.getBytes(ethers.id(candidateId));
      
      console.log('Sending transaction with params:', {
        electionId: electionIdBytes,
        candidateId: candidateIdBytes,
        from: await signer.getAddress()
      });

      const tx = await contractWithSigner.castVote(electionIdBytes, candidateIdBytes);
      console.log('Transaction sent:', tx.hash);
      return tx;
    } catch (error) {
      console.error('Error in castVote:', error);
      throw error;
    }
  }

  async getVoteCount(candidateId: string): Promise<number> {
    const candidateIdBytes = ethers.getBytes(ethers.id(candidateId));
    const count = await this.contract.getVoteCount(candidateIdBytes);
    return Number(count);
  }

  async hasUserVoted(electionId: string, address: string): Promise<boolean> {
    try {
      // Convert electionId to bytes32
      const electionIdBytes = ethers.getBytes(ethers.id(electionId));
      
      // Ensure address is properly formatted
      const formattedAddress = ethers.getAddress(address);
      
      // Call the contract function
      return await this.contract.hasUserVoted(electionIdBytes, formattedAddress);
    } catch (error) {
      console.error('Error in hasUserVoted:', error);
      throw error;
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Election = Database['public']['Tables']['elections']['Row'];
export type Candidate = Database['public']['Tables']['candidates']['Row'];