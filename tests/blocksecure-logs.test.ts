import { beforeEach, describe, expect, it } from 'vitest';
import { initSimnet } from '@hirosystems/clarinet-sdk';
import { bufferCV } from '@stacks/transactions';

describe('blocksecure-logs contract', () => {
  let simnet: any;
  let accounts: any;
  let deployer: any;
  const contract = {
    name: 'blocksecure-logs',
    address: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
  };

  beforeEach(async () => {
    simnet = await initSimnet();
    accounts = simnet.getAccounts();
    deployer = accounts.get('deployer')!;
  });

  it('can store and verify log hash', async () => {
    const testHash = '0x1234567890abcdef';

    const block = simnet.mineBlock([
      {
        'contract': contract,
        'method': 'anchor-log',
        'args': [
          bufferCV(Buffer.from(testHash.slice(2), 'hex')),
          { type: 'none' } // Optional metadata parameter
        ],
        'sender': deployer
      }
    ]);

    expect(block.receipts[0].result).toBe('(ok true)');

    // Verify log exists
    const verifyResult = simnet.callReadOnlyFn(
      contract.name,
      'verify-log',
      [bufferCV(Buffer.from(testHash.slice(2), 'hex'))],
      deployer
    );
    expect(verifyResult.result).toContain('(ok {anchored-by:');

    // Check log exists
    const existsResult = simnet.callReadOnlyFn(
      contract.name,
      'log-exists',
      [bufferCV(Buffer.from(testHash.slice(2), 'hex'))],
      deployer
    );
    expect(existsResult.result).toBe('true');
  });

  it('cannot store duplicate log hash', async () => {
    const testHash = '0x1234567890abcdef';
    
    // First store should succeed
    let block = simnet.mineBlock([
      {
        'contract': contract,
        'method': 'anchor-log',
        'args': [
          bufferCV(Buffer.from(testHash.slice(2), 'hex')),
          { type: 'none' }
        ],
        'sender': deployer
      }
    ]);
    expect(block.receipts[0].result).toBe('(ok true)');
    
    // Second store with same hash should fail
    block = simnet.mineBlock([
      {
        'contract': contract,
        'method': 'anchor-log',
        'args': [
          bufferCV(Buffer.from(testHash.slice(2), 'hex')),
          { type: 'none' }
        ],
        'sender': deployer
      }
    ]);
    expect(block.receipts[0].result).toBe('(err u403)');
  });
});
