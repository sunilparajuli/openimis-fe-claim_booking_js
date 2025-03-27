
import messages_en from "./translations/en.json";
import reducer from "./reducer";
const ROUTE_BOOKINGS = "claim/bookings";
const ROUTE_BOOKING_EDIT = "claim/booking";
import BookingMainMenu from "./menus/BookingMainMenu";
import ClaimBookingsPage from "./pages/ClaimBookingsPage";
import ClaimBookingPage from "./pages/ClaimBookingPage";



const DEFAULT_CONFIG = {
  "translations": [{ key: "en", messages: messages_en }],
  "reducers": [{ key: "booking", reducer }],
  "refs": [
    { key: "booking.route.bookings", ref: ROUTE_BOOKINGS },
    { key: "booking.route.bookingEdit", ref: ROUTE_BOOKING_EDIT },
  ],
  "core.Router": [
    { path: ROUTE_BOOKINGS, component: ClaimBookingsPage },
    { path: ROUTE_BOOKING_EDIT + "/:booking_uuid?", component: ClaimBookingPage },
  ],
  "core.MainMenu": [BookingMainMenu]
};

export const ClaimBookingModule = (cfg) => {
  return { ...DEFAULT_CONFIG, ...cfg };
};
