import React, { Component } from "react";
import { injectIntl } from 'react-intl';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import {
    formatMessageWithValues, withModulesManager, withHistory, historyPush,
} from "@openimis/fe-core";
import NoticeForm from  "../components/ClaimBookingForm"
import { createClaimBooking, updateClaimBooking } from "../actions";
import { RIGHT_CLAIM_BOOKING_ADD, RIGHT_CLAIM_BOOKING_EDIT } from "../constants";


const styles = theme => ({
    page: theme.page,
});

class BookingPage extends Component {
    add = () => {
        historyPush(this.props.modulesManager, this.props.history, "notice.route.notice_edit");
    }

    
    save = (notice) => {
        if (!notice.uuid) {
            this.props.createClaimBooking(
                this.props.modulesManager,
                notice,
                formatMessageWithValues(
                    this.props.intl,
                    "notice",
                    "createClaimBooking.mutationLabel",
                    { label: notice.uuid || "" }
                )
            );
        } else {
            this.props.updateClaimBooking(
                this.props.modulesManager,
                notice,
                formatMessageWithValues(
                    this.props.intl,
                    "notice",
                    "updateClaimBooking.mutationLabel",
                    { label: notice.uuid || "" }
                )
            );
        }
    }

    render() {
        const { classes, modulesManager, history, rights, notice_uuid } = this.props;
            //if (!rights.includes(RIGHT_CLAIM_BOOKING_ADD)) return null;
        return (
            <div className={classes.page}>
                <NoticeForm
                    notice_uuid={notice_uuid}
                    back={() => historyPush(modulesManager, history, "booking.route.bookings")}
                    add={rights.includes(RIGHT_CLAIM_BOOKING_ADD) ? this.add : null}
                    save={rights.includes(RIGHT_CLAIM_BOOKING_EDIT) ? this.save : null}
                />
            </div>
           
        );
    }
}

const mapStateToProps = (state, props) => ({
    rights: state.core?.user?.i_user?.rights || [],
    notice_uuid: props.match.params.notice_uuid,
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ createClaimBooking, updateClaimBooking }, dispatch);
};

export default withHistory(withModulesManager(connect(mapStateToProps, mapDispatchToProps)(
    injectIntl(withTheme(withStyles(styles)(BookingPage)))
)));
