# openIMIS Frontend Notice Reference Module

This repository holds the files of the openIMIS Frontend Notice reference module. It is designed to be deployed as a module of `openimis-fe_js`.

## Main Menu Contributions
- **Notices** (`notice.mainMenu` translation key)
- **Notice List** (`notice.menu.noticeList` translation key), displayed if the user has at least one of the specified rights [TBD: e.g., 112001, 112002].
- **Create Notice** (`notice.menu.createNotice` translation key), displayed if the user has the right [TBD: e.g., 112003].

## Other Contributions
- `core.Router`: Registers the `notice/list`, `notice/create`, and `notice/edit/:notice_uuid` routes in the openIMIS client-side router.

## Available Contribution Points
- **notice.MainMenu**: Ability to add entries within the main menu entry.
- **notice.Filter**: Ability to extend the `NoticeFilter` (inside the criteria form) for the Notice List screen.
- **notice.Searcher**: Ability to extend the `NoticeSearcher` (between the criteria form and the results table).
- **notice.NoticeForm**: Ability to extend the `NoticeForm` (entity displayed to add or edit notices).
- **notice.MasterPanel**: Ability to extend the first section (paper) of the `NoticeForm` (used by `NoticeMasterPanel`).
- **notice.AttachmentsDialog**: Ability to extend the attachments dialog for notices.
- **notice.SelectionAction**: Ability to extend the `NoticeSearcher` action menu.

## Published Components
- **notice.AttachmentGeneralTypePicker**: Constant-based picker for attachment types (`FILE`, `URL`), translation keys: `notice.attachmentGeneralType.FILE`, `notice.attachmentGeneralType.URL`.
- **notice.NoticeMasterPanelExt**: Ready-to-use extension for `notice.MasterPanel`, potentially loading additional notice-related data (e.g., health facility details).

## Dispatched Redux Actions
- `NOTICE_FETCH_NOTICES_{REQ|RESP|ERR}`: Querying for notices (filter updates or refresh button pushed).
- `NOTICE_FETCH_NOTICE_{REQ|RESP|ERR}`: Loading a single notice (e.g., on edit).
- `NOTICE_MUTATION_{REQ|ERR}`: Sending a mutation (create, update, delete).
- `NOTICE_CREATE_NOTICE_RESP`: Receiving the result of a create notice mutation.
- `NOTICE_UPDATE_NOTICE_RESP`: Receiving the result of an update notice mutation.
- `NOTICE_DELETE_NOTICE_RESP`: Receiving the result of a delete notice mutation.
- `NOTICE_FETCH_ATTACHMENTS_{REQ|RESP|ERR}`: Loading attachments for a notice.
- `NOTICE_CREATE_ATTACHMENT_RESP`: Receiving the result of a create attachment mutation.
- `NOTICE_UPDATE_ATTACHMENT_RESP`: Receiving the result of an update attachment mutation.
- `NOTICE_DELETE_ATTACHMENT_RESP`: Receiving the result of a delete attachment mutation.

## Other Modules Listened Redux Actions
None

## Other Modules Redux State Bindings
- `state.core.user`: To access user info (rights, etc.).
- `state.loc.userHealthFacilityFullPath`: Retrieving the user’s health facility (and its district and region).

## Configuration Options
- **debounceTime**: Debounce time (ms) before triggering search in `NoticeFilter` (Default: `800`).
- **noticeFilter.rowsPerPageOptions**: Pagination page size options in `NoticeSearcher` component (Default: `[10, 20, 50, 100]`).
- **noticeFilter.defaultPageSize**: Pagination pre-selected page size in `NoticeSearcher` component (Default: `10`).
- **noticeForm.maxTitleLength**: Maximum length of the notice title (Default: `255`).
- **noticeForm.defaultPriority**: Default priority level when creating a notice (Default: `NOTICE_PRIORITY_LEVELS[0]`, e.g., "Low").
- **noticeAttachments.allowedDomains**: List of allowed domains for URL attachments (Default: `[]`, meaning no restriction).
- **noticeAttachments.supportedMimeTypes**: List of supported MIME types for file attachments (Default: `['application/pdf', 'image/jpeg', 'image/jpg']`).
- **noticeAttachments.devMode**: Boolean to bypass MIME type restrictions in development (Default: `false`).

## Fields Description
- **title**: The title of the notice (required).
- **createdAt**: The creation date of the notice (defaults to current date).
- **priority**: Priority level of the notice (e.g., Low, Medium, High), selected from `NOTICE_PRIORITY_LEVELS` (required).
- **healthFacility**: The associated health facility, linked via `location.HealthFacilityPicker` (required).
- **description**: A detailed description of the notice (required, multiline).
- **isActive**: Boolean indicating if the notice is active (optional).
- **attachments**: Collection of file or URL attachments (managed via `NoticeAttachmentsDialog`).

