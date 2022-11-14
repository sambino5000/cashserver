"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const libauth_1 = require("@bitauth/libauth");
const index_1 = require("./contracts/index");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.param('addr', async (req, res, next, addr) => {
    // const pkhashes = await req.params.addr.split(',');
    const addrs = await req.params.addr.split(',');
    const arbiter = (0, libauth_1.binToHex)((0, libauth_1.decodeCashAddress)(addrs[0]).hash);
    const seller = (0, libauth_1.binToHex)((0, libauth_1.decodeCashAddress)(addrs[1]).hash);
    const buyer = (0, libauth_1.binToHex)((0, libauth_1.decodeCashAddress)(addrs[2]).hash);
    console.log("arbiter.length", arbiter.length);
    console.log("seller.length", seller.length);
    console.log("buyer.length", buyer.length);
    // console.log("buyer",buyer.trim())
    try {
        const getContract = await (0, index_1.getEscowContract)(arbiter.trim(), seller.trim(), buyer.trim());
        const resObj = {
            contractAddr: getContract.contract.address,
            arbiter: (0, libauth_1.encodeCashAddress)("ecash", 0, (0, libauth_1.hexToBin)(arbiter)),
            seller: (0, libauth_1.encodeCashAddress)("ecash", 0, (0, libauth_1.hexToBin)(seller)),
            buyer: (0, libauth_1.encodeCashAddress)("ecash", 0, (0, libauth_1.hexToBin)(buyer)),
            contract: getContract.contract,
        };
        //    console.log("args!");
        res.send(resObj);
    }
    catch (error) {
        return next(error);
    }
});
// app.get("/escrow/:addr", async (req, res,next, addr) => {
app.get("/escrow/:addr", async (req, res, next, addr) => {
});
app.listen(2323);
// })()
