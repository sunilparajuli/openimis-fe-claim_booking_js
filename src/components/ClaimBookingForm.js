import React, { Component, Fragment } from "react";
import { injectIntl } from 'react-intl';
import { connect } from "react-redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { bindActionCreators } from "redux";
import {
    formatMessageWithValues, withModulesManager, withHistory, historyPush, journalize,
    Form, ProgressOrError, formatMessage, coreAlert
} from "@openimis/fe-core";
import ClaimBookingMasterPanel from "../components/ClaimBookingMasterPanel";
import { createClaimBooking, updateClaimBooking, fetchClaimBookings } from "../actions"; // Adjust action imports
import { RIGHT_ADD } from "../constants";

const styles = theme => ({
    page: theme.page,
    paperHeaderAction: theme.paper.action,
});

class ClaimBookingForm extends Component {
    state = {
        lockNew: false,
        reset: 0,
        claimBooking_uuid: null,
        claimBooking: this._newClaimBooking(),
        newClaimBooking: true,
        readOnlydevMode: false,
    }

    _newClaimBooking() {
        return {
            uuid: this.props.claimBooking?.uuid ?? null,
            product: this.props.claimBooking?.product ?? null,
            insuree: this.props.claimBooking?.insuree ?? null,
            healthFacility: this.props.claimBooking?.healthFacility ?? null,
            bookedAmount: this.props.claimBooking?.bookedAmount ?? "",
            visitDate: this.props.claimBooking?.visitDate ?? null,
            validityFrom: this.props.claimBooking?.validityFrom ?? null,
            validityTo: this.props.claimBooking?.validityTo ?? null,
            clientClaimId: this.props.claimBooking?.clientClaimId ?? "",
        };
    }

    componentDidMount() {
        document.title = formatMessageWithValues(
            this.props.intl, "claimBooking", "claimBookings", { label: "Claim Bookings" }
        );
        if (this.props.claimBooking_uuid) {
            this.setState(
                { claimBooking_uuid: this.props.claimBooking_uuid },
                () => this.props.fetchClaimBookings(
                    this.props.modulesManager,
                    [`uuid: "${this.props.claimBooking_uuid}"`]
                )
            );
        }
    }

    back = () => {
        const { modulesManager, history } = this.props;
        historyPush(modulesManager, history, "claimBooking.route.claimBookings");
    }

    componentDidUpdate(prevProps) {
        if (prevProps.fetchingBookings !== this.props.fetchingBookings && this.props.fetchedBookings) {
            const claimBooking = this.props.bookings[0]; // Assuming fetch returns a single booking
            this.setState({
                claimBooking,
                claimBooking_uuid: claimBooking?.uuid,
                lockNew: false,
                newClaimBooking: false,
            });
        } else if (prevProps.claimBooking_uuid && !this.props.claimBooking_uuid) {
            document.title = formatMessage(this.props.intl, "claimBooking", "ClaimBookingForm.title.new");
            this.setState({
                claimBooking: this._newClaimBooking(),
                newClaimBooking: true,
                lockNew: false,
                claimBooking_uuid: null,
            });
        } else if (prevProps.submittingMutation && !this.props.submittingMutation) {
            this.props.journalize(this.props.mutation);
            this.setState({ reset: this.state.reset + 1 });
        }
    }

    _add = () => {
        this.setState(
            (state) => ({
                claimBooking: this._newClaimBooking(),
                newClaimBooking: true,
                lockNew: false,
                reset: state.reset + 1,
            }),
            () => this.forceUpdate()
        );
    }

    reload = () => {
        this.props.fetchClaimBookings(
            this.props.modulesManager,
            [`uuid: "${this.state.claimBooking_uuid}"`]
        );
    }

    canSave = () => {
        const { claimBooking } = this.state;
        if (!claimBooking.product) return false;
        if (!claimBooking.insuree) return false;
        if (!claimBooking.healthFacility) return false;
        if (!claimBooking.bookedAmount || claimBooking.bookedAmount <= 0) return false;
        if (!claimBooking.visitDate) return false;
        return true;
    }

    _save = (claimBooking) => {
        if (!this.canSave()) {
            this.props.coreAlert(
                formatMessage(this.props.intl, "claimBooking", "claimBooking.missingFields"),
                formatMessage(this.props.intl, "claimBooking", "claimBooking.fillRequiredFields")
            );
            this.setState({ reset: this.state.reset + 1 });
            return;
        }
        this.setState(
            { lockNew: !claimBooking.uuid },
            () => this.props.save(claimBooking)
        );
    }

    onEditedChanged = claimBooking => {
        this.setState({ claimBooking, newClaimBooking: false });
    }

    render() {
        const {
            intl, claimBooking_uuid, fetchingBookings, fetchedBookings, errorBookings,
            save, rights, classes
        } = this.props;
        const { claimBooking, lockNew } = this.state;

        const readOnly = (lockNew || !rights.includes(RIGHT_ADD)) && this.state.readOnlydevMode;

        const actions = [];
        if (claimBooking_uuid) {
            actions.push({
                doIt: this.reload,
                icon: <ReplayIcon />,
                onlyIfDirty: !readOnly,
            });
        }

        return (
            <div>
                <ProgressOrError progress={fetchingBookings} error={errorBookings} />
                {(fetchedBookings || !claimBooking_uuid) && (
                    <Fragment>
                        <Form
                            module="claimBooking"
                            edited_id={claimBooking_uuid}
                            edited={claimBooking}
                            reset={this.state.reset}
                            title={claimBooking_uuid ? "ClaimBookingForm.title" : "ClaimBookingForm.title.new"}
                            titleParams={{ code: claimBooking_uuid || "" }}
                            back={this.back}
                            add={this._add}
                            save={save ? this._save : null}
                            canSave={this.canSave}
                            reload={claimBooking_uuid && this.reload}
                            readOnly={readOnly}
                            HeadPanel={ClaimBookingMasterPanel}
                            Panels={[]} // No additional panels like NoticeNotificationPanel
                            onEditedChanged={this.onEditedChanged}
                            actions={actions}
                        />
                    </Fragment>
                )}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    fetchingBookings: state.booking?.fetchingBookings || false,
    errorBookings: state.booking?.errorBookings,
    fetchedBookings: state.booking?.fetchedBookings,
    bookings: state.booking?.bookings || [],
    submittingMutation: state.booking?.submittingMutation,
    mutation: state.booking?.mutation,
    rights: state.core?.user?.i_user?.rights || [],
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ 
        createClaimBooking, 
        updateClaimBooking, 
        fetchClaimBookings, 
        journalize, 
        coreAlert 
    }, dispatch);
};

export default withHistory(
    withModulesManager(
        connect(mapStateToProps, mapDispatchToProps)(
            injectIntl(withTheme(withStyles(styles)(ClaimBookingForm)))
        )
    )
);