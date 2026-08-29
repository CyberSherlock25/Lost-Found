# Testing Checklist Before Deployment

## 1. Environment readiness tests
- [ ] Confirm Java 21 is installed and `JAVA_HOME` is set correctly.
- [ ] Confirm Maven is available in PATH.
- [ ] Confirm Node.js and npm are installed on the deployment machine.
- [ ] Confirm MySQL server is running.
- [ ] Confirm the database `lost_found_db` exists.
- [ ] Confirm the database user has permission to create/read/write tables.
- [ ] Confirm the app upload folder exists and is writable.

## 2. Dependency installation tests
- [ ] Run `npm --prefix frontend install` successfully.
- [ ] Run `mvn -f backend/pom.xml dependency:tree` to confirm project dependencies resolve.
- [ ] Check for any Maven dependency or Java version conflicts.

## 3. Frontend build test
- [ ] Run `npm --prefix frontend run build`.
- [ ] Confirm there are no TypeScript build errors.
- [ ] Confirm Vite builds the production bundle successfully.
- [ ] Check the generated `dist` output for missing assets or broken references.

## 4. Backend build and startup test
- [ ] Set `JAVA_HOME` to the correct JDK 21 path.
- [ ] Run `mvn -f backend/pom.xml test`.
- [ ] Confirm tests pass or investigate failing tests.
- [ ] Run `mvn -f backend/pom.xml spring-boot:run`.
- [ ] Confirm the backend starts on `http://localhost:8080`.
- [ ] Check console logs for database connection errors or security startup issues.

## 5. Database connectivity tests
- [ ] Confirm app can connect to MySQL using configured credentials.
- [ ] Validate the schema loads correctly.
- [ ] Validate seed/reference data is present.
- [ ] Test insert, read, update, and delete operations for key tables.

## 6. Authentication and role tests
- [ ] Test login for admin user.
- [ ] Test login for student user.
- [ ] Test login for teacher/faculty user.
- [ ] Test login for security staff user.
- [ ] Verify JWT access token is stored and sent in API requests.
- [ ] Verify refresh token flow works correctly.
- [ ] Test expired or invalid token behavior.
- [ ] Confirm unauthorized users are redirected or rejected.

## 7. Item workflow tests
- [ ] Test browsing items without login.
- [ ] Test report lost item flow.
- [ ] Test report found item flow.
- [ ] Validate item detail page loads correct data.
- [ ] Validate item status update flow.
- [ ] Validate item collection/closure flow.
- [ ] Confirm file upload works for item images.
- [ ] Verify large file rejection for files above the configured limit.

## 8. Claim workflow tests
- [ ] Test student submits a claim for a matching item.
- [ ] Test claim creation with valid data.
- [ ] Test claim rejection flow.
- [ ] Test claim approval flow.
- [ ] Confirm claim status updates reflect correctly in the UI.
- [ ] Validate notifications are triggered when a claim changes.

## 9. Admin and management tests
- [ ] Test user management page access for admin.
- [ ] Test category creation and update.
- [ ] Test location creation and update.
- [ ] Test announcements posting.
- [ ] Test audit log visibility for admin.
- [ ] Verify role-based access restrictions for non-admin users.

## 10. Notification and communication tests
- [ ] Verify successful notifications appear after important actions.
- [ ] Verify notification drawer loads entries correctly.
- [ ] Verify duplicate notifications are not created unexpectedly.

## 11. Security and validation tests
- [ ] Validate input validation for login/register forms.
- [ ] Validate unauthorized route access is blocked.
- [ ] Validate role-based route restrictions.
- [ ] Check for SQL injection risk in key request payloads.
- [ ] Validate secure password handling and token use.
- [ ] Confirm sensitive config values are not exposed to frontend.

## 12. UX and responsiveness tests
- [ ] Test the app on desktop screen sizes.
- [ ] Test the app on tablet/mobile widths.
- [ ] Verify navigation works correctly.
- [ ] Verify empty states and loading states appear as expected.
- [ ] Check dark glassmorphism styling is consistent.

## 13. Deployment smoke test checklist
- [ ] Backend runs without crashing.
- [ ] Frontend loads without blank screen.
- [ ] API endpoints respond successfully.
- [ ] Login works in the deployed environment.
- [ ] Core admin/student flows work in production-like mode.
- [ ] File uploads work with the deployment server storage path.
- [ ] Logs are clear and errors are captured correctly.

## 14. Final sign-off before college deployment
- [ ] All critical flows tested.
- [ ] No blocking security issue found.
- [ ] Database and backend environment are stable.
- [ ] Project is ready for demo deployment to college users.

## Important note
The deployment should not be considered complete until the backend startup test and role-based flow testing are successful in the real environment.
