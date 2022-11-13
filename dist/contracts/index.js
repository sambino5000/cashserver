"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNewContract = exports.getP2phkContract = exports.getEscowContract = exports.escrowArtifact = exports.p2pkhArtifact = exports.codeEscrow = exports.codep2pkh = exports.codeEscrowTip = exports.WebTip = exports.log = void 0;
// import { useWatch$, useStore } from '@builder.io/qwik';
const chronik_client_1 = require("chronik-client");
// import { ChronikNetworkProvider, NetworkProvider, Argument, Contract } from '@samrock5000/cashscript'
const cashscript_1 = require("@samrock5000/cashscript");
const index_1 = require("../services/index");
const cashc_1 = require("cashc");
exports.log = console.log;
exports.WebTip = (`pragma cashscript ^0.6.5;
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
    }`);
exports.codeEscrowTip = (`pragma cashscript 0.6.5;
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
exports.codep2pkh = (`pragma cashscript ^0.6.5;

contract P2PKH(bytes20 pkh) {
    // Require pk to match stored pkh and signature to match
    function spend(pubkey pk, sig s) {
        require(hash160(pk) == pkh);
        require(checkSig(s, pk));
    }
}`);
exports.codeEscrow = (`pragma cashscript ^0.6.5;
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
`);
exports.p2pkhArtifact = (() => {
    const artifact = (0, cashc_1.compileString)(exports.codep2pkh);
    return artifact;
});
exports.escrowArtifact = (() => {
    const artifact = (0, cashc_1.compileString)(exports.codeEscrow);
    return artifact; //store.artifact
});
const getEscowContract = async (arbiter, seller, buyer) => {
    const chronik = new chronik_client_1.ChronikClient("https://chronik.be.cash/xec");
    const artifact = (0, exports.escrowArtifact)();
    const servProv = "901761961cdcb1642ada8e3dff0451957ef081dc";
    const args = [arbiter, seller, buyer];
    const provider = new cashscript_1.ChronikNetworkProvider("mainnet", chronik);
    const newContract = new cashscript_1.Contract(artifact, args, provider);
    const res = {
        contract: newContract,
    };
    return res;
};
exports.getEscowContract = getEscowContract;
const getP2phkContract = async () => {
    const chronik = new chronik_client_1.ChronikClient("https://chronik.be.cash/xec");
    const provider = new cashscript_1.ChronikNetworkProvider("mainnet", chronik);
    const artifact = (0, exports.p2pkhArtifact)();
    const signer = await (0, index_1.createWallet)();
    // const receipient = await createWallet()
    const args = [signer.pubkeyhashHex];
    const newContract = new cashscript_1.Contract(artifact, args, provider);
    // console.log("getContract ", newContract.address)
    const contractScriptHash = await (0, index_1.addrToScriptHash)(newContract.address);
    const res = { contract: newContract, signer: signer, /*receiver: receipient,*/ contractScriptHash: contractScriptHash };
    return res;
};
exports.getP2phkContract = getP2phkContract;
const getNewContract = async (pkh) => {
    const chronik = new chronik_client_1.ChronikClient("https://chronik.be.cash/xec");
    const provider = new cashscript_1.ChronikNetworkProvider("mainnet", chronik);
    const artifact = (0, exports.p2pkhArtifact)();
    const args = [pkh];
    const newContract = new cashscript_1.Contract(artifact, args, provider);
    // console.log("getContract ", newContract.address)
    const res = newContract;
    return res;
};
exports.getNewContract = getNewContract;
