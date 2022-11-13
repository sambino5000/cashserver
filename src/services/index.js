"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.createTransactionHex = exports.checkBalance = exports.createWallet = exports.sendRawTx = exports.chronikBroadcastTx = exports.hash160ToCash = exports.addrToScriptHash = exports.chronikNet = exports.chronik = exports.log = void 0;
var cashscript_1 = require("@samrock5000/cashscript");
var cashscript_2 = require("@samrock5000/cashscript");
// } from "../../localScript/module";
var randombytes_1 = require("randombytes");
var chronik_client_1 = require("chronik-client");
var libauth_1 = require("@bitauth/libauth");
exports.log = console.log;
exports.chronik = new chronik_client_1.ChronikClient("https://chronik.be.cash/xec");
exports.chronikNet = new cashscript_2.ChronikNetworkProvider("mainnet", exports.chronik);
var addrToScriptHash = function (address) { return __awaiter(void 0, void 0, void 0, function () {
    var addr, addressBytecode, addrContent;
    return __generator(this, function (_a) {
        addr = (0, libauth_1.cashAddressToLockingBytecode)(address);
        addressBytecode = addr.bytecode;
        addrContent = (0, libauth_1.lockingBytecodeToAddressContents)(addressBytecode);
        return [2 /*return*/, (0, libauth_1.binToHex)(addrContent.payload)];
    });
}); };
exports.addrToScriptHash = addrToScriptHash;
var hash160ToCash = function (hex, network) {
    if (network === void 0) { network = 0x00; }
    var type = libauth_1.Base58AddressFormatVersion[network] || "p2pkh";
    var prefix = "ecash";
    if (type.endsWith("Testnet"))
        prefix = "ectest";
    var cashType = 0;
    var hexStr = hex;
    return (0, libauth_1.encodeCashAddress)(prefix, cashType, (0, libauth_1.hexToBin)(hexStr));
};
exports.hash160ToCash = hash160ToCash;
exports.chronikBroadcastTx = (function (rawTx) {
    return exports.chronik.broadcastTx(rawTx);
});
var sendRawTx = function (rawTx) { return __awaiter(void 0, void 0, void 0, function () {
    var txResults, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, exports.chronikNet.sendRawTransaction(rawTx)];
            case 1:
                txResults = _a.sent();
                (0, exports.log)("txResults ", txResults);
                return [2 /*return*/, txResults];
            case 2:
                error_1 = _a.sent();
                (0, exports.log)("sendRawTx failed");
                console.error(error_1);
                return [2 /*return*/, "error in sendRawTx"];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.sendRawTx = sendRawTx;
var createWallet = function () { return __awaiter(void 0, void 0, void 0, function () {
    var secp256k1, ripemd160, sha256, secureRandom, privateKey, privKeyHex, pubKey, pubKeyHash, pubKeyHashHex, wif, res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, libauth_1.instantiateSecp256k1)()];
            case 1:
                secp256k1 = _a.sent();
                return [4 /*yield*/, (0, libauth_1.instantiateRipemd160)()];
            case 2:
                ripemd160 = _a.sent();
                return [4 /*yield*/, (0, libauth_1.instantiateSha256)()];
            case 3:
                sha256 = _a.sent();
                secureRandom = (0, libauth_1.generatePrivateKey)(function () { return (0, randombytes_1["default"])(32); });
                privateKey = sha256.hash(secureRandom);
                privKeyHex = (0, libauth_1.binToHex)(privateKey);
                pubKey = secp256k1.derivePublicKeyCompressed(privateKey);
                pubKeyHash = ripemd160.hash(sha256.hash(pubKey));
                pubKeyHashHex = (0, libauth_1.binToHex)(pubKeyHash);
                wif = (0, libauth_1.encodePrivateKeyWif)(sha256, privateKey, 'mainnet');
                res = {
                    pubkey: (0, libauth_1.binToHex)(pubKey),
                    pubkeyhashHex: pubKeyHashHex,
                    privkey: (0, libauth_1.binToHex)(privateKey),
                    privkeyHex: privKeyHex,
                    wif: wif
                };
                return [2 /*return*/, res];
        }
    });
}); };
exports.createWallet = createWallet;
var checkBalance = function (addr) { return __awaiter(void 0, void 0, void 0, function () {
    var txValue, res, address, utxos, satoshis;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (addr === undefined) {
                    (0, exports.log)("address is undefined", addr);
                    return [2 /*return*/, 0];
                }
                address = addr;
                (0, exports.log)("checkBalance addr", address);
                utxos = exports.chronikNet.getUtxos(address);
                return [4 /*yield*/, utxos];
            case 1:
                res = _a.sent();
                if (res[0].txid == null) {
                    (0, exports.log)("no utxos available", res[0]);
                    return [2 /*return*/, res[0].satoshis];
                }
                return [4 /*yield*/, utxos.then((function (sats) { return sats.reduce(function (acc, utxo) { return acc + utxo.satoshis; }, 0); }))];
            case 2:
                satoshis = _a.sent();
                (0, exports.log)("checkBalance Sats ", satoshis);
                txValue = satoshis;
                res = txValue === undefined ? 0 : txValue;
                return [2 /*return*/, res];
        }
    });
}); };
exports.checkBalance = checkBalance;
var createTransactionHex = function (contract, txInfo) { return __awaiter(void 0, void 0, void 0, function () {
    var secp256k1, privKeyAssert, privKey, pubKey, receiverToString, receipient, serviceProviderAddr, utxos, satoshis, utxoLen, serviceFee, fee, amount, tx, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, libauth_1.instantiateSecp256k1)()];
            case 1:
                secp256k1 = _a.sent();
                privKeyAssert = txInfo.signerPrivateKey;
                privKey = (0, libauth_1.hexToBin)(privKeyAssert);
                (0, exports.log)("valid privateKey: ", secp256k1.validatePrivateKey(privKey));
                pubKey = txInfo.signerPublicKey;
                receiverToString = txInfo.receiverPublicKeyHash;
                receipient = (0, exports.hash160ToCash)(receiverToString);
                serviceProviderAddr = "ecash:qr4jd3qejeym00u6u4lrzk3p6p3fmc545yjgvknzxr";
                utxos = contract.getUtxos();
                return [4 /*yield*/, utxos.then((function (sats) { return sats.reduce(function (acc, utxo) { return acc + utxo.satoshis; }, 0); }))];
            case 2:
                satoshis = _a.sent();
                return [4 /*yield*/, utxos];
            case 3:
                utxoLen = (_a.sent()).length;
                serviceFee = 2000;
                fee = 211 + (utxoLen * 200);
                amount = satoshis - (fee + serviceFee);
                // log("amount ",amt)
                (0, exports.log)("txinfo", txInfo);
                _a.label = 4;
            case 4:
                _a.trys.push([4, 6, , 7]);
                return [4 /*yield*/, contract.functions
                        .spend(pubKey, new cashscript_1["default"](privKey))
                        .to(receipient, amount)
                        .to(serviceProviderAddr, serviceFee)
                        .build()
                    // .send();
                    // console.log("TX ", tx)
                    // const txRes = await chronikNet.sendRawTransaction(tx)
                    // log(txRes)
                ];
            case 5:
                tx = _a.sent();
                // .send();
                // console.log("TX ", tx)
                // const txRes = await chronikNet.sendRawTransaction(tx)
                // log(txRes)
                return [2 /*return*/, tx];
            case 6:
                error_2 = _a.sent();
                console.error(error_2);
                return [2 /*return*/, "createTransactionHex error"];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.createTransactionHex = createTransactionHex;
