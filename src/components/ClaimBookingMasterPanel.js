import React, { Component } from "react";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { Grid, Typography } from "@material-ui/core";
import {
  formatMessage,
  FormPanel,
  TextInput,
  Contributions,
  withModulesManager,
  PublishedComponent,
  ControlledField,
  AmountInput,
} from "@openimis/fe-core";

const styles = (theme) => ({
  paper: theme.paper.paper,
  paperHeader: theme.paper.header,
  item: theme.paper.item,
  fullHeight: {
    height: "100%",
  },
});

const CLAIM_BOOKING_MASTER_PANEL_CONTRIBUTION_KEY = "claimBooking.MasterPanel";
const CLAIM_BOOKING_PANELS_CONTRIBUTION_KEY = "claimBooking.panels";

class ClaimBookingMasterPanel extends FormPanel {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      classes,
      edited,
      title = "ClaimBooking",
      titleParams = { label: "" },
      readOnly = false,
      intl,
      reset,
    } = this.props;

    if (!edited) return null;

    return (
      <Grid container>
        <Grid container className={classes.paperHeader}>
          <Contributions
            {...this.props}
            updateAttribute={this.updateAttribute}
            contributionKey={CLAIM_BOOKING_MASTER_PANEL_CONTRIBUTION_KEY}
          />
        </Grid>

        <ControlledField
          module="claimBooking"
          id="ClaimBooking.product"
          field={
            <Grid item xs={6} className={classes.item}>
              <PublishedComponent
                pubRef="product.ProductPicker"
                module="claimBooking"
                label="claimBooking.booking.product"
                value={edited.product}
                onChange={(v) => this.updateAttribute("product", v)}
                required={true}
                readOnly={readOnly}
              />
            </Grid>
          }
        />
        <ControlledField
          module="claimBooking"
          id="ClaimBooking.insuree"
          field={
            <Grid item xs={6} className={classes.item}>
              <PublishedComponent
                pubRef="insuree.InsureePicker"
                module="claimBooking"
                label="claimBooking.booking.insuree"
                value={edited.insuree}
                onChange={(v) => this.updateAttribute("insuree", v)}
                required={true}
                readOnly={readOnly}
              />
            </Grid>
          }
        />
        <ControlledField
          module="claimBooking"
          id="ClaimBooking.healthFacility"
          field={
            <Grid item xs={6} className={classes.item}>
              <PublishedComponent
                pubRef="location.HealthFacilityPicker"
                module="claimBooking"
                label="claimBooking.booking.health_facility"
                value={edited.healthFacility}
                onChange={(v) => this.updateAttribute("healthFacility", v)}
                required={true}
                readOnly={readOnly}
              />
            </Grid>
          }
        />
        <ControlledField
          module="claimBooking"
          id="ClaimBooking.bookedAmount"
          field={
            <Grid item xs={6} className={classes.item}>
              <AmountInput
                module="claimBooking"
                label="claimBooking.booking.booked_amount"
                value={edited.bookedAmount}
                onChange={(v) => this.updateAttribute("bookedAmount", v)}
                required={true}
                readOnly={readOnly}
              />
            </Grid>
          }
        />
        <ControlledField
          module="claimBooking"
          id="ClaimBooking.visitDate"
          field={
            <Grid item xs={6} className={classes.item}>
              <PublishedComponent
                pubRef="core.DatePicker"
                module="claimBooking"
                label="claimBooking.booking.visit_date"
                value={edited.visitDate}
                onChange={(v) => this.updateAttribute("visitDate", v)}
                required={true}
                readOnly={readOnly}
                reset={reset}
              />
            </Grid>
          }
        />
        <ControlledField
          module="claimBooking"
          id="ClaimBooking.validityFrom"
          field={
            <Grid item xs={6} className={classes.item}>
              <PublishedComponent
                pubRef="core.DatePicker"
                module="claimBooking"
                label="claimBooking.booking.validity_from"
                value={edited.validityFrom}
                onChange={(v) => this.updateAttribute("validityFrom", v)}
                readOnly={readOnly}
                reset={reset}
              />
            </Grid>
          }
        />
        <ControlledField
          module="claimBooking"
          id="ClaimBooking.validityTo"
          field={
            <Grid item xs={6} className={classes.item}>
              <PublishedComponent
                pubRef="core.DatePicker"
                module="claimBooking"
                label="claimBooking.booking.validity_to"
                value={edited.validityTo}
                onChange={(v) => this.updateAttribute("validityTo", v)}
                readOnly={readOnly}
                reset={reset}
              />
            </Grid>
          }
        />
        <ControlledField
          module="claimBooking"
          id="ClaimBooking.clientClaimId"
          field={
            <Grid item xs={6} className={classes.item}>
              <TextInput
                module="claimBooking"
                label="claimBooking.booking.client_claim_id"
                value={edited.clientClaimId}
                onChange={(v) => this.updateAttribute("clientClaimId", v)}
                readOnly={readOnly}
              />
            </Grid>
          }
        />

        <Contributions
          {...this.props}
          updateAttribute={this.updateAttribute}
          contributionKey={CLAIM_BOOKING_PANELS_CONTRIBUTION_KEY}
        />
      </Grid>
    );
  }
}

export default withModulesManager(withTheme(withStyles(styles)(ClaimBookingMasterPanel)));