import * as React from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import Dashboard from '../../components/Dashboard';
import Icon from '../../components/Icon';

interface Props {
    // Add props here
}

const ReceiptHome: React.FC<Props> = (props) => {
    const location = useLocation();
    const navigate = useNavigate();
    return (
        <Dashboard>
            <div className="px-4 sm:px-6 md:px-8 grid grid-cols-12 gap-4 mt-6">
                <div className="w-fit col-span-2">
                    <button
                        type="button"
                        className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                        onClick={() =>
                            navigate(`${location.pathname}/list`)
                        }
                    >
                        <Icon name="add" className="h-4 w-4 mr-2" />
                        Add New
                    </button>
                </div>
            </div>
        </Dashboard>
    );
};

export default ReceiptHome;
