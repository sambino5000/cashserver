import express from 'express';
import { addressContentsToLockingBytecode, binToHex, hexToBin, decodeCashAddress,encodeCashAddress } from '@bitauth/libauth';
import { getEscowContract } from './contracts/index'
import  cors from 'cors'

const app = express();
app.use(cors())


app.param('addr', async (req, res, next, addr) => {
    // const pkhashes = await req.params.addr.split(',');
    const pkhashes = await req.params.addr.split(',');
    const arbiter = (pkhashes[0].trim())
    const seller = (pkhashes[1].trim())
    const buyer = (pkhashes[2].trim())
    console.log("arbiter.length",arbiter.length)
    console.log("seller.length",seller.length)
    console.log("buyer.length",buyer.length)
    // console.log("buyer",buyer.trim())

    try {
        const getContract = await getEscowContract(arbiter.trim(), seller.trim(), buyer.trim())
      
        const resObj = {
            contractAddr: getContract.contract.address,
            arbiter: encodeCashAddress("ecash", 0, hexToBin(arbiter)) ,
            seller:  encodeCashAddress("ecash",0,hexToBin(seller)),
            buyer: encodeCashAddress("ecash",0,hexToBin(buyer)),
            contract:getContract.contract,
            
        }
        //    console.log("args!");
        res.send(resObj)
    } catch (error) {
        return next(error)
    }
       
    })


// app.get("/escrow/:addr", async (req, res,next, addr) => {
app.get("/escrow/:addr", async (req, res, next, addr) => {




     }
    
);
app.listen(2323);
// })()

