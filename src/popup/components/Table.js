import React from 'react';
import {t} from '../../shared/utils/i18n';

const Table = ({data}) => {
    return (
        <table className="table-fill styled-table">
            <thead>
            <tr>
                <th className="text-left">{t("key")}</th>
                <th className="text-left">{t("action")}</th>
            </tr>
            </thead>
            <tbody className="">
            {data.map((row) => (
                <tr key={row.action}>
                    <td className="text-left">{row.key}</td>
                    <td className="text-left">{row.action}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default Table;