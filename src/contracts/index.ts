// import { useWatch$, useStore } from '@builder.io/qwik';
import { ChronikClient } from 'chronik-client'
// import { ChronikNetworkProvider, NetworkProvider, Argument, Contract } from '@samrock5000/cashscript'
import { ChronikNetworkProvider, NetworkProvider, Argument, Contract } from '@samrock5000/cashscript'
import { createWallet, addrToScriptHash,hash160ToCash } from '../services/index'
import { Artifact } from '@samrock5000/cashscript';

import { compileString } from 'cashc';
import type { ContractTypes } from '../interfaces/index'
export const log = console.log

export const WebTip: string = (
    `pragma cashscript ^0.6.5;
    contract WebTipper(bytes20 tipper, bytes authData, bytes20 authPkh, bytes20 recipient) {
     
        // bytes oracleMessage = bytes(authData)
    
        function claimTip(pubkey pk,datasig ds,sig s) {
            require(hash160(pk) == authPkh);       
            require(hash160(pk) == recipient);       
            require(checkSig(s, pk));
            require(checkDataSig(ds,authData, pk));
            int minerFee = 1000; // hardcoded fee     
            bytes8 amount = bytes8(int(bytes(tx.value)) - (minerFee ));       
            bytes34 recipientOutput = new OutputP2PKH(amount, recipient);
            // bytes34 reclaimOutput = new OutputP2PKH(amount, tipper);
            require(tx.hashOutputs == hash256(recipientOutput));
          
        }
        function tipperReclaim(pubkey pk, sig s) {
            require(hash160(pk) == tipper);
            require(checkSig(s, pk));
        }
    }`
    );

export const codeEscrowTip: string = (
    `pragma cashscript 0.6.5;
contract Escrow(bytes20 serviceProvider, bytes20 signer, bytes20 receiver) {
  function spend(pubkey pk, sig s) {
      require(hash160(pk) == signer);
      require(checkSig(s, pk));
      // Check that the correct amount is sent
      int minerFee = 1000; // hardcoded fee
      int serviceFee = 4000;
      bytes8 amount = bytes8(int(bytes(tx.value)) - (minerFee + serviceFee));
      //bytes8 amount2 = bytes8(serviceFee);
      bytes34 serviceProviderOutput = new OutputP2PKH(amount, serviceProvider);
      //bytes34 signerOutput = new OutputP2PKH(amount, signer);
      bytes34 receiverOutput = new OutputP2PKH(amount, receiver);
      require(tx.hashOutputs == hash256(serviceProviderOutput) || tx.hashOutputs == hash256(receiverOutput));
    
  }
}
`);

export const codep2pkh: string = (
    `pragma cashscript ^0.6.5;

contract P2PKH(bytes20 pkh) {
    // Require pk to match stored pkh and signature to match
    function spend(pubkey pk, sig s) {
        require(hash160(pk) == pkh);
        require(checkSig(s, pk));
    }
}`
);

export const codeEscrow: string = (
`pragma cashscript ^0.6.5;
contract Escrow(bytes20 arbiter, bytes20 buyer, bytes20 seller) {
    function spend(pubkey pk, sig s) {
        require(hash160(pk) == arbiter);
        require(checkSig(s, pk));
        // Check that the correct amount is sent
        int minerFee = 1000; // hardcoded fee
        int arbiterFee = 4000;
        bytes8 amount = bytes8(int(bytes(tx.value)) - (minerFee + arbiterFee));
        bytes8 amount2 = bytes8(arbiterFee);
        bytes34 arbiterOutput = new OutputP2PKH(amount2, arbiter);
        bytes34 buyerOutput = new OutputP2PKH(amount, buyer);
        bytes34 sellerOutput = new OutputP2PKH(amount, seller);
        require(tx.hashOutputs == hash256(buyerOutput + arbiterOutput) || tx.hashOutputs == hash256(sellerOutput + arbiterOutput));
      
    }
}
`
);






export const p2pkhArtifact = (() => {
    const artifact: Artifact = compileString(codep2pkh)
    return artifact
});


export const escrowArtifact = (() => {
    const artifact: Artifact = compileString(codeEscrow)
    return artifact//store.artifact
});



export const getEscowContract = async (arbiter:string, seller:string,buyer:string ): Promise<ContractTypes> => {
    const chronik = new ChronikClient("https://chronik.be.cash/xec")
    const artifact = escrowArtifact();

    const servProv = "901761961cdcb1642ada8e3dff0451957ef081dc";
    const args: Argument[] = [arbiter,seller,buyer];
    const provider: NetworkProvider = new ChronikNetworkProvider(
        "mainnet",
        chronik
    );

    const newContract = new Contract(artifact, args, provider);
 
    const res: ContractTypes = {
        contract: newContract,
    };

    return res;
};

export const getP2phkContract = async (): Promise<ContractTypes> => {
    const chronik = new ChronikClient("https://chronik.be.cash/xec");
    const provider: NetworkProvider = new ChronikNetworkProvider(
        "mainnet",
        chronik
    );


    const artifact = p2pkhArtifact();
    const signer = await createWallet();
    // const receipient = await createWallet()

    const args: Argument[] = [signer.pubkeyhashHex];



    const newContract = new Contract(artifact, args, provider);
    // console.log("getContract ", newContract.address)
    const contractScriptHash: string = await addrToScriptHash(newContract.address)
    const res: ContractTypes = { contract: newContract, signer: signer, /*receiver: receipient,*/ contractScriptHash: contractScriptHash };

    return res;
};


export const getNewContract = async (pkh: string): Promise<Contract> => {
    const chronik = new ChronikClient("https://chronik.be.cash/xec");
    const provider: NetworkProvider = new ChronikNetworkProvider(
        "mainnet",
        chronik
    );

    const artifact = p2pkhArtifact();

    const args: Argument[] = [pkh];

    const newContract = new Contract(artifact, args, provider);
    // console.log("getContract ", newContract.address)
    const res: Contract = newContract;

    return res;
}




