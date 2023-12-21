"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Role;
(function (Role) {
    Role["ADMIN"] = "admin";
    Role["SUPERADMIN"] = "superadmin";
    Role["SUBSCRIBER"] = "subscriber";
})(Role || (Role = {}));
class User {
    constructor(id, firstName, middleName, lastName, email, phoneNo, role, address, birthDate) {
        this.id = id;
        this.firstName = firstName;
        this.middleName = middleName;
        this.lastName = lastName;
        this.email = email;
        this.phoneNo = phoneNo;
        this.role = role;
        this.address = address;
        this.birthDate = birthDate;
    }
    get getId() {
        return this.id;
    }
}
__decorate([
    formatUserDOB()
], User.prototype, "birthDate", void 0);
function formatUserDOB() {
    return function t(target, propertyKey) {
        console.log(target);
        console.log(propertyKey);
        const valuesByInstance = new WeakMap();
        Object.defineProperty(target, propertyKey, {
            set: function (value) {
                console.log(this);
                console.log(value);
                valuesByInstance.set(this, value);
            },
            get: function () {
                return valuesByInstance.get(this).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            }
        });
    };
}
let userList = [
    new User(1, "Ryan", "Ten", "Jones", "abc@gmail.com", 1234567890, Role.ADMIN, "64, North Street, LA, Los Angeles", new Date("2001-01-15")),
    new User(2, "Seth", "", "Rollin", "def@gmail.com", 1234567890, Role.SUPERADMIN, "64, North Street, LA, Los Angeles", new Date("2002-01-16")),
    new User(3, "Faf", "Du", "Plesis", "ghi@gmail.com", 1234567890, Role.SUBSCRIBER, "64, North Street, LA, Los Angeles", new Date("2003-09-15"))
];
class Utility {
    createUser(name, email, phoneNo, role, address) {
        const nameArray = name.trim().split(" ", 3);
        const firstName = nameArray[0];
        let middleName, lastName;
        if (nameArray.length > 2) {
            middleName = nameArray[1];
            lastName = nameArray[2];
        }
        else if (nameArray.length == 2) {
            middleName = "";
            lastName = nameArray[1];
        }
        else {
            middleName = "";
            lastName = "";
        }
        const id = userList.length > 0 ? userList[userList.length - 1].getId + 1 : 1;
        const roleEnum = role;
        const newUser = new User(id, firstName, middleName, lastName, email, phoneNo, roleEnum, address, new Date());
        userList.push(newUser);
        return id;
    }
    deleteUser(id) {
        const idx = userList.findIndex(user => user.getId == id);
        console.log('Index is ' + idx);
        if (idx >= 0) {
            userList.splice(idx, 1);
        }
    }
    getUser(searchKey) {
        const idx = userList.findIndex(user => user.getId == searchKey);
        return userList[idx];
    }
    updateUser(user) {
        const id = user.getId;
        const idx = userList.findIndex(user => user.getId == id);
        userList[idx] = user;
        return user.getId;
    }
}
function loadData() {
    console.log("Inside load Data Function");
    let refreshBtn = document.getElementById("refreshBtn");
    refreshBtn.innerHTML = "Refresh Data";
    changeHTMLElementVisibility("userFormSection", "none");
    changeHTMLElementVisibility("addUserBtn", "inline-block");
    changeHTMLElementVisibility("userTable", "block");
    let tableBody = document.getElementById("userData");
    let userData = '';
    userList.forEach((user) => {
        console.log(user);
        console.log(user.birthDate + 'djdj');
        userData += `
                <tr>
                <td>${user.getId}</td>
                <td>${user.firstName}</td>
                <td>${user.middleName}</td>
                <td>${user.lastName}</td>
                <td>${user.birthDate}</td>
                <td>${user.email}</td>
                <td>${user.phoneNo}</td>
                <td>${user.role}</td>
                <td>${user.address}</td>
                <td>
                    <div id="editSection">
                        <button id="editBtn" onClick=editRow(this)>Edit</button>
                        <button id="delBtn" onClick=deleteRow(this)>Delete</button>
                    </div>
                    <div id="saveSection" style>
                        <button id="saveBtn" onClick=saveChanges(this)>Save</button>
                        <button id="cancelBtn" onClick=cancelChanges(this)>Cancel</button>
                    </div>
                    
                </td>
                </tr>
            `;
    });
    tableBody.innerHTML = userData;
}
function changeHTMLElementVisibility(id, status) {
    let element = document.getElementById(id);
    element.style.display = status;
}
function openUserRegistrationForm() {
    let roleDropDown = document.getElementById("roleDropDown");
    console.log(roleDropDown.options.length);
    if (roleDropDown.options.length == 1) {
        const keys = Object.entries(Role).forEach(([key, value]) => {
            let option = document.createElement("option");
            option.setAttribute('value', value);
            let optionText = document.createTextNode(key);
            option.appendChild(optionText);
            roleDropDown.appendChild(option);
        });
    }
    console.log("Insie User Registration Form");
    changeHTMLElementVisibility("userFormSection", "block");
    changeHTMLElementVisibility("userTable", "none");
}
function closeForm() {
    let form = document.getElementById("userForm");
    form.reset();
    changeHTMLElementVisibility("userFormSection", "none");
    loadData();
}
function createUser() {
    console.log("Inside User Creation");
    const nameField = document.getElementById("name");
    const emailField = document.getElementById("email");
    const phoneNoField = document.getElementById("phnNo");
    const roleField = document.getElementById("roleDropDown");
    const addressField = document.getElementById("address");
    const name = nameField === null || nameField === void 0 ? void 0 : nameField.value;
    const email = emailField === null || emailField === void 0 ? void 0 : emailField.value;
    const phoneNo = parseInt(phoneNoField === null || phoneNoField === void 0 ? void 0 : phoneNoField.value, 10);
    const role = roleField === null || roleField === void 0 ? void 0 : roleField.value;
    const address = addressField === null || addressField === void 0 ? void 0 : addressField.value;
    const obj = new Utility();
    const id = obj.createUser(name, email, phoneNo, role, address);
    alert('User has been created with id - ' + id);
    closeForm();
}
function deleteRow(btn) {
    var _a, _b;
    let row = (_b = (_a = btn.parentNode) === null || _a === void 0 ? void 0 : _a.parentNode) === null || _b === void 0 ? void 0 : _b.parentNode;
    let id = parseInt(row.cells[0].textContent);
    console.log(id);
    const obj = new Utility();
    obj.deleteUser(id);
    alert('User has been deleted successfully');
    loadData();
}
function editRow(btn) {
    var _a, _b, _c;
    let row = (_b = (_a = btn.parentNode) === null || _a === void 0 ? void 0 : _a.parentNode) === null || _b === void 0 ? void 0 : _b.parentNode;
    for (const [idx, cell] of Array.from(row.cells).entries()) {
        if (idx == 1 || idx == 2 || idx == 3 || idx == 7) {
            cell.setAttribute("contenteditable", 'true');
        }
    }
    let tableCell = (_c = btn.parentNode) === null || _c === void 0 ? void 0 : _c.parentNode;
    let editSection = tableCell.childNodes[1];
    editSection.style.display = "none";
    let saveSection = tableCell.childNodes[3];
    saveSection.style.display = "block";
}
function saveChanges(btn) {
    var _a, _b;
    let row = (_b = (_a = btn.parentNode) === null || _a === void 0 ? void 0 : _a.parentNode) === null || _b === void 0 ? void 0 : _b.parentNode;
    const id = parseInt(row.cells[0].textContent);
    const obj = new Utility();
    let user = obj.getUser(id);
    console.log('Old User Details ' + JSON.stringify(user));
    user.firstName = row.cells[1].textContent || " ";
    user.middleName = row.cells[2].textContent || " ";
    user.lastName = row.cells[3].textContent || " ";
    user.address = row.cells[7].textContent || " ";
    console.log("New User details" + JSON.stringify(user));
    obj.updateUser(user);
    cancelChanges(btn);
}
function cancelChanges(btn) {
    var _a, _b, _c;
    let row = (_b = (_a = btn.parentNode) === null || _a === void 0 ? void 0 : _a.parentNode) === null || _b === void 0 ? void 0 : _b.parentNode;
    for (const [idx, cell] of Array.from(row.cells).entries()) {
        if (idx == 1 || idx == 2 || idx == 3 || idx == 7) {
            cell.removeAttribute("contenteditable");
        }
    }
    let tableCell = (_c = btn.parentNode) === null || _c === void 0 ? void 0 : _c.parentNode;
    let editSection = tableCell.childNodes[1];
    editSection.style.display = "block";
    let saveSection = tableCell.childNodes[3];
    saveSection.style.display = "none";
    loadData();
}
// export {};
