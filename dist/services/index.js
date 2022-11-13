"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransactionHex = exports.checkBalance = exports.createWallet = exports.sendRawTx = exports.chronikBroadcastTx = exports.hash160ToCash = exports.addrToScriptHash = exports.chronikNet = exports.chronik = exports.log = void 0;
const cashscript_1 = require("@samrock5000/cashscript");
const cashscript_2 = require("@samrock5000/cashscript");
// } from "../../localScript/module";
const randombytes_1 = __importDefault(require("randombytes"));
const chronik_client_1 = require("chronik-client");
const libauth_1 = require("@bitauth/libauth");
exports.log = console.log;
exports.chronik = new chronik_client_1.ChronikClient("https://chronik.be.cash/xec");
exports.chronikNet = new cashscript_2.ChronikNetworkProvider("mainnet", exports.chronik);
const addrToScriptHash = async (address) => {
    const addr = (0, libauth_1.cashAddressToLockingBytecode)(address);
    const addressBytecode = addr.bytecode;
    const addrContent = (0, libauth_1.lockingBytecodeToAddressContents)(addressBytecode);
    return (0, libauth_1.binToHex)(addrContent.payload);
};
exports.addrToScriptHash = addrToScriptHash;
const hash160ToCash = (hex, network = 0x00) => {
    let type = libauth_1.Base58AddressFormatVersion[network] || "p2pkh";
    let prefix = "ecash";
    if (type.endsWith("Testnet"))
        prefix = "ectest";
    let cashType = 0;
    const hexStr = hex;
    return (0, libauth_1.encodeCashAddress)(prefix, cashType, (0, libauth_1.hexToBin)(hexStr));
};
exports.hash160ToCash = hash160ToCash;
exports.chronikBroadcastTx = ((rawTx) => {
    return exports.chronik.broadcastTx(rawTx);
});
const sendRawTx = async (rawTx) => {
    try {
        const txResults = await exports.chronikNet.sendRawTransaction(rawTx);
        (0, exports.log)("txResults ", txResults);
        return txResults;
    }
    catch (error) {
        (0, exports.log)("sendRawTx failed");
        console.error(error);
        return "error in sendRawTx";
    }
};
exports.sendRawTx = sendRawTx;
const createWallet = async () => {
    const secp256k1 = await (0, libauth_1.instantiateSecp256k1)();
    const ripemd160 = await (0, libauth_1.instantiateRipemd160)();
    const sha256 = await (0, libauth_1.instantiateSha256)();
    //     const secureRandom = generatePrivateKey( () =>
    //   window.crypto.getRandomValues(new Uint8Array(32))
    // );
    const secureRandom = (0, libauth_1.generatePrivateKey)(() => (0, randombytes_1.default)(32));
    const privateKey = sha256.hash(secureRandom);
    const privKeyHex = (0, libauth_1.binToHex)(privateKey);
    const pubKey = secp256k1.derivePublicKeyCompressed(privateKey);
    const pubKeyHash = ripemd160.hash(sha256.hash(pubKey));
    const pubKeyHashHex = (0, libauth_1.binToHex)(pubKeyHash);
    const wif = (0, libauth_1.encodePrivateKeyWif)(sha256, privateKey, 'mainnet');
    const res = {
        pubkey: (0, libauth_1.binToHex)(pubKey),
        pubkeyhashHex: pubKeyHashHex,
        privkey: (0, libauth_1.binToHex)(privateKey),
        privkeyHex: privKeyHex,
        wif: wif,
    };
    return res;
};
exports.createWallet = createWallet;
const checkBalance = async (addr) => {
    if (addr === undefined) {
        (0, exports.log)("address is undefined", addr);
        return 0;
    }
    let txValue;
    let res;
    const address = addr;
    (0, exports.log)("checkBalance addr", address);
    const utxos = exports.chronikNet.getUtxos(address);
    res = await utxos;
    if (res[0].txid == null) {
        (0, exports.log)("no utxos available", res[0]);
        return res[0].satoshis;
    }
    const satoshis = await utxos.then((sats => sats.reduce((acc, utxo) => acc + utxo.satoshis, 0)));
    (0, exports.log)("checkBalance Sats ", satoshis);
    txValue = satoshis;
    res = txValue === undefined ? 0 : txValue;
    return res;
};
exports.checkBalance = checkBalance;
const createTransactionHex = async (contract, txInfo) => {
    const secp256k1 = await (0, libauth_1.instantiateSecp256k1)();
    const privKeyAssert = txInfo.signerPrivateKey;
    const privKey = (0, libauth_1.hexToBin)(privKeyAssert);
    (0, exports.log)("valid privateKey: ", secp256k1.validatePrivateKey(privKey));
    // const pubKey = hexToBin(txInfo.signerPublicKey)
    const pubKey = txInfo.signerPublicKey;
    const receiverToString = txInfo.receiverPublicKeyHash;
    const receipient = (0, exports.hash160ToCash)(receiverToString);
    const serviceProviderAddr = "ecash:qr4jd3qejeym00u6u4lrzk3p6p3fmc545yjgvknzxr";
    const utxos = contract.getUtxos();
    const satoshis = await utxos.then((sats => sats.reduce((acc, utxo) => acc + utxo.satoshis, 0)));
    const utxoLen = (await utxos).length;
    const serviceFee = 2000;
    const fee = 211 + (utxoLen * 200);
    const amount = satoshis - (fee + serviceFee);
    // log("amount ",amt)
    (0, exports.log)("txinfo", txInfo);
    // log("Contract Addr", contract.address)
    // log("receipient", receipient)
    try {
        const tx = await contract.functions
            .spend(pubKey, new cashscript_1.SignatureTemplate(privKey))
            .to(receipient, amount)
            .to(serviceProviderAddr, serviceFee)
            .build();
        // .send();
        // console.log("TX ", tx)
        // const txRes = await chronikNet.sendRawTransaction(tx)
        // log(txRes)
        return tx;
    }
    catch (error) {
        console.error(error);
        return "createTransactionHex error";
    }
};
exports.createTransactionHex = createTransactionHex;
