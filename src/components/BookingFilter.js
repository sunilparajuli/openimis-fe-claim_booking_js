import React, { Component } from "react";
import _debounce from "lodash/debounce";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import { Grid } from "@material-ui/core";
import {
    withModulesManager,
    Contributions,
    ControlledField,
    TextInput,
    PublishedComponent,
} from "@openimis/fe-core";

const styles = (theme) => ({
    dialogTitle: theme.dialog.title,
    dialogContent: theme.dialog.content,
    form: {
        padding: 0,
    },
    item: {
        padding: theme.spacing(1),
    },
    paperDivider: theme.paper.divider,
});

const BOOKING_FILTER_CONTRIBUTION_KEY = "booking.Filter";

class BookingFilter extends Component {
    state = {
        showHistory: false, // Keeping this as it might be relevant for future use
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (
            prevProps.filters["showHistory"] !== this.props.filters["showHistory"] &&
            !!this.props.filters["showHistory"] &&
            this.state.showHistory !== this.props.filters["showHistory"]["value"]
        ) {
            this.setState((state, props) => ({
                showHistory: props.filters["showHistory"]["value"],
            }));
        }
    }

    debouncedOnChangeFilter = _debounce(
        this.props.onChangeFilters,
        this.props.modulesManager.getConf("fe-booking", "debounceTime", 800)
    );

    _filterValue = (k) => {
        const { filters } = this.props;
        return filters && filters[k] ? filters[k].value : null;
    };

    _onChangeFilter = (id, value, filter) => {
        this.debouncedOnChangeFilter([
            {
                id,
                value,
                filter,
            },
        ]);
    };

    _onChangeShowHistory = () => {
        let filters = [
            {
                id: "showHistory",
                value: !this.state.showHistory,
                filter: `showHistory: ${!this.state.showHistory}`,
            },
        ];
        this.props.onChangeFilters(filters);
        this.setState((state) => ({
            showHistory: !state.showHistory,
        }));
    };

    render() {
        const { intl, classes, filters, onChangeFilters } = this.props;
        return (
            <Grid container className={classes.form}>
                {/* Product Filter */}
                <ControlledField
                    module="booking"
                    id="BookingFilter.product"
                    field={
                        <Grid item xs={3} className={classes.item}>
                            <PublishedComponent
                                pubRef="product.ProductPicker"
                                module="booking"
                                label="booking.product"
                                value={this._filterValue("product")}
                                onChange={(v) =>
                                    this._onChangeFilter("product", v, `product_Uuid: "${v?.uuid}"`)
                                }
                                withNull
                            />
                        </Grid>
                    }
                />

                {/* Insuree Filter */}
                <ControlledField
                    module="booking"
                    id="BookingFilter.insuree"
                    field={
                        <Grid item xs={3} className={classes.item}>
                            <PublishedComponent
                                pubRef="insuree.InsureePicker"
                                module="booking"
                                label="booking.insuree"
                                value={this._filterValue("insuree")}
                                onChange={(v) =>
                                    this._onChangeFilter("insuree", v, `insuree_Uuid: "${v?.uuid}"`)
                                }
                                withNull
                            />
                        </Grid>
                    }
                />

                {/* Health Facility Filter */}
                <ControlledField
                    module="booking"
                    id="BookingFilter.healthFacility"
                    field={
                        <Grid item xs={3} className={classes.item}>
                            <PublishedComponent
                                pubRef="location.HealthFacilityPicker"
                                module="booking"
                                label="booking.health_facility"
                                value={this._filterValue("healthFacility")}
                                onChange={(v) =>
                                    this._onChangeFilter(
                                        "healthFacility",
                                        v,
                                        `healthFacility_Uuid: "${v?.uuid}"`
                                    )
                                }
                                withNull
                            />
                        </Grid>
                    }
                />

                {/* Booked Amount Filter */}
                <ControlledField
                    module="booking"
                    id="BookingFilter.bookedAmount"
                    field={
                        <Grid item xs={2} className={classes.item}>
                            <TextInput
                                module="booking"
                                label="booking.booked_amount"
                                name="bookedAmount"
                                type="number"
                                value={this._filterValue("bookedAmount")}
                                onChange={(v) =>
                                    this._onChangeFilter("bookedAmount", v, `bookedAmount: ${v}`)
                                }
                            />
                        </Grid>
                    }
                />

                {/* Client Claim ID Filter */}
                <ControlledField
                    module="booking"
                    id="BookingFilter.clientClaimId"
                    field={
                        <Grid item xs={3} className={classes.item}>
                            <TextInput
                                module="booking"
                                label="booking.client_claim_id"
                                name="clientClaimId"
                                value={this._filterValue("clientClaimId")}
                                onChange={(v) =>
                                    this._onChangeFilter(
                                        "clientClaimId",
                                        v,
                                        `clientClaimId_Icontains: "${v}"`
                                    )
                                }
                            />
                        </Grid>
                    }
                />

                {/* Visit Date Filter */}
                <ControlledField
                    module="booking"
                    id="BookingFilter.visitDate"
                    field={
                        <Grid item xs={3} className={classes.item}>
                            <PublishedComponent
                                pubRef="core.DatePicker"
                                value={this._filterValue("visitDate")}
                                module="booking"
                                label="booking.visit_date"
                                onChange={(v) =>
                                    this._onChangeFilter("visitDate", v, `visitDate: "${v}"`)
                                }
                            />
                        </Grid>
                    }
                />

                {/* Contributions for extensibility */}
                <Contributions
                    filters={filters}
                    onChangeFilters={onChangeFilters}
                    contributionKey={BOOKING_FILTER_CONTRIBUTION_KEY}
                />
            </Grid>
        );
    }
}

export default withModulesManager(
    injectIntl(withTheme(withStyles(styles)(BookingFilter)))
);