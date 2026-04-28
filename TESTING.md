# HouseFlow - System Testing Documentation

**IS424 Group 6**
**Team:** Kenlee Duong, JoAnn Dao, Crystal Li, Stella Allingham, Ava Crowley
**Date:** April 28, 2026

---

## Test Environment

- **Browser:** Google Chrome 124, Safari 17
- **OS:** macOS, Windows 11
- **Database:** Google Firebase Firestore
- **Authentication:** Firebase Auth (email/password)

---

## 1. Authentication Tests

| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 1.1 | Sign up new user | Go to index.html, click Sign Up tab, enter name/email/password, click Sign Up | User created in Firebase Auth and Firestore users collection, redirected to dashboard | PASS |
| 1.2 | Sign up with existing email | Try to sign up with an email already registered | Error message displayed: "email already in use" | PASS |
| 1.3 | Sign up with weak password | Enter a password under 6 characters | Firebase error message shown | PASS |
| 1.4 | Sign up with empty fields | Leave one or more fields blank, click Sign Up | Alert: "Please fill out all fields." | PASS |
| 1.5 | Log in with valid credentials | Enter registered email/password, click Log In | Authenticated, redirected to dashboard | PASS |
| 1.6 | Log in with wrong password | Enter valid email with incorrect password | Error message shown | PASS |
| 1.7 | Log in with unregistered email | Enter email not in system | Error message shown | PASS |
| 1.8 | Enter key submits login | Type password and press Enter | Login form submits | PASS |
| 1.9 | Enter key submits signup | Type password and press Enter on signup form | Signup form submits | PASS |
| 1.10 | Log out | Click Log Out button on any page | Session cleared, redirected to login page | PASS |
| 1.11 | Auth protection | Try to access dashboard.html without logging in | Redirected to index.html | PASS |
| 1.12 | Tab switching | Click between Log In and Sign Up tabs | Correct panel shown, other hidden | PASS |

---

## 2. Dashboard Tests

| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 2.1 | Stats display | Log in and view dashboard | Stat cards show correct totals for all chores, completed, pending, and my chores | PASS |
| 2.2 | Chore cards render | View All Chores section | All chores from Firestore displayed as cards with title, assignee, due date, status, recurrence | PASS |
| 2.3 | Filter - All | Click All filter button | All chores shown | PASS |
| 2.4 | Filter - Pending | Click Pending filter button | Only pending chores shown | PASS |
| 2.5 | Filter - Completed | Click Completed filter button | Only completed chores shown | PASS |
| 2.6 | Filter - Overdue | Click Overdue filter button | Only overdue chores shown | PASS |
| 2.7 | Mark Complete button visibility | Check chore cards | Mark Complete button only appears on chores assigned to current user that are not already completed | PASS |
| 2.8 | Mark Complete flow | Click Mark Complete, confirm in modal | Chore status updated to "completed" in Firestore, dashboard refreshes | PASS |
| 2.9 | Roommate Progress | View sidebar | Shows completion counts per user with progress bars | PASS |
| 2.10 | Rotation Schedule | View sidebar | Shows chores with rotation order using first names and arrows | PASS |
| 2.11 | Time-based greeting | Log in at different times | Shows "Good morning/afternoon/evening" based on current time | PASS |
| 2.12 | Dynamic navbar | Log in as different users | Navbar shows correct name, avatar initials, and role | PASS |

---

## 3. Chore Management Tests (CRUD)

| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 3.1 | **CREATE** - Add chore | Fill out form (title, description, assignee, date, recurrence), click Add Chore | New chore document created in Firestore chores collection, table refreshes | PASS |
| 3.2 | Add chore validation | Submit with empty title or date | Alert prompting user to fill required fields | PASS |
| 3.3 | **READ** - Chore table | Load chores page | All chores from Firestore rendered in table with correct data | PASS |
| 3.4 | **READ** - Assign dropdown | Load chores page | Dropdown populated with users from Firestore users collection | PASS |
| 3.5 | **UPDATE** - Edit chore | Click edit button on a chore | Form populated with chore data, button changes to "Update Chore" | PASS |
| 3.6 | **UPDATE** - Save edit | Modify fields and click Update Chore | Chore updated in Firestore, table refreshes with new data | PASS |
| 3.7 | Cancel edit | Click Cancel Edit | Form cleared, button reverts to "Add Chore" | PASS |
| 3.8 | **DELETE** - Delete chore | Click delete button, confirm in modal | Chore deleted from Firestore, table refreshes | PASS |
| 3.9 | Delete cancel | Click delete, then Cancel in modal | Chore not deleted, modal closes | PASS |
| 3.10 | Reset data | Click Reset Data, confirm | All chores deleted and sample data seeded with users from Firestore | PASS |
| 3.11 | Rotation order | Use up/down arrows on rotation list | Order updates visually, saved with chore | PASS |
| 3.12 | Roommate overview | View sidebar | Shows each user with assigned count and completed count | PASS |

---

## 4. Role-Based Access Tests

| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 4.1 | Admin sees form | Log in as admin, go to chores page | Add/edit form visible, edit/delete buttons shown in table | PASS |
| 4.2 | Non-admin restricted | Log in as roommate, go to chores page | Form hidden, "View Only" notice shown, no edit/delete buttons | PASS |
| 4.3 | Admin rent config | Log in as admin, go to expenses | Rent configuration form visible | PASS |
| 4.4 | Non-admin no rent config | Log in as roommate, go to expenses | Rent configuration hidden | PASS |
| 4.5 | Admin confirms payment | Log in as admin, go to expenses | "Confirm Paid" buttons visible for unpaid roommates | PASS |

---

## 5. Expenses Tests

| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 5.1 | Stats display | View expenses page | Shows current month, collected total, outstanding total | PASS |
| 5.2 | Save rent config | Change rent total and split amounts, click Save | Data saved to Firestore expenses collection, stats updated | PASS |
| 5.3 | Admin share calculation | Modify split amounts | "Your share" updates dynamically (total - sum of splits) | PASS |
| 5.4 | Mark as paid | Click Confirm Paid for a roommate | Status changes to PAID with date, stats update | PASS |
| 5.5 | Mark as unpaid | Click menu button on a paid roommate | Status reverts to UNPAID, stats update | PASS |
| 5.6 | Payment history | View right sidebar | Shows past months with payment status per roommate | PASS |

---

## 6. Firestore Database Tests

| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 6.1 | Users collection | Sign up a new user | Document created in users collection with id, name, email, role, avatar, color | PASS |
| 6.2 | Chores collection | Add a chore via form | Document created with all fields (title, description, assignedTo, status, dueDate, recurrence, rotationOrder, createdBy, completedAt, history) | PASS |
| 6.3 | Expenses collection | Save rent config | Document created/updated in expenses collection keyed by month | PASS |
| 6.4 | Data persistence | Add chore, refresh page | Chore still appears (loaded from Firestore, not local) | PASS |
| 6.5 | Multi-user sync | Log in on two browsers, add chore on one | Chore appears on other browser after refresh | PASS |

---

## 7. UI / Responsiveness Tests

| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 7.1 | Mobile navbar | Resize to mobile width | Burger menu appears, clicking it toggles nav menu | PASS |
| 7.2 | Mobile layout | View dashboard on 375px width | Cards stack vertically, text readable | PASS |
| 7.3 | Tablet layout | View at 768px | Two-column layout adjusts properly | PASS |
| 7.4 | Desktop layout | View at 1440px | Full layout with sidebar | PASS |

---

## 8. Console / Error Tests

| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 8.1 | No console errors on login page | Open index.html, check console | No errors or debug output | PASS |
| 8.2 | No console errors on dashboard | Navigate to dashboard, check console | No errors or debug output | PASS |
| 8.3 | No console errors on chores | Navigate to chores page, check console | No errors or debug output | PASS |
| 8.4 | No console errors on expenses | Navigate to expenses page, check console | No errors or debug output | PASS |

---

## Summary

- **Total test cases:** 52
- **Passed:** 52
- **Failed:** 0
- **Collections tested:** users, chores, expenses
- **CRUD verified:** Create, Read, Update, Delete all functional through Firestore
- **Role-based access:** Admin and roommate permissions working correctly
