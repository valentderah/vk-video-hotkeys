import React from 'react';
import {t} from '../../shared/utils/i18n';

const Table = ({threads}) => {
    return (
        <table className="table-fill styled-table">
            <thead>
            <tr>
                <th className="text-left">{t("key")}</th>
                <th className="text-left">{t("action")}</th>
            </tr>
            </thead>
            <tbody className="">
            {threads.map((thread, index) => (
                <tr key={index}>
                    <td className="text-left">{thread.key}</td>
                    <td className="text-left">{thread.action}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default Table;