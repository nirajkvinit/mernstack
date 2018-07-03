import React from 'react';
// import { Link } from 'react-router';
export default class IssueFilter extends React.Component {
    constructor() {
        super();
        this.clearFilter = this.clearFilter.bind(this);
        this.setFilterOpen = this.setFilterOpen.bind(this);
        this.setFilterAssigned = this.setFilterAssigned.bind(this);
    }

    setFilterOpen(e) {
        e.preventDefault();
        this.props.setFilter({ status: 'Open' });
    }

    setFilterAssigned(e) {
        e.preventDefault();
        this.props.setFilter({ status: 'Assigned' });
    }

    clearFilter(e) {
        e.preventDefault();
        this.props.setFilter({});
    }

    render() {
        const Seperator = () => <span> | </span>;
        return (
            <div>
                <a href="#" onClick={this.clearFilter}>All Issues</a>
                <Seperator />
                <a href="#" onClick={this.setFilterOpen}>Open Issues</a>
                <Seperator />
                <a href="#" onClick={this.setFilterAssigned}>Assigned Issues</a>
            </div>
        );
    }
}

IssueFilter.propTypes = {
    setFilter: React.PropTypes.func.isRequired,
};
