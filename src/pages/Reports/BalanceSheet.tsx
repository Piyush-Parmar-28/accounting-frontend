import React, { useState } from 'react'
import Dashboard from '../../components/Dashboard';

const BalanceSheet = () => {
    const [checked, setChecked] = useState(true);
    return (
        <Dashboard>
            <div className='flex flex-col'>
                <h1 className='font-bold text-3xl'>Balance Sheet</h1>
                <span className='font-bold'>as on 31-03-2023</span>
                <div className='flex items-center my-4'>
                    <button className='border-2 border-black px-1 w-24 mr-2'>Collapse All</button>
                    <div className="check-container flex items-center">
                        <input type="checkbox" id='checkbox' className="checkbox mr-1" checked={checked} onChange={() => setChecked(!checked)} />
                        <label htmlFor="checkbox">Hide Zero Values</label>
                    </div>
                </div>
            </div>
            <table className="table-auto border-collapse border-black">
                <thead>
                    <tr>
                        <th className="px-4 border-2 border-black py-2 font-bold">Liabilities</th>
                        <th className="px-4 border-2 border-black py-2 font-bold"></th>
                        <th className="px-4 border-2 border-black py-2 font-bold"></th>
                        <th className="px-4 border-2 border-black py-2 font-bold">Assets</th>
                        <th className="px-4 border-2 border-black py-2 font-bold"></th>
                        <th className="px-4 border-2 border-black py-2 font-bold"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="font-bold border-black border-2 px-4 py-2">Capital</td>
                        <td className="border-black border-2 pr-4 pl-8 py-2">xxx</td>
                        <td className="border-black border-2 pr-4 pl-8 py-2">xxx</td>
                        <td className="font-bold border-black border-2 px-4 py-2">Fixed Asset</td>
                        <td className="border-black border-2 pr-4 pl-8 py-2">xxx</td>
                        <td className="border-black border-2 pr-4 pl-8 py-2">xxx</td>
                    </tr>
                    <tr>
                        <td className="font-bold border-black border-2 px-4 py-2">Provisions</td>
                        <td className="border-black border-2  pr-4 pl-8 py-2">xxx</td>
                        <td className="border-black border-2  pr-4 pl-8 py-2">xxx</td>
                        <td className="font-bold border-black border-2  px-4 py-2">Investments</td>
                        <td className="border-black border-2  pr-4 pl-8 py-2">xxx</td>
                        <td className="border-black border-2  pr-4 pl-8 py-2">xxx</td>
                    </tr>
                    <tr>
                        <td className="font-bold border-black border-2 px-4 py-2">Reserves</td>
                        <td className="border-black border-2  pr-4 pl-8 py-2">xxx</td>
                        <td className="border-black border-2  pr-4 pl-8 py-2">xxx</td>
                        <td className="font-bold border-black border-2  px-4 py-2">Deposits - Assets</td>
                        <td className="border-black border-2  pr-4 pl-8 py-2">xxx</td>
                        <td className="border-black border-2  pr-4 pl-8 py-2">xxx</td>
                    </tr>
                    <tr>
                        <td className="font-bold border-black border-2 px-4 py-2">Loans</td>
                        <td className="border-black border-2  pr-4 pl-8 py-2">xxx</td>
                        <td className="border-black border-2  pr-4 pl-8 py-2">xxx</td>
                        <td className="font-bold border-black border-2  px-4 py-2">Current Assets</td>
                        <td className="border-black border-2  pr-4 pl-8 py-2">xxx</td>
                        <td className="border-black border-2  pr-4 pl-8 py-2">xxx</td>
                    </tr>
                    <tr>
                        <td className="border-black border-2  pr-4 pl-8 py-2">Secured Loans</td>
                        <td className="border-black border-2  pr-4 pl-8 py-2">xxx</td>
                        <td className="border-black border-2  pr-4 pl-8 py-2">xxx</td>
                        <td className="border-black border-2  pr-4 pl-8 py-2">Cash</td>
                        <td className="border-black border-2  pr-4 pl-8 py-2">xxx</td>
                        <td className="border-black border-2  pr-4 pl-8 py-2">xxx</td>
                    </tr>
                    <tr>
                        <td className="border-black border-2  pr-4 pl-8 py-2">Unsecured Loans</td>
                        <td className="border-black border-2  pr-4 pl-8 py-2">xxx</td>
                        <td className="border-black border-2  pr-4 pl-8 py-2">xxx</td>
                        <td className="border-black border-2  pr-4 pl-8 py-2">Bank</td>
                        <td className="border-black border-2  pr-4 pl-8 py-2">xxx</td>
                        <td className="border-black border-2  pr-4 pl-8 py-2">xxx</td>
                    </tr>
                    <tr>
                        <td className="border-black border-2  pr-4 pl-8 py-2">Bank OD/CC</td>
                        <td className="border-black border-2  pr-4 pl-8 py-2">xxx</td>
                        <td className="border-black border-2  pr-4 pl-8 py-2">xxx</td>
                        <td className="border-black border-2  pr-4 pl-8 py-2">Debtors</td>
                        <td className="border-black border-2  pr-4 pl-8 py-2">xxx</td>
                        <td className="border-black border-2  pr-4 pl-8 py-2">xxx</td>
                    </tr>
                    <tr>
                        <td className="font-bold border-black border-2 px-4 py-2">Current Liabilities</td>
                        <td className="border-black border-2  pr-4 pl-8 py-2">xxx</td>
                        <td className="border-black border-2  pr-4 pl-8 py-2">xxx</td>
                        <td className="border-black border-2  pr-4 pl-8 py-2">Closing Stock</td>
                        <td className="border-black border-2  pr-4 pl-8 py-2">xxx</td>
                        <td className="border-black border-2  pr-4 pl-8 py-2">xxx</td>
                    </tr>
                    <tr>
                        <td className="border-black border-2  pr-4 pl-8 py-2">Creditors</td>
                        <td className="border-black border-2  pr-4 pl-8 py-2">xxx</td>
                        <td className="border-black border-2  pr-4 pl-8 py-2">xxx</td>
                        <td className="border-black border-2  pr-4 pl-8 py-2">... Other Current Liabilities</td>
                        <td className="border-black border-2  pr-4 pl-8 py-2">xxx</td>
                        <td className="border-black border-2  pr-4 pl-8 py-2">xxx</td>
                    </tr>
                    <tr>
                        <td className="border-black border-2  pr-4 pl-8 py-2">Duties and Taxes</td>
                        <td className="border-black border-2  pr-4 pl-8 py-2">xxx</td>
                        <td className="border-black border-2  pr-4 pl-8 py-2">xxx</td>
                        <td className="font-bold border-black border-2  px-4 py-2">Loans and Advances - Assesment</td>
                        <td className="border-black border-2  pr-4 pl-8 py-2">xxx</td>
                        <td className="border-black border-2  pr-4 pl-8 py-2">xxx</td>
                    </tr>
                    <tr>
                        <td className="border-black border-2  pr-4 pl-8 py-2">... Other Current Liabilities</td>
                        <td className="border-black border-2  pr-4 pl-8 py-2">xxx</td>
                        <td className="border-black border-2  pr-4 pl-8 py-2">xxx</td>
                        <td className="font-bold border-black border-2 px-4 py-2">Miscellaneous Assets</td>
                        <td className="border-black border-2  pr-4 pl-8 py-2">xxx</td>
                        <td className="border-black border-2  pr-4 pl-8 py-2">xxx</td>
                    </tr>
                    <tr>
                        <td className="font-bold border-black border-2 px-4 py-2">Miscellaneous Liabilities</td>
                        <td className="border-black border-2  pr-4 pl-8 py-2"></td>
                        <td className="border-black border-2  pr-4 pl-8 py-2"></td>
                        <td className="font-bold border-black border-2 px-4 py-2">Suspense</td>
                        <td className="border-black border-2  pr-4 pl-8 py-2"></td>
                        <td className="border-black border-2  pr-4 pl-8 py-2"></td>
                    </tr>
                    <tr>
                        <td className="font-bold border-black border-2 px-4 py-2">Profit or Loss A/c</td>
                        <td className="border-black border-2  pr-4 pl-8 py-2"></td>
                        <td className="border-black border-2  pr-4 pl-8 py-2"></td>
                        <td className="font-bold border-black border-2 px-4 py-2">Diff. in Opening Balance</td>
                        <td className="border-black border-2  pr-4 pl-8 py-2"></td>
                        <td className="border-black border-2  pr-4 pl-8 py-2"></td>
                    </tr>
                    <tr>
                        <td className="border-black border-2  pr-4 pl-8 py-2">Opening Balance</td>
                        <td className="border-black border-2  pr-4 pl-8 py-2">xxx</td>
                    </tr>
                    <tr>
                        <td className="border-black border-2  pr-4 pl-8 py-2">Current Period</td>
                        <td className="border-black border-2  pr-4 pl-8 py-2">xxx</td>
                    </tr>
                    <tr>
                        <td className="border-black border-2  pr-4 pl-8 py-2">Total</td>
                        <td className="border-black border-2  pr-4 pl-8 py-2"></td>
                        <td className="border-black border-2  pr-4 pl-8 py-2">xxx</td>
                        <td className="border-black border-2  pr-4 pl-8 py-2">Total</td>
                        <td className="border-black border-2  pr-4 pl-8 py-2"></td>
                        <td className="border-black border-2  pr-4 pl-8 py-2">xxx</td>
                    </tr>
                </tbody>
            </table>

        </Dashboard >
    )

}

export default BalanceSheet;
