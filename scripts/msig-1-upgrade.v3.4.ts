import * as fs from "fs";
import { transaction } from "./msig-actions.js";

// setcontracts
import eosio_code from '../actions/setcode-eosio.json';
import eosio_abi from '../actions/setabi-eosio.json';
import eosio_token from '../actions/setcontract-eosio.token.json';
import eosio_fees from '../actions/setcontract-eosio.fees.json';

// 1. Deploy new system contracts
for ( const setcontract of [ eosio_code, eosio_abi, eosio_token, eosio_fees ] ) {
    transaction.actions.push(...setcontract.actions);
}

fs.writeFileSync(`actions/msig-1-upgrade.v3.4.json`, JSON.stringify(transaction, null, 4));