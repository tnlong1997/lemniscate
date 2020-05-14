import React, {useState} from "react";
import {FormGroup, ControlLabel, FormControl} from "react-bootstrap";
import { API } from "aws-amplify";
import { useFormFields } from "../../libs/hooksLib";
import { useAppContext } from "../../libs/contextLib";
import { onError } from "../../libs/errorLib";
import LoaderButton from "../../components/LoaderButton";
import ColoredLine from "../../components/ColoredLine";
import Lander from "../../components/Lander";
import HistoryTable from "../../components/HistoryTable";

import "./index.css";

export default function Home() {
    const [fields, handleFieldChange] = useFormFields({
        operation: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState('');
    const [isResultReturned, setIsResultReturned] = useState(false);
    const [pageOfItems, setPageOfItems] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const { isAuthenticated, username } = useAppContext();

    const apiUrl = 'http://localhost:3001';

    function onChangePage(pageOfItems) {
        // update state with new page of items
        setPageOfItems(pageOfItems)
    }

    function calculate() {
        return API.post("lemniscate", "/calculate", {
            body: {
                operation: fields.operation,
                username: username || ""
            }
        });
    }

    function allDigit(str) {
        var res = true;

        [...str].forEach((s, i) => {
            if (s >= '0' && s <= '9') {
                res = res;
            } else {
                res = false;
                return;
            }
        });

        console.log(res);

        return res;
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setIsResultReturned(false);
        setIsLoading(true);

        try {
            var operation = fields.operation.trim("");
            var operation = operation.split(/\s+/);
            if (operation.length != 3) {
                setSubmitError("Operation should be in the right format");
                setIsLoading(false);
                return;
            }

            if (!allDigit(operation[0]) || !allDigit(operation[2])) {
                setSubmitError("Operand should not have letters");
                setIsLoading(false);
                return;
            }

            if (operation[1] != "*" && operation[1] != "+" && operation[1] != "-" && operation[1] != "x") {
                setSubmitError("Not supported operation");
                setIsLoading(false);
                return;
            }

            setSubmitError("");

            const response = await calculate();

            if (response.code != '200') {
                setIsLoading(false);
                onError(response.message);
                return;
            } else {
                setResult(response.result);
                setIsLoading(false);
                setIsResultReturned(true);
                return;
            }
        } catch (e) {
            onError(e);
        }
    }

    function reverseString(str) {
        return str.split("").reverse().join("");
    }

    function beautifyNumber(str) {
        return reverseString([...reverseString(str)].map((s, i) => (i) % 3 == 0 ? ' ' + s : s).join('').trim())
    }

    return (
        <div className="Home">
            <form className="form" onSubmit={handleSubmit}>
                <FormGroup controlId="operation">
                    <ControlLabel> INFINITE NUMBER OPERATION </ControlLabel>
                    <FormControl
                        type="text"
                        value={fields.operation}
                        onChange={handleFieldChange}
                        placeholder="Enter operation (+, - or *)"
                    />
                </FormGroup>
                <LoaderButton
                    block
                    type="submit"
                    bsSize="large"
                    bsStyle="primary"
                    isLoading={isLoading}
                >
                    Calculate!!
                </LoaderButton>
                {submitError && (
                    <p style={{ color: 'red' }}>{submitError}</p>
                )}
                {isResultReturned == false
                    ? <div></div>
                    : <div className="ResultDisplay">
                        <section>
                            <header className="ResultDisplayHeader">
                                <h4> Input </h4>
                            </header>
                            <div className="ResultDisplayBody">
                                <p> {fields.operation} </p>
                            </div>
                        </section>
                        <section>
                            <header className="ResultDisplayHeader">
                                <h4> Answer </h4>
                            </header>
                            <div className="ResultDisplayBody">
                                <p> {beautifyNumber(result)} </p>
                            </div>
                        </section>
                    </div>
                }
                <div className="History">
                    <ColoredLine />
                </div>
                {!isAuthenticated
                    ? <Lander />
                    : <div>
                        <HistoryTable />
                    </div>
                }
            </form>
        </div>
    );
}
