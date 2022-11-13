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
exports.getNewContract = exports.getP2phkContract = exports.getEscowContract = exports.escrowArtifact = exports.p2pkhArtifact = exports.codep2pkh = exports.codeEscrow = exports.WebTip = exports.log = void 0;
// import { useWatch$, useStore } from '@builder.io/qwik';
var chronik_client_1 = require("chronik-client");
// import { ChronikNetworkProvider, NetworkProvider, Argument, Contract } from '@samrock5000/cashscript'
var cashscript_1 = require("@samrock5000/cashscript");
var index_1 = require("../services/index");
var cashc_1 = require("cashc");
exports.log = console.log;
exports.WebTip = ("pragma cashscript ^0.6.5;\n    contract WebTipper(bytes20 tipper, bytes authData, bytes20 authPkh, bytes20 recipient) {\n     \n        // bytes oracleMessage = bytes(authData)\n    \n        function claimTip(pubkey pk,datasig ds,sig s) {\n            require(hash160(pk) == authPkh);       \n            require(hash160(pk) == recipient);       \n            require(checkSig(s, pk));\n            require(checkDataSig(ds,authData, pk));\n            int minerFee = 1000; // hardcoded fee     \n            bytes8 amount = bytes8(int(bytes(tx.value)) - (minerFee ));       \n            bytes34 recipientOutput = new OutputP2PKH(amount, recipient);\n            // bytes34 reclaimOutput = new OutputP2PKH(amount, tipper);\n            require(tx.hashOutputs == hash256(recipientOutput));\n          \n        }\n        function tipperReclaim(pubkey pk, sig s) {\n            require(hash160(pk) == tipper);\n            require(checkSig(s, pk));\n        }\n    }");
exports.codeEscrow = ("pragma cashscript 0.6.5;\ncontract Escrow(bytes20 serviceProvider, bytes20 signer, bytes20 receiver) {\n  function spend(pubkey pk, sig s) {\n      require(hash160(pk) == signer);\n      require(checkSig(s, pk));\n      // Check that the correct amount is sent\n      int minerFee = 1000; // hardcoded fee\n      int serviceFee = 4000;\n      bytes8 amount = bytes8(int(bytes(tx.value)) - (minerFee + serviceFee));\n      //bytes8 amount2 = bytes8(serviceFee);\n      bytes34 serviceProviderOutput = new OutputP2PKH(amount, serviceProvider);\n      //bytes34 signerOutput = new OutputP2PKH(amount, signer);\n      bytes34 receiverOutput = new OutputP2PKH(amount, receiver);\n      require(tx.hashOutputs == hash256(serviceProviderOutput) || tx.hashOutputs == hash256(receiverOutput));\n    \n  }\n}\n");
exports.codep2pkh = ("pragma cashscript ^0.6.5;\n\ncontract P2PKH(bytes20 pkh) {\n    // Require pk to match stored pkh and signature to match\n    function spend(pubkey pk, sig s) {\n        require(hash160(pk) == pkh);\n        require(checkSig(s, pk));\n    }\n}");
exports.p2pkhArtifact = (function () {
    var artifact = (0, cashc_1.compileString)(exports.codep2pkh);
    return artifact;
});
exports.escrowArtifact = (function () {
    var artifact = (0, cashc_1.compileString)(exports.codeEscrow);
    return artifact; //store.artifact
});
var getEscowContract = function () { return __awaiter(void 0, void 0, void 0, function () {
    var chronik, artifact, signer, receipient, servProv, args, provider, newContract, res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                chronik = new chronik_client_1.ChronikClient("https://chronik.be.cash/xec");
                artifact = (0, exports.escrowArtifact)();
                return [4 /*yield*/, (0, index_1.createWallet)()];
            case 1:
                signer = _a.sent();
                return [4 /*yield*/, (0, index_1.createWallet)()];
            case 2:
                receipient = _a.sent();
                servProv = "901761961cdcb1642ada8e3dff0451957ef081dc";
                args = [servProv, signer.pubkeyhashHex, receipient.pubkeyhashHex];
                provider = new cashscript_1.ChronikNetworkProvider("mainnet", chronik);
                newContract = new cashscript_1.Contract(artifact, args, provider);
                res = {
                    contract: newContract,
                    signer: signer,
                    receiver: receipient
                };
                return [2 /*return*/, res];
        }
    });
}); };
exports.getEscowContract = getEscowContract;
var getP2phkContract = function () { return __awaiter(void 0, void 0, void 0, function () {
    var chronik, provider, artifact, signer, args, newContract, contractScriptHash, res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                chronik = new chronik_client_1.ChronikClient("https://chronik.be.cash/xec");
                provider = new cashscript_1.ChronikNetworkProvider("mainnet", chronik);
                artifact = (0, exports.p2pkhArtifact)();
                return [4 /*yield*/, (0, index_1.createWallet)()];
            case 1:
                signer = _a.sent();
                args = [signer.pubkeyhashHex];
                newContract = new cashscript_1.Contract(artifact, args, provider);
                return [4 /*yield*/, (0, index_1.addrToScriptHash)(newContract.address)];
            case 2:
                contractScriptHash = _a.sent();
                res = { contract: newContract, signer: signer, /*receiver: receipient,*/ contractScriptHash: contractScriptHash };
                return [2 /*return*/, res];
        }
    });
}); };
exports.getP2phkContract = getP2phkContract;
var getNewContract = function (pkh) { return __awaiter(void 0, void 0, void 0, function () {
    var chronik, provider, artifact, args, newContract, res;
    return __generator(this, function (_a) {
        chronik = new chronik_client_1.ChronikClient("https://chronik.be.cash/xec");
        provider = new cashscript_1.ChronikNetworkProvider("mainnet", chronik);
        artifact = (0, exports.p2pkhArtifact)();
        args = [pkh];
        newContract = new cashscript_1.Contract(artifact, args, provider);
        res = newContract;
        return [2 /*return*/, res];
    });
}); };
exports.getNewContract = getNewContract;
