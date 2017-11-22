import React, {
    Component
} from 'react';
import GoogleAnalytics from 'react-ga';

GoogleAnalytics.initialize('UA-109842496-1');

const withTracker = (WrappedComponent, options = {}) => {
    const trackPage = page => {
        GoogleAnalytics.set({
            page,
            ...options,
        });
        GoogleAnalytics.pageview(page);
    };

    const HOC = class extends Component {
        componentDidMount() {
            let page = this.props.location.pathname;
            const regex = /\/homework\/(\d+)(?:\/.+)?/g.exec(page);
            if(regex && regex[1]) {
                page = page.replace(`/homework/${regex[1]}`, '/homework');
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
            return <WrappedComponent { ...this.props
            }
            />;
        }
    };

    return HOC;
};

export default withTracker;
