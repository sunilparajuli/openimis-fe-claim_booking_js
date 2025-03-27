import React, { Component } from "react";
import { connect } from "react-redux";
import { injectIntl } from 'react-intl';
import { withTheme, withStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import { historyPush, withModulesManager, withHistory, formatMessage } from "@openimis/fe-core";
import BookingSearcher from "../components/BookingSearcher";
import { Fab, Tooltip } from "@material-ui/core";
import { RIGHT_CLAIM_BOOKING_ADD } from "../constants";

const styles = theme => ({
    page: theme.page,
    fab: theme.fab
});

class BookingsPage extends Component {
    onDoubleClick = (i, newTab = false) => {
        historyPush(
            this.props.modulesManager,
            this.props.history,
            "booking.route.bookingEditEdit",
            [i.uuid],
            newTab
        );
    }

    onAdd = () => {
        historyPush(
            this.props.modulesManager,
            this.props.history,
            "booking.route.bookingEdit"
        );
    }

    canAdd() {
        return true;
    }

    render() {
        const { intl, classes, rights } = this.props;
        return (
            <div className={classes.page}>
                <BookingSearcher
                    onDoubleClick={this.onDoubleClick}
                />
                {/* {rights.includes(RIGHT_NOTICE_ADD || true) && (
                    <Tooltip title={this.canAdd() ? formatMessage(intl, "notice", "addNoticeTooltip") : ""}>
                        <div className={classes.fab}>
                            <Fab 
                                color="primary" 
                                disabled={!this.canAdd()} 
                                onClick={this.onAdd}
                            >
                                <AddIcon />
                            </Fab>
                        </div>
                    </Tooltip>
                )} */}
                <Tooltip title={this.canAdd() ? formatMessage(intl, "booking", "addNoticeTooltip") : ""}>
                    <div className={classes.fab}>
                        <Fab
                            color="primary"
                            disabled={!this.canAdd()}
                            onClick={this.onAdd}
                        >
                            <AddIcon />
                        </Fab>
                    </div>
                </Tooltip>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    rights: state.core?.user?.i_user?.rights || [],
});

export default injectIntl(
    withModulesManager(
        withHistory(
            connect(mapStateToProps)(
                withTheme(
                    withStyles(styles)(BookingsPage)
                )
            )
        )
    )
);
