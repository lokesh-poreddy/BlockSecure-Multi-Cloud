import { beforeEach, describe, expect, it } from 'vitest';
import { initSimnet } from '@hirosystems/clarinet-sdk';
import { bufferCV, stringAsciiCV, uintCV } from '@stacks/transactions';

describe('blocksecure-logs contract', () => {
  let simnet: any;
  let accounts: any;
  let deployer: any;
  const contract = 'blocksecure-logs';

  beforeEach(async () => {
    simnet = await initSimnet();
    accounts = simnet.getAccounts();
    deployer = accounts.get('deployer')!;
  });

  it('can store and verify log hash', async () => {
    const testHash = '0x1234567890abcdef';
    const logId = 'test-log-1';
    const timestamp = 1661817600;

    const block = simnet.mineBlock([
      {
        'method': 'store-log-hash',
        'args': [
          bufferCV(Buffer.from(testHash.slice(2), 'hex')),
          stringAsciiCV(logId),
          uintCV(timestamp)
        ],
        'sender': deployer
      }
    ]);

    expect(block.receipts[0].result).toBe('(ok true)');

    // Verify log exists
    const verifyResult = simnet.callReadOnlyFn(
      contract,
      'verify-log-hash',
      [bufferCV(Buffer.from(testHash.slice(2), 'hex'))],
      deployer
    );
    expect(verifyResult.result).toBe('(ok true)');

    // Get log timestamp
    const timestampResult = simnet.callReadOnlyFn(
      contract,
      'get-log-timestamp',
      [bufferCV(Buffer.from(testHash.slice(2), 'hex'))],
      deployer
    );
    expect(timestampResult.result).toBe(`(ok u${timestamp})`);
  });

  it('cannot store duplicate log hash', async () => {
    const testHash = '0x1234567890abcdef';
    const logId = 'test-log-1';
    const timestamp = 1661817600;
    
    // First store should succeed
    let block = simnet.mineBlock([
      {
        'method': 'store-log-hash',
        'args': [
          bufferCV(Buffer.from(testHash.slice(2), 'hex')),
          stringAsciiCV(logId),
          uintCV(timestamp)
        ],
        'sender': deployer
      }
    ]);
    expect(block.receipts[0].result).toBe('(ok true)');
    
    // Second store with same hash should fail
    block = simnet.mineBlock([
      {
        'method': 'store-log-hash',
        'args': [
          bufferCV(Buffer.from(testHash.slice(2), 'hex')),
          stringAsciiCV('different-log'),
          uintCV(timestamp + 1)
        ],
        'sender': deployer
      }
    ]);
    expect(block.receipts[0].result).toBe('(err u403)');
  });
});
