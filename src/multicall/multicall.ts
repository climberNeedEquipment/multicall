import { getDefaultProvider } from 'ethers'
import { Interface } from '@ethersproject/abi'
import { Contract } from '@ethersproject/contracts'
import { chunkArray } from '../utils';
import { multicallContracts } from '../config/contracts'

import MulticallBuild from './Multicall.json'

export interface Call {
    address: string // Address of the contract
    functionName: string // Function name on the contract (example: balanceOf)
    params?: any[] // Function params
}

/**
 * Batch multiple calls to contracts with the same abi to reduce rpc calls and increase response time. 
 * 
 * @param rpcUrl Url of RPC endpoint to make the call to
 * @param abi abi generated from the contract code 
 * @param calls Array of Call objects to run through multicall
 * @param maxCallsPerTx (default 1000) limit the number of calls per multicall call 
 * @returns Array of array of return values from each call. Index 0 is the first return value and so on.
 */
export async function multicall(
    rpcUrl: string,
    abi: any[], 
    calls: Call[], 
    maxCallsPerTx = 1000
): Promise<any[][] | undefined> {
    // setup provider
    const provider = getDefaultProvider(rpcUrl);
    const { chainId } = await provider.getNetwork();
    const multicallAddress = multicallContracts[chainId];

    if(multicallAddress == undefined) {
        // No contract deployed for chainId
        return undefined;
    }
    // setup contracts
    const multicallContract = new Contract(multicallAddress, MulticallBuild.abi, provider);
    const itf = new Interface(abi);
    //
    const chunkedCalls = chunkArray(calls, maxCallsPerTx);

    let finalData: any[] = []
    for (const currentCalls of chunkedCalls) {
        const calldata = currentCalls.map((call) => [call.address.toLowerCase(), itf.encodeFunctionData(call.functionName, call.params)])
        const { returnData } = await multicallContract.callStatic.aggregate(calldata);
        const res = returnData.map((call: any, i: number) => itf.decodeFunctionResult(currentCalls[i].functionName, call))
        finalData = [...finalData, ...res];
    }

    return finalData
}

