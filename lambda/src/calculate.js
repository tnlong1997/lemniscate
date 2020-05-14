import dynamoDb from "./libs/db-lib";
import {plus, minus, multiply} from "./libs/operations-lib";
import { success, failure } from "./libs/response-lib";
import shortid from "shortid";

export async function main(event, context, callback) {
    var body = JSON.parse(event.body);

    var operation = body.operation.split(/\s+/);

    const identity = body.username;

    try {
        var result = "";
        var operandA = operation[0];
        var operandB = operation[2];
        const isANegative = operandA[0] == "-";
        if (isANegative) {
            operandA = operandA.substr(1);
        }
        const isBNegative = operandB[0] == "-";
        if (isBNegative) {
            operandB = operandB.substr(1);
        }

        switch (operation[1]) {
            case "+":
                if (isANegative && isBNegative) {
                    result = "-" + plus(operandA, operandB);
                } else if (isANegative) {
                    result = minus(operandB, operandA);
                } else if (isBNegative) {
                    result = minus(operandA, operandB);
                } else {
                    result = plus(operandA, operandB);
                }
                break;
            case "-":
                if (isANegative && isBNegative) {
                    result = minus(operandB, operandA);
                } else if (isANegative) {
                    result = "-" + plus(operandA, operandB);
                } else if (isBNegative) {
                    result = plus(operandA, operandB);
                } else {
                    result = minus(operandA, operandB);
                }
                break;
            case "*":
                if (isANegative && isBNegative) {
                    result = multiply(operandA, operandB);
                } else if (isANegative || isBNegative) {
                    result = "-" + multiply(operandA, operandB);
                } else {
                    result = multiply(operandA, operandB);
                }
                break;
            case "x":
                if (isANegative && isBNegative) {
                    result = multiply(operandA, operandB);
                } else if (isANegative || isBNegative) {
                    result = "-" + multiply(operandA, operandB);
                } else {
                    result = multiply(operandA, operandB);
                }
                break;
            default:
                return failure(501, {message: "Not supported operation"});
                break;
        }


        var response = {};

        if (identity == "" || identity == null) {
            response = {
                message: "Calculated successfully",
                result: result
            };
            return success(response);
        } else {
            console.log(process.env.HISTORY);
            const putHistoryParams = {
                TableName: "lemniscate_history",
                Item: {
                    addedUser: identity,
                    historyId: shortid.generate(),
                    result: result,
                    operation: body.operation,
                    createdAt: Date.now()
                }
            };

            await dynamoDb.put(putHistoryParams);
            response = {
                message: "Calculated successfully",
                result: result
            };
            return success(response);
        }

    } catch (e) {
        console.log(e);
        return failure(500, { message: e.message });
    }
}
