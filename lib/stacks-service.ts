import { 
  makeContractCall, 
  bufferCVFromString,
  stringAsciiCV,
  uintCV,
  AnchorMode
} from '@stacks/transactions';
import { userSession, network } from '../components/wallet-provider';

// Types for Stacks blockchain interactions
type ContractResponse = {
  okay: boolean;
  result: string;
  txid?: string;
};

// Stacks API configuration
const config = {
  apiBase: 'https://stacks-node-api.testnet.stacks.co',
  contractAddress: 'ST332M323FXZDSTYRNDJ6PRJJFQANEY423QMDAA13',
  contractName: 'blocksecure-logs',
} as const;

// Using network from wallet provider to ensure consistency

/**
 * Service for interacting with the Stacks blockchain
 */
export class StacksService {
  /**
   * Store a log hash on the blockchain
   * @param logHash The hash of the log to store
   * @param logId Unique identifier for the log
   * @param timestamp Unix timestamp when the log was created
   */
  async storeLogHash(logHash: string, logId: string, timestamp: number): Promise<string> {
    try {
      if (!userSession.isUserSignedIn()) {
        throw new Error('User not signed in');
      }

      const userData = userSession.loadUserData();
      const functionArgs = [
        bufferCVFromString(logHash),
        stringAsciiCV(logId),
        uintCV(timestamp)
      ];

      const options = {
        network,
        anchorMode: AnchorMode.Any,
        functionArgs,
        contractAddress: config.contractAddress,
        contractName: config.contractName,
        functionName: 'store-log-hash',
        senderKey: userData.profile.stxPrivateKey,
        validateWithAbi: true,
        sponsored: false,
      };

      const transaction = await makeContractCall(options);
      
      // Broadcast the transaction to the network
      const result = await fetch(`${config.apiBase}/v2/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction.serialize()),
      });

      if (!result.ok) {
        throw new Error('Failed to broadcast transaction');
      }

      const broadcastResult = await result.json();
      return broadcastResult.txid;

    } catch (error) {
      console.error('Error storing log hash:', error);
      throw error;
    }
  }

  /**
   * Verify if a log hash exists on the blockchain
   * @param logHash The hash to verify
   */
  async verifyLogHash(logHash: string): Promise<boolean> {
    try {
      const response = await fetch(
        `${config.apiBase}/v2/contracts/call-read/${config.contractAddress}/${config.contractName}/verify-log-hash`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sender: config.contractAddress,
            arguments: [logHash]
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to verify log hash: ${response.statusText}`);
      }

      const result = await response.json() as ContractResponse;
      return result.okay && result.result === 'true';
    } catch (error) {
      console.error('Error verifying log hash:', error);
      throw error;
    }
  }

  /**
   * Get the timestamp when a log hash was stored
   * @param logHash The hash to lookup
   */
  async getLogTimestamp(logHash: string): Promise<number | null> {
    try {
      const response = await fetch(
        `${config.apiBase}/v2/contracts/call-read/${config.contractAddress}/${config.contractName}/get-log-timestamp`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sender: config.contractAddress,
            arguments: [logHash]
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to get log timestamp: ${response.statusText}`);
      }

      const result = await response.json() as ContractResponse;
      
      if (!result.okay) {
        return null;
      }

      const timestamp = parseInt(result.result.replace(/['"]/g, ''));
      return isNaN(timestamp) ? null : timestamp;
    } catch (error) {
      console.error('Error getting log timestamp:', error);
      throw error;
    }
  }
}

/**
 * Default instance for the Stacks service
 */
export const defaultStacksService = new StacksService();
