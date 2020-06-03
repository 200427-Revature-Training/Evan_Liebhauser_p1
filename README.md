Evan Liebhauser Revature Project 1

API Design

Users:
POST /users = saves new user;
PATCH /users/:ers_users_id = edits user with specified id;
GET /users = returns all users;
*GET /users/:ers_users_id = returns user with specified id;
*GET/users/:ers_username = returns user with specified username;

Reimbursements:
*POST /reimbursements = saves new reimbursement;
*PATCH /reimbursements/:reimb_id = edits reimbursement with specified id;
*GET /reimbursements = returns all reimbursements;
GET /reimbursements/:reimb_id = returns reimbursement with specified id;
*GET /reimbursements/user/:ers_users_id = returns all reimbursements submitted by specified user id;
*GET /reimbursements/type/:reimb_status = returns all reimbursements with specified status

*required for core functionality
