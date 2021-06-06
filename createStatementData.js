export default function createStatementData(invoice, plays) {
    const resultStatementData = {};
    resultStatementData.customer = invoice.customer;
    resultStatementData.performances = invoice.performances.map(enrichPerformance);
    resultStatementData.totalAmount = totalAmount(resultStatementData);
    resultStatementData.totalVolumeCredits = totalVolumeCredits(resultStatementData);
    return resultStatementData; 

    function totalAmount(data) {
        return data.performances
            .reduce((total, p) => total + p.amount,0);
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