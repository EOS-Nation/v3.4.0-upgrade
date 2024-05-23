# eosio
cleos -u https://eos.api.eosnation.io set code eosio build/contracts/eosio.system/eosio.system.wasm -s -d --json-file actions/setcode-eosio.json --expiration 8640000
cleos -u https://eos.api.eosnation.io set abi eosio build/contracts/eosio.system/eosio.system.abi -s -d --json-file actions/setabi-eosio.json --expiration 8640000

cleos -u https://eos.api.eosnation.io set code eosio.fees build/contracts/eosio.fees/eosio.fees.wasm -s -d --json-file actions/setcode-eosio.fees.json --expiration 8640000 -p eosio.fees@owner
cleos -u https://eos.api.eosnation.io set abi eosio.fees build/contracts/eosio.fees/eosio.fees.abi -s -d --json-file actions/setabi-eosio.fees.json --expiration 8640000 -p eosio.fees@owner

cleos -u https://eos.api.eosnation.io set contract eosio build/contracts/eosio.system eosio.system.wasm eosio.system.abi -s -d --json-file actions/setcontract-eosio.json --expiration 8640000
cleos -u https://eos.api.eosnation.io set contract eosio.token build/contracts/eosio.token eosio.token.wasm eosio.token.abi -s -d --json-file actions/setcontract-eosio.token.json --expiration 8640000
cleos -u https://eos.api.eosnation.io set contract eosio.fees build/contracts/eosio.fees eosio.fees.wasm eosio.fees.abi -s -d --json-file actions/setcontract-eosio.fees.json --expiration 8640000 -p eosio.fees@owner