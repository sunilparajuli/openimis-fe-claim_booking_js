import {
  parseData,
  dispatchMutationReq,
  dispatchMutationResp,
  dispatchMutationErr,
  pageInfo,
  formatServerError,
  formatGraphQLError,
} from '@openimis/fe-core';

function reducer(
  state = {
    mutation: {},
    submittingMutation: false,
    fetchingBookings: false,
    errorBookings: null,
    fetchedBookings: false,
    bookings: [],
    bookingsPageInfo: { totalCount: 0 },
    errorMutation: null,
  },
  action,
) {
  switch (action.type) {
    
    case 'FETCH_BOOKINGS_REQ':
      return {
        ...state,
        fetchingBookings: true,
        fetchedBookings: false,
        bookings: [],
        bookingsPageInfo: { totalCount: 0 },
        errorBookings: null,
      };
    case 'FETCH_BOOKINGS_RESP':
      const bookings = parseData(action.payload.data.claimBookings);
      const pageInfos = pageInfo(action.payload.data.claimBookings);
      console.log('pageInfos', pageInfos);
      return {
        ...state,
        fetchingBookings: false,
        fetchedBookings: true,
        bookings: bookings || [], 
        bookingsPageInfo: pageInfo(action.payload.data.claimBookings),
        errorBookings: formatGraphQLError(action.payload),
      };
    case 'FETCH_BOOKINGS_ERR':
      return {
        ...state,
        fetchingBookings: false,
        errorBookings: formatServerError(action.payload),
      };


    case 'CLAIM_BOOKING_MUTATION_REQ':
      return dispatchMutationReq(state, action);
    case 'CLAIM_BOOKING_MUTATION_RESP':
      return dispatchMutationResp(state, 'createClaimBooking', action);
    case 'CLAIM_BOOKING_UPDATE_RESP':
      return dispatchMutationResp(state, 'updateClaimBooking', action);
    case 'CLAIM_BOOKING_MUTATION_ERR':
      return dispatchMutationErr(state, action);

    default:
      return state;
  }
}

export default reducer;