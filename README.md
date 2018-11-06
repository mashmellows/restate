[![CodeFactor](https://www.codefactor.io/repository/github/xurasky/restate/badge)](https://www.codefactor.io/repository/github/xurasky/restate)

### RESTATE.
## About
restate is a simple experiment using the Django REST Framework + Apollo + GraphQL + React + Express.

**Technology Stack**
- React - Ejected create-react-app for custom functionality.
- Express & NodeJS - Drives the App Backend along side the GraphQL API Connections to the REST Framework.
- Apollo & GraphQL - Drives the database querying via the REST Framework.
- Django REST Framework - Stores the data via SQLite and provides a RESTFul interface.

## Installation & Running

*Installing*

**Javascript**
- `npm install`

**Python**
- `pip install -r requirements.txt`

*Running*
-  **django server** - `npm run server`
-  **react & express** `npm run dev`

*To do*
- Redux: `I've added redux bindings for firebase via redux-firebase but have not fully configured it`
- Firebase: `Original goal was to add user login/signup functionality that used Firebases Realtime DB alongside Redux for state management.`
- Documentation: `Few Places have no documentation which will be filled later on.`
- Tests: `Testing via Jest is added but I have not written any valid tests.`
