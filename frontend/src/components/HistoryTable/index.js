import React, {useState, useEffect} from "react";
import { useHistory } from "react-router-dom";
import {BootstrapTable, TableHeaderColumn} from "react-bootstrap-table";
import { API } from "aws-amplify";
import '../../libs/css/react-bootstrap-table-all.min.css'
import { useAppContext } from "../../libs/contextLib";
import { onError } from "../../libs/errorLib";
import { beautifyNumber } from "../../libs/stringLib";

import "./index.css";

export default function HistoryTable({
    isLoading,
    className = "",
    ...props
}) {

    const [history, setHistory] = useState([]);
    const { username } = useAppContext();

    useEffect(() => {
        async function onLoad() {
            try {
                const response = await loadHistory();
                if (response.code == '200') {
                    var newHistory = response.history.Items;
                    setHistory(newHistory.map((d, i) => {
                        var temp = {
                            operation: d.operation,
                            result: beautifyNumber(d.result),
                            createdAtDateTime: new Date(d.createdAt)
                        };

                        return temp;
                    }));
                } else {
                    onError(response.message);
                }
            } catch (e) {
                onError(e);
            }
        }

        function loadHistory() {
            return API.get("lemniscate", `/history/${username}`);
        }

        onLoad();
    }, []);

    const options = {
        page: 1,
        sizePerPageList: [
            {text: '5', value: 5},
            {text: '10', value: 10},
        ],
        sizePerPage: 5,
        pageStartIndex: 1,
        paginationSize: 5,
        prePage: '<',
        nextPage: '>',
        firstPage: '<<',
        lastPage: '>>',
        paginationPosition: 'bottom',
        defaultSortName: 'createdAtDateTime',
        defaultSortOrder: 'desc',
        expandRowBgColor: 'rgc(242, 255, 163)'
    };

    return (
        <BootstrapTable
            data={ history }
            pagination={ true }
            options={ options }
        >
            <TableHeaderColumn
                dataField='createdAtDateTime'
                isKey
                width='20%'
                dataSort
            >
                Calculated At
            </TableHeaderColumn>
            <TableHeaderColumn
                dataField='operation'
            >
                Operation
            </TableHeaderColumn>
            <TableHeaderColumn
                dataField='result'
                width='20%'
            >
                Result
            </TableHeaderColumn>

        </BootstrapTable>
    );
}
