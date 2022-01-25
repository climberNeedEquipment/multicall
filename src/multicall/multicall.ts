import { getDefaultProvider } from 'ethers'
import { Interface } from '@ethersproject/abi'
import { Contract } from '@ethersproject/contracts'
import { chunkArray } from '../utils';
import { multicallContracts } from '../config'

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
        throw new Error(`No multicall defined for chainId ${chainId}.`);
    }
    // setup contracts
    const multicallContract = new Contract(multicallAddress, MulticallBuild.abi, provider);
    const itf = new Interface(abi);
    // chunk calls to prevent RPC overflow
    const chunkedCalls = chunkArray(calls, maxCallsPerTx);
    // Process calls
    let finalData: any[] = []
    for (const currentCalls of chunkedCalls) {
        const calldata = currentCalls.map((call) => [call.address.toLowerCase(), itf.encodeFunctionData(call.functionName, call.params)])
        const { returnData } = await multicallContract.callStatic.aggregate(calldata);
        const res = returnData.map((data: any, i: number) => itf.decodeFunctionResult(currentCalls[i].functionName, data))
        finalData = [...finalData, ...res];
    }

    return finalData
}

export interface AbiCall {
    address: string // Address of the contract
    functionName: string // Function name on the contract (example: balanceOf)
    params?: any[] // Function params
    abi: any[] // Abi of the call to make 
}


/**
 * Batch multiple calls to contracts with the same abi to reduce rpc calls and increase response time. 
 * 
 * @param rpcUrl Url of RPC endpoint to make the call to
 * @param calls Array of AbiCall objects to run through multicall
 * @param maxCallsPerTx (default 1000) limit the number of calls per multicall call 
 * @returns Array of array of return values from each call. Index 0 is the first return value and so on.
 */
export async function multicallDynamicAbi(
    rpcUrl: string,
    calls: AbiCall[], 
    maxCallsPerTx = 1000
): Promise<any[][] | undefined> {
    // setup provider
    const provider = getDefaultProvider(rpcUrl);
    const { chainId } = await provider.getNetwork();
    const multicallAddress = multicallContracts[chainId];

    if(multicallAddress == undefined) {
        // No contract deployed for chainId
        throw new Error(`No multicall defined for chainId ${chainId}.`);
    }
    // setup contracts
    const multicallContract = new Contract(multicallAddress, MulticallBuild.abi, provider);
    // chunk calls to prevent RPC overflow
    const chunkedCalls = chunkArray(calls, maxCallsPerTx);
    // Process calls
    let finalData: any[] = [];
    for (let index = 0; index < chunkedCalls.length; index++) {
        const currentCalls = chunkedCalls[index];
        const currentInterfaces = currentCalls.map((currentCall) => new Interface(currentCall.abi));
        const calldata = currentCalls.map((call, i) => [call.address.toLowerCase(), currentInterfaces[i].encodeFunctionData(call.functionName, call.params)]);
        const { returnData } = await multicallContract.callStatic.aggregate(calldata);
        const res = returnData.map((data: any, i: number) => currentInterfaces[i].decodeFunctionResult(currentCalls[i].functionName, data));
        finalData = [...finalData, ...res];
    }

    return finalData
}

