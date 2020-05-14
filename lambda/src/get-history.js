import dynamoDb from "./libs/db-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context, callback) {
    const id = event.pathParameters.id;

    const params = {
        TableName: "lemniscate_history",
        KeyConditionExpression: "addedUser = :addedUser",
        ExpressionAttributeValues: {
            ":addedUser": id
        }
    };
    try {
        const result = await dynamoDb.query(params);
        return success({
            code: 200,
            history: result
        });
    } catch (e) {
        return failure(500, {message: e.message});
    }

}
