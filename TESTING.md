# HouseFlow - System Testing Documentation

**IS424 Group 6**
**Team:** Kenlee Duong, JoAnn Dao, Crystal Li, Stella Allingham, Ava Crowley
**Date:** April 28, 2026

---

## Test Environment

- **Browser:** Google Chrome, Safari
- **OS:** macOS
- **Database:** Google Firebase Firestore
- **Authentication:** Firebase Auth (email/password)

---

## 1. Authentication Tests

| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 1.1 | Sign up new user | Go to index.html, click Sign Up tab, enter name/email/password, click Sign Up | User created in Firebase Auth and Firestore users collection, redirected to dashboard | PASS |
| 1.2 | Sign up with empty fields | Leave one or more fields blank, click Sign Up | Alert: "Please fill out all fields." | PASS |
| 1.3 | Log in with valid credentials | Enter registered email/password, click Log In | Authenticated, redirected to dashboard | PASS |
| 1.4 | Log in with wrong password | Enter valid email with incorrect password | Error message shown | PASS |
| 1.5 | Log out | Click Log Out button on any page | Session cleared, redirected to login page | PASS |
| 1.6 | Tab switching | Click between Log In and Sign Up tabs | Correct panel shown, other hidden | PASS |

---

## 2. Dashboard Tests

| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 2.1 | Stats display | Log in and view dashboard | Stat cards show correct totals for chores, completed, pending, and my chores | PASS |
| 2.2 | Chore cards render | View All Chores section | All chores from Firestore displayed as cards with title, assignee, due date, status | PASS |
| 2.3 | Filter buttons | Click Pending, Completed, Overdue, All filters | Only chores matching selected status are shown | PASS |
| 2.4 | Mark Complete flow | Click Mark Complete on own chore, confirm in modal | Chore status updated to "completed" in Firestore, dashboard refreshes | PASS |
| 2.5 | Roommate Progress | View sidebar | Shows completion counts per user with progress bars | PASS |
| 2.6 | Time-based greeting | View dashboard | Shows "Good morning/afternoon/evening" based on current time | PASS |

---

## 3. Chore Management Tests (CRUD)

| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 3.1 | **CREATE** - Add chore | Fill out form (title, description, assignee, date, recurrence), click Add Chore | New chore document created in Firestore, table refreshes | PASS |
| 3.2 | Add chore validation | Submit with empty title or date | Alert prompting user to fill required fields | PASS |
| 3.3 | **READ** - Chore table | Load chores page | All chores from Firestore rendered in table with correct data | PASS |
| 3.4 | **READ** - Assign dropdown | Load chores page | Dropdown populated with users from Firestore users collection | PASS |
| 3.5 | **UPDATE** - Edit chore | Click edit button, modify fields, click Update Chore | Chore updated in Firestore, table refreshes with new data | PASS |
| 3.6 | **DELETE** - Delete chore | Click delete button, confirm in modal | Chore deleted from Firestore, table refreshes | PASS |
| 3.7 | Reset data | Click Reset Data, confirm | All chores deleted and sample data seeded from Firestore users | PASS |
| 3.8 | Auto-overdue | Create chore with past due date, reload page | Chore automatically marked as overdue | PASS |

---

## 4. Role-Based Access Tests

| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 4.1 | Admin rent config | Log in as admin, go to expenses | Rent configuration form visible | PASS |
| 4.2 | Non-admin no rent config | Log in as roommate, go to expenses | Rent configuration form hidden | PASS |
| 4.3 | Admin confirms payment | Log in as admin, go to expenses | "Confirm Paid" buttons visible for unpaid users | PASS |

---

## 5. Expenses Tests

| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 5.1 | Stats display | View expenses page | Shows current month, collected total, outstanding total | PASS |
| 5.2 | Save rent config | Change rent total and split amounts, click Save | Data saved to Firestore, stats updated | PASS |
| 5.3 | Mark as paid | Click Confirm Paid for a user | Status changes to PAID with date, stats update | PASS |
| 5.4 | Mark as unpaid | Click toggle button on a paid user | Status reverts to UNPAID, stats update | PASS |

---

## 6. Firestore Database Tests

| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 6.1 | Users collection | Sign up a new user | Document created in users collection with id, name, email, role, avatar, color | PASS |
| 6.2 | Chores collection | Add a chore via form | Document created with all fields (title, description, assignedTo, status, dueDate, recurrence, etc.) | PASS |
| 6.3 | Expenses collection | Save rent config | Document created/updated in expenses collection keyed by month | PASS |
| 6.4 | Data persistence | Add chore, refresh page | Chore still appears (loaded from Firestore, not localStorage) | PASS |

---

## Summary

- **Total test cases:** 31
- **Passed:** 31
- **Failed:** 0
- **Collections tested:** users, chores, expenses
- **CRUD verified:** Create, Read, Update, Delete all functional through Firestore
