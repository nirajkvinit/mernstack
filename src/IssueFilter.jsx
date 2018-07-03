import React from 'react';
import { Link } from 'react-router';
export default class IssueFilter extends React.Component { // eslint-disable-line max-len,react/prefer-stateless-function
    render() {
        const Seperator = () => <span> | </span>;
        return (
            <div>
                <Link to="/issues">All Issues</Link>
                <Seperator />
                <Link to={{ pathname: '/issues', query: { status: 'Open' } }}>
                    Open Issues
                </Link>
                <Seperator />
                <Link to="/issues?status=Assigned">Assigned Issues</Link>
            </div>
        );
    }
}

