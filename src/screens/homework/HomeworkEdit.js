import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as moment from 'moment';

import './HomeworkEdit.css';

import Page from '../../components/Page';
import Container from '../../components/Container';
import Header from '../../components/Header';
import OptionGroup from '../../components/OptionGroup';
import Modal from '../../components/Modal';
import List, { ListItem } from '../../components/List';
import LoadingSpinner from '../../components/LoadingSpinner';

import * as actions from '../../actions';
import * as utils from '../../utils';
import {HOMEWORK_COLOUR} from '../../consts';

class HomeworkEdit extends Component {
    updateField = (field, editUpdateField) => event => editUpdateField(field, event.target.value);

    selectSubjectFromIndex = subjectIndex => {
        if(subjectIndex < this.props.homeworkEdit.subjectOptions.length) {
            this.selectSubject(this.props.homeworkEdit.subjectOptions[subjectIndex]);
        } else {
            this.props.editSetModalOpen('SUBJECT');
        }
    }

    selectSubject = subject => {
        this.props.editSelectSubject(subject, this.props.timetable);
        this.props.editSetModalOpen(false);
    }

    selectDateFromIndex = dateIndex => {
        if(dateIndex < this.props.homeworkEdit.dateOptions.length) {
            this.selectDate(this.props.homeworkEdit.dateOptions[dateIndex]);
        } else {
            this.props.editSetModalOpen('DATE');
        }
    }

    selectDate = date => this.props.editSelectDate(date);

    save = e => {
        e.preventDefault();

        const formData = this.props.homeworkEdit;
        if(!this.isValid(formData)) return;
        
        const homework = {
            title: formData.title,
            notes: formData.notes,
            due: formData.selectedDate.startOf('day').toDate(),
            completed: false,
            period: utils.firstInstanceOfSubject(formData.selectedSubject, formData.selectedDate, this.props.timetable)
        };
        if(this.props.homework) {
            this.props.updateHomework(this.props.homework.id, homework);
        } else {
            this.props.saveHomework(homework);
        }
    }

    isValid = data => {
        return data.title.length > 0 && data.selectedDate && data.selectedSubject;
    }

    componentWillMount() {
        if(!this.props.loggedIn) {
            this.props.history.replace('/login');
            return;
        }
        if(!this.props.loading) {
            this.props.editLoad(moment(), this.props.timetable, this.props.homework);
        }
    }

    componentWillReceiveProps(newProps) {
        if(this.props.loading && !newProps.loading) {
            newProps.editLoad(moment(), newProps.timetable, newProps.homework);
        }
        if(this.props.homeworkEdit.saving && newProps.homeworkEdit.success) {
            this.props.history.push('/homework');
        }
    }

    onKeyDown = e => {
        if(e.ctrlKey && e.keyCode == 13) {
            this.save(e);
        }
    }

    render() {
        if(!this.props.loading) {
            const formState = this.props.homeworkEdit;

            const selectedSubjectIndex = formState.selectedSubject ? formState.subjectOptions.findIndex(subject => subject === formState.selectedSubject) : null;
            const dateOptions = [...formState.dateOptions.map(date => date.format('dddd Do MMMM')), 'Other'];
            dateOptions[0] = 'Next lesson';
            const selectedDateIndex = formState.selectedDate ? formState.dateOptions.findIndex(date => date.isSame(formState.selectedDate, 'day')) : null;

            let subjectModal = null;
            if(formState.modal === 'SUBJECT') {
                const subjects = utils.getAllSubjectsInTimetable(this.props.timetable)
                    .map(subject => <ListItem key={subject} title={subject} onClick={() => this.selectSubject(subject)}/>);
                subjectModal = <Modal onClose={() => this.props.editSetModalOpen(false)}><List title="Subjects" items={subjects} border/></Modal>;
            }

            let dateModal = null;
            if(formState.modal === 'DATE') {
                const dates = utils.getNextPeriodsOfSubject(formState.selectedSubject, this.props.timetable, 10)
                    .map(date => <ListItem key={date.toString()} title={date.format('dddd Do MMMM')} onClick={() => this.selectDate(date)}/>);
                dateModal = <Modal onClose={() => this.props.editSetModalOpen(false)}><List title="Due" items={dates} border/></Modal>
            }

            const submitEnabled = this.isValid(formState);

            return (
                <Page name="homeworkedit" background={HOMEWORK_COLOUR}>
                    <Header colour="transparent" noshadow onBack={() => this.props.history.goBack()}>Edit homework</Header>
                    <Container horizontal>
                        <OptionGroup
                            title="Subject"
                            options={[...formState.subjectOptions, 'Pick'] || ['Other']}
                            selected={selectedSubjectIndex}
                            onSelected={this.selectSubjectFromIndex}/>
                        {formState.subjectOptions.length > 0 ?
                            <OptionGroup
                                title="Due"
                                options={[...dateOptions]}
                                selected={selectedDateIndex}
                                onSelected={this.selectDateFromIndex}/>
                        : null}
                        <form onSubmit={this.save}>
                            <input type="text" placeholder="Title" value={formState.title} onKeyDown={this.onKeyDown} onChange={this.updateField('title', this.props.editUpdateField)}/>
                            <textarea placeholder="Notes" rows="5" value={formState.notes} onKeyDown={this.onKeyDown} onChange={this.updateField('notes', this.props.editUpdateField)}></textarea>
                            <button disabled={!submitEnabled || formState.saving}>{formState.saving ? 'Saving' : 'Save'}</button>
                            <p className="Help" style={{visibility: this.props.homeworkEdit.error ? 'visible' : 'hidden'}}>{this.props.homeworkEdit.error || 'Placeholder'}</p>
                        </form>
                    </Container>
                    {subjectModal}
                    {dateModal}
                </Page>
            );
        } else {
            return (
                <Page name="homeworkedit">
                    <Header colour="transparent" noshadow onBack={() => this.props.history.goBack()}>Edit homework</Header>
                    <LoadingSpinner colour="white"/>
                </Page>
            )
        }
    }
}

export default connect((state, props) => {
    const { homeworkEdit } = state;
    const { timetable, homework, authToken, loadingTimetable, loadingHomework } = state.datastore;
    if(props.match.params.id) {
        const assignment = homework.find(x => x.id.toString() === props.match.params.id);
        return {loggedIn: !!authToken, homework: assignment, timetable, homeworkEdit, loading: loadingHomework || loadingTimetable};
    } else {
        return {loggedIn: !!authToken, homework: null, timetable, homeworkEdit, loading: loadingTimetable};
    }
}, actions)(withRouter(HomeworkEdit));