import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import FontAwesome from "react-fontawesome";
import Helmet from "react-helmet";
import * as moment from "moment";

import Page from "../../components/Page";
import Header from "../../components/Header";
import List, { ListItem } from "../../components/List";
import Container from "../../components/Container";
import LoadingSpinner from "../../components/LoadingSpinner";

import * as utils from "../../utils";
import * as actions from "../../actions";
import { HOMEWORK_COLOUR } from "../../consts";

const viewHomework = (homework, history) => () => {
  history.push(`/homework/${homework.id}/view`);
};

class PastHomework extends Component {
  componentWillMount() {
    if (!this.props.loggedIn) {
      this.props.history.replace("/login");
      return;
    }
  }

  getHwkTitleEl = homework => {
    const onClick = e => {
      this.props.updateHomework(homework.id, {
        completed: !homework.completed
      });
      e.stopPropagation();
    };
    return (
      <div className="ListItemTitleChecked">
        {homework.completed ? (
          <FontAwesome
            name="circle"
            style={{ color: HOMEWORK_COLOUR }}
            onClick={onClick}
          />
        ) : (
          <FontAwesome name="circle-thin" onClick={onClick} />
        )}
        {homework.title}
      </div>
    );
  };

  getHomeworkGroup = list =>
    list.map(homework => {
      const lesson = utils.getLesson(
        this.props.timetable,
        moment(homework.due),
        homework.period
      );
      return (
        <ListItem
          key={homework.id}
          title={this.getHwkTitleEl(homework)}
          subtitle={`${lesson.subject} · ${lesson.teacher}`}
          onClick={viewHomework(homework, this.props.history)}
        />
      );
    });

  render() {
    if (!this.props.loading) {
      const selection = this.props.homework.filter(homework => {
        const due = moment(homework.due);
        homework.title = `${due.format("MMMM")} · ${homework.title}`;
        return due.month() >= 5 && due.year() === 2018;
      });

      const complete = selection.filter(homework => homework.completed);
      const incomplete = selection.filter(homework => !homework.completed);

      const completeList = (
        <List
          title="Finished homework"
          items={this.getHomeworkGroup(complete)}
          border
        />
      );
      const incompleteList = (
        <List
          title="Unfinished homework"
          items={this.getHomeworkGroup(incomplete)}
          border
        />
      );

      return (
        <Page name="homework">
          <Helmet>
            <title>Homework</title>
          </Helmet>
          <Header
            colour={HOMEWORK_COLOUR}
            onBack={() => this.props.history.push("/")}
          >
            Homework
          </Header>
          <Container vertical>
            {incompleteList}
            {completeList}
          </Container>
        </Page>
      );
    } else {
      return (
        <Page name="homework">
          <Helmet>
            <title>Homework</title>
          </Helmet>
          <Header
            colour={HOMEWORK_COLOUR}
            onBack={() => this.props.history.push("/")}
          >
            Homework
          </Header>
          <LoadingSpinner colour={HOMEWORK_COLOUR} />
        </Page>
      );
    }
  }
}

export default connect(
  state => {
    const {
      homework,
      timetable,
      authToken,
      loadingTimetable,
      loadingHomework
    } = state.datastore;
    return {
      loggedIn: !!authToken,
      homework: homework.filter(x => !!x),
      timetable,
      loading: loadingTimetable || loadingHomework
    };
  },
  actions
)(withRouter(PastHomework));
