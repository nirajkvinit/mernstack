import React from 'react';

import { FormGroup, FormControl, ControlLabel, ButtonToolbar, Button, Panel, Form, Col, Alert } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import NumInput from './NumInput.jsx';
import DateInput from './DateInput.jsx';
import Toast from './Toast.jsx';;

export default class IssueEdit extends React.Component { // eslint-disable-line
    constructor() {
        super();
        this.state = {
            issue: {
                _id: '', title: '', status: '', owner: '', effort: null,
                completionDate: null, created: null,
            },
            invalidFields: {},
            showingValidation: false,
            toastVisible: false,
            toastMessage: '',
            toastType: 'success',
        };
        this.dismissValidation = this.dismissValidation.bind(this);
        this.showValidation = this.showValidation.bind(this);
        this.showSuccess = this.showSuccess.bind(this);
        this.showError = this.showError.bind(this);
        this.dismissToast = this.dismissToast.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onValidityChange = this.onValidityChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.params.id !== this.props.params.id) {
            this.loadData();
        }
    }

    onValidityChange(event, valid) {
        const invalidFields = Object.assign({}, this.state.invalidField);
        if (!valid) {
            invalidFields[event.target.name] = true;
        } else {
            delete invalidFields[event.target.name];
        }
        this.setState({ invalidFields });
    }

    onChange(event, convertedValue) {
        const issue = Object.assign({}, this.state.issue);
        const value = (convertedValue !== undefined) ? convertedValue : event.target.value;
        issue[event.target.name] = value;
        this.setState({ issue });
    }

    onSubmit(event) {
        event.preventDefault();
        this.showValidation();

        if (Object.keys(this.state.invalidFields).length !== 0) {
            return;
        }

        fetch(`/api/issues/${this.props.params.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.state.issue),
        })
        .then(response => {
            if (response.ok) {
                response.json().then(updatedIssue => {
                    updatedIssue.created = new Date(updatedIssue.created);
                    if (updatedIssue.completionDate) {
                        updatedIssue.completionDate = new Date(updatedIssue.completionDate);
                    }
                    this.setState({ issue: updatedIssue });
                    this.showSuccess('Updated issue successfully!');
                });
            } else {
                response.json().then(error => {
                    this.showError(`Failed to update issue: ${error.message}`);
                });
            }
        })
        .catch(err => {
            this.showError(`Error in sending data to server: ${err.message}`);
        });
    }

    showValidation() {
        this.setState({ showingValidation: true });
    }

    dismissValidation() {
        this.setState({ showingValidation: false });
    }

    loadData() {
        fetch(`/api/issues/${this.props.params.id}`)
        .then(response => {
            if (response.ok) {
                response.json()
                .then(issue => {
                    issue.created = new Date(issue.created);
                    issue.completionDate = issue.completionDate != null ?
                      new Date(issue.completionDate) : null;
                    this.setState({ issue });
                });
            } else {
                response.json()
                .then(error => {
                    this.showError(`Failed to fetch issue: ${error.message}`);
                });
            }
        })
        .catch(err => {
            this.showError(`Error in fetching data from server: ${err.message}`);
        });
    }

    showSuccess(message) {
        this.setState({ toastVisible: true, toastMessage: message, toastType: 'success' });
    }

    showError(message) {
        this.setState({ toastVisible: true, toastMessage: message, toastType: 'danger' });
    }

    dismissToast() {
        this.setState({ toastVisible: false });
    }

    render() {
        const issue = this.state.issue;
        let validationMessage = null;
        if (Object.keys(this.state.invalidFields).length !== 0 && this.state.showingValidation) {
            validationMessage = (
                <Alert bsStyle="danger" onDismiss={this.dismissValidation}>
                    Please correct invalid fields before submitting.
                </Alert>
            );
        }
        return (
            <Panel header="Edit Issue">
                <Form horizontal onSubmit={this.onSubmit}>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={3}>ID</Col>
                        <Col sm={9}>
                            <FormControl.Static>{issue._id}</FormControl.Static>
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={3}>Created</Col>
                        <Col sm={9}>
                            <FormControl.Static>
                                {issue.created ? issue.created.toDateString() : ''}
                            </FormControl.Static>
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={3}>Status</Col>
                        <Col sm={9}>
                            <FormControl componentClass="select" name="status" value={issue.status} onChange={this.onChange}>
                                <option value="New">New</option>
                                <option value="Open">Open</option>
                                <option value="Assigned">Assigned</option>
                                <option value="Fixed">Fixed</option>
                                <option value="Verified">Verified</option>
                                <option value="Closed">Closed</option>
                            </FormControl>
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={3}>Owner</Col>
                        <Col sm={9}>
                            <FormControl name="owner" value={issue.owner} onChange={this.onChange} />
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={3}>Effort</Col>
                        <Col sm={9}>
                            <FormControl componentClass={NumInput} name="effort" value={issue.effort} onChange={this.onChange} />
                        </Col>
                    </FormGroup>
                    <FormGroup validationState={this.state.invalidFields.completionDate ? 'error' : null}>
                        <Col componentClass={ControlLabel} sm={3}>Completion Date</Col>
                        <Col sm={9}>
                            <FormControl
                                componentClass={DateInput}
                                name="completionDate"
                                value={issue.completionDate}
                                onChange={this.onChange}
                                onValidityChange={this.onValidityChange}
                            />
                            <FormControl.Feedback />
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={3}>Title</Col>
                        <Col sm={9}>
                            <FormControl name="title" value={issue.title} onChange={this.onChange} />
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col smOffset={3} sm={6}>
                            <ButtonToolbar>
                                <Button bsStyle="primary" type="submit">Submit</Button>
                                <LinkContainer to="/issues">
                                    <Button bsStyle="link">Back</Button>
                                </LinkContainer>
                            </ButtonToolbar>
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col smOffset={3} sm={9}> {validationMessage} </Col>
                    </FormGroup>
                </Form>
                <Toast
                    showing={this.state.toastVisible}
                    message={this.state.toastMessage}
                    onDismiss={this.dismissToast}
                    bsStyle={this.state.toastType}
                />
            </Panel>
        );
    }
}

IssueEdit.propTypes = {
    params: React.PropTypes.object.isRequired,
};
