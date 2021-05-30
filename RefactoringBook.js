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
    return renderPlainText(invoice, plays);
}

function renderPlainText(invoice, plays) {
    
    let result = `Statement for ${invoice.customer} \n `;
    for(let perf of invoice.performances) {
        //Exibe a linha para esta requisição
        result += ` ${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience} seats) \n `
    }
    result += `Amount owned is ${usd(totalAmount())} \n `;
    result += `You earned ${totalVolumeCredits()} credits \n `;

    return result;

    function totalAmount() {
        let resultTotalAmount = 0;
        for(let perf of invoice.performances) {
            resultTotalAmount+= amountFor(perf);
        }
        return resultTotalAmount;
    }

    function totalVolumeCredits() {
        let resultTotalVolumeCredits = 0;
        for(let perf of invoice.performances) {
            resultTotalVolumeCredits += volumeCreditsFor(perf);
        }
        return resultTotalVolumeCredits;
    }

    function volumeCreditsFor(perf) {
        let resultVolumeCreditsFor = 0;
        resultVolumeCreditsFor += Math.max(perf.audience - 30, 0);
        if ("comedy" === playFor(perf).type) resultVolumeCreditsFor += 
            Math.floor(perf.audience / 5);
        return resultVolumeCreditsFor;
    }
    
    function usd(aNumber) {
        return new Intl.NumberFormat("en-US",
            { style: "currency", currency: "USD", 
                minimumFractionDigits: 2 }).format(aNumber/100);
    }
    
    function amountFor(aPerformance) {
        let resultAmountFor = 0;
    
        switch(playFor(aPerformance).type) {
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
    
    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }
}

