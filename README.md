to run 

```
git clone https://github.com/sambino5000/cashserver
```

install with npm
```
npm i
```

or yarn
```
yarn
```

run server

```
npm run start
```


enpoint params for Escrow participants are in this order <arbiter, seller, buyer>


try with curl:

```
curl
http://localhost:2323/escrow/ecash:qz5mxk2zjmy9ar85k0m7zcrfqqpcjj99qs22rwzxzx,ecash:qqu2ghz669cqcx2j6f55h2ljdldcw383u57np2lezu,ecash:qz5mxk2zjmy9ar85k0m7zcrfqqpcjj99qs22rwzxzx
```

spending from this covenant address will require you to build a transaction with your
prefered transaction builder 
once funds are locked to this address they may only be sent to buyer or seller.
Adding more that one utxo to this addresss may make funds unspendable
