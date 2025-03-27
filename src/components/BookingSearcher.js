import React, { Component, Fragment } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import {
  withModulesManager,
  formatMessageWithValues,
  historyPush,
  withHistory,
  Searcher,
  coreAlert,
  PublishedComponent,
} from "@openimis/fe-core";
import { fetchClaimBookings } from "../actions"; // Removed unused actions
import BookingFilter from "./BookingFilter";
import { IconButton, CircularProgress, Tooltip } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";


const BOOKING_SEARCHER_CONTRIBUTION_KEY = "booking.BookingSearcher";

class BookingSearcher extends Component {
  state = {
    open: false,
    id: null,
    confirmedAction: null,
    reset: 0,
  };

  constructor(props) {
    super(props);
    this.rowsPerPageOptions = props.modulesManager.getConf(
      "fe-booking",
      "bookingFilter.rowsPerPageOptions",
      [10, 20, 50, 100]
    );
    this.defaultPageSize = props.modulesManager.getConf(
      "fe-booking",
      "bookingFilter.defaultPageSize",
      10
    );
  }

  componentDidUpdate(prevProps) {
    if (prevProps.submittingMutation && !this.props.submittingMutation) {
      this.props.journalize(this.props.mutation);
      if (this.props.errorMutation) {
        this.props.coreAlert(
          "Error",
          formatMessageWithValues(this.props.intl, "booking", "mutationError", {
            error: this.props.errorMutation.message,
          })
        );
      } else {
        const label = this.props.mutation.clientMutationLabel;
        if (label === "Send Notice Email") {
          this.props.coreAlert(
            "Success",
            formatMessageWithValues(this.props.intl, "booking", "emailSent", {
              clientClaimId: this.props.mutation.clientClaimId,
            })
          );
        } else if (label === "Send Notice SMS") {
          this.props.coreAlert(
            "Success",
            formatMessageWithValues(this.props.intl, "booking", "smsSent", {
              clientClaimId: this.props.mutation.clientClaimId,
            })
          );
        }
      }
    }
  }

  fetch = (prms) => {
    this.props.fetchClaimBookings(this.props.modulesManager, prms);
  };

  sendEmail = (booking) => {
    this.props.sendNoticeEmail(
      this.props.modulesManager,
      booking.uuid,
      "Send Notice Email",
      null,
      { clientClaimId: booking.clientClaimId }
    );
  };

  sendSMS = (booking) => {
    this.props.sendNoticeSMS(
      this.props.modulesManager,
      booking.uuid,
      "Send Notice SMS",
      null,
      { clientClaimId: booking.clientClaimId }
    );
  };

  rowIdentifier = (r) => r.uuid;

  filtersToQueryParams = (state) => {
    let prms = Object.keys(state.filters)
      .filter(f => !!state.filters[f]['filter'])
      .map(f => state.filters[f]['filter']);
    prms.push(`first: ${state.pageSize}`);
    if (state.afterCursor) {
      prms.push(`after: "${state.afterCursor}"`);
    }
    if (state.beforeCursor) {
      prms.push(`before: "${state.beforeCursor}"`);
    }
    return prms;
  }

  canSelectAll = (selection) =>
    this.props.bookings
      .map((s) => s.uuid)
      .filter((s) => !selection.map((s) => s.uuid).includes(s)).length;
  rowLocked = (selection, booking) => !!booking.clientMutationId;

  headers = () => [
    "booking.product",
    "booking.insuree",
    "booking.health_facility",
    "booking.booked_amount",
    "booking.client_claim_id",
    "booking.visit_date",
    "booking.actions",
  ];

  sorts = () => [
    ["product", true],
    ["insuree", true],
    ["healthFacility", true],
    ["bookedAmount", true],
    ["clientClaimId", true],
    ["visitDate", true],
  ];

  itemFormatters = () => [
    (b) => b.product?.name || b.product?.code || "",
    (b) => `${b.insuree?.otherNames || ""} ${b.insuree?.lastName || ""}`,
    (b) => b.healthFacility?.name || b.healthFacility?.code || "",
    (b) => b.bookedAmount,
    (b) => b.clientClaimId || "",
    (b) => b.visitDate,
    (b) => (
      <div>
        <Tooltip
          title={formatMessageWithValues(this.props.intl, "booking", "sendSMS")}
        >
          <IconButton
            onClick={() => this.sendSMS(b)}
            disabled={
              this.props.submittingMutation &&
              this.props.mutation.clientMutationLabel === "Send Notice SMS"
            }
          >
            <DeleteIcon style={{ color: "#000000" }} />
          </IconButton>
        </Tooltip>
        <Tooltip
          title={formatMessageWithValues(this.props.intl, "booking", "editBooking")}
        >
          <IconButton
            onClick={() =>
              historyPush(
                this.props.modulesManager,
                this.props.history,
                "booking.route.bookingEdit",
                [b.uuid]
              )
            }
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
      </div>
    ),
  ];

  editBooking = (b) =>
    historyPush(
      this.props.modulesManager,
      this.props.history,
      "booking.route.bookingEdit",
      [b.uuid]
    );

  render() {
    const {
      intl,
      bookings,
      bookingsPageInfo,
      fetchingBookings,
      fetchedBookings,
      errorBookings,
      filterPaneContributionsKey,
      cacheFiltersKey,
      FilterExt,
    } = this.props;
    let count = bookingsPageInfo.totalCount ?? 0;

    return (
      <Fragment>
        <PublishedComponent>
          <div id="booking.route.allBookings"> </div>
        </PublishedComponent>
        <Searcher
          module="booking"
          cacheFiltersKey={cacheFiltersKey}
          FilterPane={BookingFilter}
          FilterExt={FilterExt}
          filterPaneContributionsKey={filterPaneContributionsKey || BOOKING_SEARCHER_CONTRIBUTION_KEY}
          items={bookings}
          itemsPageInfo={bookingsPageInfo}
          fetchingItems={fetchingBookings}
          fetchedItems={fetchedBookings}
          errorItems={errorBookings}
          tableTitle={formatMessageWithValues(intl, "booking", "bookings_table.count", {
            count,
          })}
          rowsPerPageOptions={this.rowsPerPageOptions}
          defaultPageSize={this.defaultPageSize}
          fetch={this.fetch}
          rowIdentifier={this.rowIdentifier}
          filtersToQueryParams={this.filtersToQueryParams}
          defaultOrderBy="-visitDate"
          rowLocked={this.rowLocked}
          headers={this.headers}
          itemFormatters={this.itemFormatters}
          sorts={this.sorts}
          onDoubleClick={this.editBooking}
        />
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  rights: state.core?.user?.i_user?.rights || [],
  fetchingBookings: state.booking?.fetchingBookings || false,
  fetchedBookings: state.booking?.fetchedBookings || false,
  bookings: state.booking?.bookings || [],
  bookingsPageInfo: state.booking?.bookingsPageInfo || {},
  errorBookings: state.booking?.errorBookings || null,
  submittingMutation: state.booking?.submittingMutation || false,
  mutation: state.booking?.mutation || {},
  errorMutation: state.booking?.errorMutation || null,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      fetchClaimBookings,
      coreAlert,
      journalize: (mutation) => ({ type: "JOURNALIZE", payload: mutation }),
    },
    dispatch
  );
};

export default withModulesManager(
  withHistory(
    connect(mapStateToProps, mapDispatchToProps)(injectIntl(BookingSearcher))
  )
);