//play.json
let plays = {
    "hamlet" : {"name": "Hamlet", "type": "tragedy" },
    "as-like" : {"name": "As You Like It", "type": "comedy" },
    "othello" : {"name": "Othello", "type": "tragedy"}
}

//invoices.json
let invoice = {
    "customer": "BigCo",
    "performances": [
        {
            "playID": "hamlet",
            "audience": 55
        },
        {
            "playID": "as-like",
            "audience": 35
        },
        {
            "playID": "othello",
            "audience": 40
        }
    ]
}

let fStatement = function statement(invoice){
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `Statement for ${invoice.customer} \n `;

    for(let perf of invoice.performances) {
        volumeCredits += volumeCreditsFor(perf);

        //Exibe a linha para esta requisição
        result += ` ${playFor(perf).name}: ${format(amountFor(perf)/100)} (${perf.audience} seats) \n `
        totalAmount+= amountFor(perf);
    }

    result += `Amount owned is ${format(totalAmount/100)} \n `;
    result += `You earned ${volumeCredits} credits \n `;

    return result;
}

function volumeCreditsFor(perf) {
    let result = 0;
    result += Math.max(perf.audience - 30, 0);
    if ("comedy" === playFor(perf).type) result += 
        Math.floor(perf.audience / 5);
    return result;
}

function format(aNumber) {
    return new Intl.NumberFormat("en-US",
        { style: "currency", currency: "USD", 
            minimumFractionDigits: 2 }).format(aNumber);
}

function amountFor(aPerformance) {
    let result = 0;

    switch(playFor(aPerformance).type) {
        case "tragedy":
            result = 40000;
            if(aPerformance.audience > 30) {
                result += 1000 * (aPerformance.audience -30);
            }
            break;
        case "comedy":
            result = 30000;
            if(aPerformance.audience > 20) {
                result += 10000 + 500 * (aPerformance.audience - 20);
            }
            result += 300 * aPerformance.audience;
            break;
        default:
            throw new Error(`unknown type: ${playFor(aPerformance).type}`);
    }

    return result;
}

function playFor(aPerformance) {
    return plays[aPerformance.playID];
}