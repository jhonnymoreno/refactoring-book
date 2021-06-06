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

let fStatement = function statement(invoice, plays){
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    statementData.totalAmount = totalAmount(statementData);
    statementData.totalVolumeCredits = totalVolumeCredits(statementData);
    return renderPlainText(statementData, plays);

    function totalAmount(data) {
        let resultTotalAmount = 0;
        for(let perf of data.performances) {
            resultTotalAmount+= perf.amount;
        }
        return resultTotalAmount;
    }

    function totalVolumeCredits(data) {
        let resultTotalVolumeCredits = 0;
        for(let perf of data.performances) {
            resultTotalVolumeCredits += perf.volumeCredits;
        }
        return resultTotalVolumeCredits;
    }

    function enrichPerformance(aPerformance) {
        const result = Object.assign({}, aPerformance);
        result.play = playFor(result);
        result.amount = amountFor(result);
        result.volumeCredits = volumeCreditsFor(result);
        return result;
    }

    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }

    function amountFor(aPerformance) {
        let resultAmountFor = 0;
    
        switch(aPerformance.play.type) {
            case "tragedy":
                resultAmountFor = 40000;
                if(aPerformance.audience > 30) {
                    resultAmountFor += 1000 * (aPerformance.audience -30);
                }
                break;
            case "comedy":
                resultAmountFor = 30000;
                if(aPerformance.audience > 20) {
                    resultAmountFor += 10000 + 500 * (aPerformance.audience - 20);
                }
                resultAmountFor += 300 * aPerformance.audience;
                break;
            default:
                throw new Error(`unknown type: ${playFor(aPerformance).type}`);
        }
    
        return resultAmountFor;
    }

    function volumeCreditsFor(perf) {
        let resultVolumeCreditsFor = 0;
        resultVolumeCreditsFor += Math.max(perf.audience - 30, 0);
        if ("comedy" === perf.play.type) resultVolumeCreditsFor += 
            Math.floor(perf.audience / 5);
        return resultVolumeCreditsFor;
    }
}

function renderPlainText(data, plays) {
    let result = `Statement for ${data.customer} \n `;
    for(let perf of data.performances) {
        //Exibe a linha para esta requisição
        result += ` ${perf.play.name}: ${usd(perf.amount)} (${perf.audience} seats) \n `
    }
    result += `Amount owned is ${usd(data.totalAmount)} \n `;
    result += `You earned ${data.totalVolumeCredits} credits \n `;

    return result;
    
    function usd(aNumber) {
        return new Intl.NumberFormat("en-US",
            { style: "currency", currency: "USD", 
                minimumFractionDigits: 2 }).format(aNumber/100);
    }
}