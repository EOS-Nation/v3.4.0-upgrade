import * as fs from "fs";
import { Serializer } from "@wharfkit/antelope";
import * as Token from "../codegen/eosio.token.js"
import * as System from "../codegen/eosio.system.js"
import * as Fees from "../codegen/eosio.fees.js"
import { transaction } from "./msig-helpers.js";

// setcontracts
import eosio from '../actions/setcontract-eosio.system.json';
import eosio_token from '../actions/setcontract-eosio.token.json';
import eosio_fees from '../actions/setcontract-eosio.fees.json';

// 1. Deploy new system contracts
for ( const setcontract of [ eosio, eosio_token ] ) {
    transaction.actions.push(...setcontract.actions);
}

// 3.1. Set max supply 2.1B
transaction.actions.push({
    account: "eosio.token",
    name: "setmaxsupply",
    authorization: [{
        actor: "eosio",
        permission: "active"
    }],
    data: Serializer.encode({object: Token.Types.setmaxsupply.from({
        issuer: "eosio",
        maximum_supply: "2100000000.0000 EOS"
    })}).hexString
})

// 3.2. Issue fixed supply up to 2.1B (expected ~972M EOS)
transaction.actions.push({
    account: "eosio.token",
    name: "issuefixed",
    authorization: [{
        actor: "eosio",
        permission: "active"
    }],
    data: Serializer.encode({object: Token.Types.issuefixed.from({
        to: "eosio",
        supply: "2100000000.0000 EOS",
        memo: "EOS Tokenomics"
    })}).hexString
})

// 5.2. Adjust `inflation_pay_factor=60767` factor ratio
transaction.actions.push({
    account: "eosio",
    name: "setpayfactor",
    authorization: [{
        actor: "eosio",
        permission: "active"
    }],
    data: Serializer.encode({object: System.Types.setpayfactor.from({
        inflation_pay_factor: 60767,
        votepay_factor: 40000
    })}).hexString
})

// 5.3. Set 4 year halvening schedules (up to 20 years, 6 schedules)
const schedules = [
    {"start_time": new Date("2024-05-17T00:00:00Z"), "continuous_rate": 0.03617097},
    {"start_time": new Date("2024-05-21T00:00:00Z"), "continuous_rate": 0.01808549},
]
schedules.forEach((schedule, index) => {
    transaction.actions.push({
        account: "eosio",
        name: "setschedule",
        authorization: [{
            actor: "eosio",
            permission: "active"
        }],
        data: Serializer.encode({object: System.Types.setschedule.from(schedule)}).hexString
    })
});

// 5.4. Execute next schedule
transaction.actions.push({
    account: "eosio",
    name: "execschedule",
    authorization: [{
        actor: "eosio",
        permission: "active"
    }],
    data: ""
})

// 6.1. Deploy fees system contracts
transaction.actions.push(...eosio_fees.actions);

// 7.1 Set incoming fees to 100% go to REX via `donatetorex` strategy
transaction.actions.push({
    account: "eosio.fees",
    name: "setstrategy",
    authorization: [{
        actor: "eosio.fees",
        permission: "owner"
    }],
    data: Serializer.encode({object: Fees.Types.setstrategy.from({
        "strategy": "donatetorex",
        "weight": 10000
    })}).hexString
})


fs.writeFileSync(`actions/msig-1-testnet-tokenomics.json`, JSON.stringify(transaction, null, 4));