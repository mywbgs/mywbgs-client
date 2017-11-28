import React, { Component } from 'react';
import * as Raven from 'raven-js';
import ReactGA from 'react-ga';

import Container from './Container';

class ErrorBoundary extends Component {
    state = {error: null}

    componentDidCatch(error, errorInfo) {
        if(process.env.NODE_ENV === 'production') {
            this.setState({error});
            ReactGA.exception({
                error: this.state.errorInfo,
                fatal: false
            });
            Raven.captureException(error, {extra: errorInfo});
            Raven.showReportDialog();
        } else {
            throw error;
        }
    }

    render() {
        return this.state.error ? (
            <Container>
                <h1>Something went horribly wrong</h1>
                <p>This error has been logged, and we'll work on a solution as quickly as possible. Try refreshing or <a href="/">going home</a></p>
                <pre>{this.state.error}</pre>
            </Container>
        ) : this.props.children;
    }
}

export default ErrorBoundary;