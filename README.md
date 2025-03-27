# openIMIS Frontend Booking Reference Module

This repository holds the files of the openIMIS Frontend Booking reference module. It is designed to be deployed as a module of `openimis-fe_js`.

## Main Menu Contributions
- **Bookings** (`booking.mainMenu` translation key)
- **Booking List** (`booking.menu.bookingList` translation key), displayed if the user has at least one of the specified rights [TBD: e.g., 112001, 112002].
- **Create Booking** (`booking.menu.createBooking` translation key), displayed if the user has the right [TBD: e.g., 112003].

## Other Contributions
- `core.Router`: Registers the `booking/list`, `booking/create`, and `booking/edit/:booking_uuid` routes in the openIMIS client-side router.

## Available Contribution Points
- **booking.MainMenu**: Ability to add entries within the main menu entry.
- **booking.Filter**: Ability to extend the `BookingFilter` (inside the criteria form) for the Booking List screen.
- **booking.Searcher**: Ability to extend the `BookingSearcher` (between the criteria form and the results table).
- **booking.BookingForm**: Ability to extend the `BookingForm` (entity displayed to add or edit bookings).
- **booking.MasterPanel**: Ability to extend the first section (paper) of the `BookingForm` (used by `BookingMasterPanel`).
- **booking.AttachmentsDialog**: Ability to extend the attachments dialog for bookings.
- **booking.SelectionAction**: Ability to extend the `BookingSearcher` action menu.

## Published Components
- **booking.AttachmentGeneralTypePicker**: Constant-based picker for attachment types (`FILE`, `URL`), translation keys: `booking.attachmentGeneralType.FILE`, `booking.attachmentGeneralType.URL`.
- **booking.BookingMasterPanelExt**: Ready-to-use extension for `booking.MasterPanel`, potentially loading additional booking-related data (e.g., health facility details).

## Dispatched Redux Actions
- `BOOKING_FETCH_BOOKINGS_{REQ|RESP|ERR}`: Querying for bookings (filter updates or refresh button pushed).
- `BOOKING_FETCH_BOOKING_{REQ|RESP|ERR}`: Loading a single booking (e.g., on edit).
- `BOOKING_MUTATION_{REQ|ERR}`: Sending a mutation (create, update, delete).
- `BOOKING_CREATE_BOOKING_RESP`: Receiving the result of a create booking mutation.
- `BOOKING_UPDATE_BOOKING_RESP`: Receiving the result of an update booking mutation.
- `BOOKING_DELETE_BOOKING_RESP`: Receiving the result of a delete booking mutation.
- `BOOKING_FETCH_ATTACHMENTS_{REQ|RESP|ERR}`: Loading attachments for a booking.
- `BOOKING_CREATE_ATTACHMENT_RESP`: Receiving the result of a create attachment mutation.
- `BOOKING_UPDATE_ATTACHMENT_RESP`: Receiving the result of an update attachment mutation.
- `BOOKING_DELETE_ATTACHMENT_RESP`: Receiving the result of a delete attachment mutation.

## Other Modules Listened Redux Actions
None

## Other Modules Redux State Bindings
- `state.core.user`: To access user info (rights, etc.).
- `state.loc.userHealthFacilityFullPath`: Retrieving the user’s health facility (and its district and region).

## Configuration Options
- **debounceTime**: Debounce time (ms) before triggering search in `BookingFilter` (Default: `800`).
- **bookingFilter.rowsPerPageOptions**: Pagination page size options in `BookingSearcher` component (Default: `[10, 20, 50, 100]`).
- **bookingFilter.defaultPageSize**: Pagination pre-selected page size in `BookingSearcher` component (Default: `10`).
- **bookingForm.maxTitleLength**: Maximum length of the booking title (Default: `255`).
- **bookingForm.defaultPriority**: Default priority level when creating a booking (Default: `BOOKING_PRIORITY_LEVELS[0]`, e.g., "Low").
- **bookingAttachments.allowedDomains**: List of allowed domains for URL attachments (Default: `[]`, meaning no restriction).
- **bookingAttachments.supportedMimeTypes**: List of supported MIME types for file attachments (Default: `['application/pdf', 'image/jpeg', 'image/jpg']`).
- **bookingAttachments.devMode**: Boolean to bypass MIME type restrictions in development (Default: `false`).

## Fields Description
- **title**: The title of the booking (required).
- **createdAt**: The creation date of the booking (defaults to current date).
- **priority**: Priority level of the booking (e.g., Low, Medium, High), selected from `BOOKING_PRIORITY_LEVELS` (required).
- **healthFacility**: The associated health facility, linked via `location.HealthFacilityPicker` (required).
- **description**: A detailed description of the booking (required, multiline).
- **isActive**: Boolean indicating if the booking is active (optional).
- **attachments**: Collection of file or URL attachments (managed via `BookingAttachmentsDialog`).