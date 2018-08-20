import React, { Component } from "react";
import ReactGA from "react-ga";
import ErrorBoundary from "./ErrorBoundary";

const withTracker = (WrappedComponent, options = {}) => {
  const trackPage = page => {
    ReactGA.set({
      page,
      ...options
    });
    ReactGA.pageview(page);
  };

  const HOC = class extends Component {
    componentDidMount() {
      let page = this.props.location.pathname;
      const regex = /\/homework\/(\d+)(?:\/.+)?/g.exec(page);
      if (regex && regex[1]) {
        page = page.replace(`/homework/${regex[1]}`, "/homework");
      }
      trackPage(page);
    }

    componentWillReceiveProps(nextProps) {
      const currentPage = this.props.location.pathname;
      const nextPage = nextProps.location.pathname;

      if (currentPage !== nextPage) {
        trackPage(nextPage);
      }
    }

    render() {
      return (
        <ErrorBoundary>
          <WrappedComponent {...this.props} />
        </ErrorBoundary>
      );
    }
  };

  return HOC;
};

export default withTracker;
