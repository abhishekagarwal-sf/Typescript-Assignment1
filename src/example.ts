enum Role {
    ADMIN = "admin",
    SUPERADMIN = "superadmin",
    SUBSCRIBER = "subscriber"
}

class User {
    @formatUserDOB()
    public birthDate: Date;
    constructor(private id: number,public firstName: string,public middleName: string,
        public lastName: string,public email: string, public phoneNo: number,
        public role: Role, public address: string,birthDate: Date) {
            this.birthDate = birthDate;
         }

    get getId(): number {
        return this.id;

    }
}

function formatUserDOB(){
    return function t(target: Object, propertyKey: string)
    {
        console.log(target);
        console.log(propertyKey);
       
        const valuesByInstance = new WeakMap();
        Object.defineProperty(target,propertyKey,{
            set: function(value: Date){
                console.log(this);
                console.log(value);
                valuesByInstance.set(this,value)
            },
            get: function(){
                return valuesByInstance.get(this).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            }
        })
    }
    
}



interface Actions<T,U,V> {
    createUser(name: T, email: T, phoneNo: U, role: T, address: T): U;
    deleteUser(id: U): void;
    getUser(searchKey: U): V;
    updateUser(user: V): U;
}
let userList: Array<User> = [
    new User(1,"Ryan","Ten","Jones","abc@gmail.com",1234567890,Role.ADMIN,"64, North Street, LA, Los Angeles",new Date("2001-01-15")),
    new User(2,"Seth","","Rollin","def@gmail.com",1234567890,Role.SUPERADMIN,"64, North Street, LA, Los Angeles",new Date("2002-01-16")),
    new User(3,"Faf","Du","Plesis","ghi@gmail.com",1234567890,Role.SUBSCRIBER,"64, North Street, LA, Los Angeles",new Date("2003-09-15"))];

class Utility implements Actions<string,number,User>{
    
    createUser(name: string, email: string, phoneNo: number, role: string, address: string): number{

        const nameArray = name.trim().split(" ",3);
        const firstName = nameArray[0];
        let middleName: string,lastName: string;
        if(nameArray.length>2)
        {
            middleName = nameArray[1];
            lastName = nameArray[2];
        }
        else if(nameArray.length==2){
            middleName = "";
            lastName = nameArray[1];
        }
        else{
            middleName = "";
            lastName = "";
        }


        const id = userList.length>0?userList[userList.length-1].getId+1:1;
        const roleEnum = role as Role;


        const newUser = new User(id,firstName,middleName,lastName,email,phoneNo,roleEnum,address,new Date());
        userList.push(newUser);
        return id;
    }

    deleteUser(id: number): void {
        const idx = userList.findIndex(user => user.getId==id);

        console.log('Index is '+idx);
        if(idx>=0)
        {
            userList.splice(idx,1);
        }
    }

    getUser(searchKey: number): User {  
        const idx = userList.findIndex(user => user.getId==searchKey);
        return userList[idx];
    }

    updateUser(user: User): number {

        const id = user.getId;
        const idx = userList.findIndex(user => user.getId==id);
        userList[idx] = user;
        return user.getId;
    }
}





function loadData(): void {
    console.log("Inside load Data Function");
    let refreshBtn = <HTMLElement>document.getElementById("refreshBtn");
    refreshBtn.innerHTML = "Refresh Data"

    changeHTMLElementVisibility("userFormSection", "none");
    changeHTMLElementVisibility("addUserBtn", "inline-block");

    changeHTMLElementVisibility("userTable", "block");

    let tableBody = <HTMLElement>document.getElementById("userData");
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

function changeHTMLElementVisibility(id: string, status: string): void {

    let element = <HTMLElement>document.getElementById(id);
    element.style.display = status;
}

function openUserRegistrationForm(): void {

    let roleDropDown = <HTMLSelectElement>document.getElementById("roleDropDown");
    
    console.log(roleDropDown.options.length);
    if(roleDropDown.options.length==1)
    {
        const keys = Object.entries(Role).forEach(([key,value]) => {
        
            let option = <HTMLElement>document.createElement("option");
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

function closeForm(): void {

    let form = <HTMLFormElement>document.getElementById("userForm");
    form.reset();
    changeHTMLElementVisibility("userFormSection", "none");

    loadData();
}

function createUser(){
    console.log("Inside User Creation");

    const nameField = <HTMLInputElement>document.getElementById("name");
    const emailField = <HTMLInputElement>document.getElementById("email");
    const phoneNoField = <HTMLInputElement>document.getElementById("phnNo");
    const roleField = <HTMLSelectElement>document.getElementById("roleDropDown");
    const addressField = <HTMLInputElement>document.getElementById("address")

    const name = nameField?.value;
    const email = emailField?.value;
    const phoneNo = parseInt(phoneNoField?.value,10);
    const role = roleField?.value;
    const address = addressField?.value;

    const obj = new Utility();
    const id = obj.createUser(name,email,phoneNo,role,address);

    alert('User has been created with id - '+ id);

    closeForm();

}

function deleteRow(btn: HTMLButtonElement){

    let row = btn.parentNode?.parentNode?.parentNode as HTMLTableRowElement;
    let id = parseInt(row.cells[0].textContent!);
    console.log(id);
    const obj = new Utility();
    obj.deleteUser(id);
    alert('User has been deleted successfully');
    loadData();
}

function editRow(btn: HTMLButtonElement){

    let row = btn.parentNode?.parentNode?.parentNode as HTMLTableRowElement;
    
    for(const [idx,cell] of Array.from(row.cells).entries() )
    {
        if(idx ==1 || idx==2 || idx==3 || idx==7)
        {
            cell.setAttribute("contenteditable",'true');
        }
    }

    let tableCell = btn.parentNode?.parentNode as HTMLTableCellElement;
    
    let editSection = tableCell.childNodes[1] as HTMLDivElement;
    editSection.style.display = "none"
    let saveSection = tableCell.childNodes[3] as HTMLDivElement;
    saveSection.style.display = "block"
}

function saveChanges(btn: HTMLButtonElement){

    let row = btn.parentNode?.parentNode?.parentNode as HTMLTableRowElement;
    const id = parseInt(row.cells[0].textContent!);
    
    const obj = new Utility();
    let user = obj.getUser(id);
    console.log('Old User Details ' + JSON.stringify(user));
    user.firstName = row.cells[1].textContent || " ";
    user.middleName = row.cells[2].textContent || " ";
    user.lastName = row.cells[3].textContent || " ";
    user.address = row.cells[7].textContent || " ";

    console.log("New User details"+ JSON.stringify(user));

    obj.updateUser(user);
    cancelChanges(btn);
}

function cancelChanges(btn: HTMLButtonElement){

    let row = btn.parentNode?.parentNode?.parentNode as HTMLTableRowElement;
    
    for(const [idx,cell] of Array.from(row.cells).entries() )
    {
        if(idx ==1 || idx==2 || idx==3 || idx==7)
        {
            cell.removeAttribute("contenteditable");
        }
    }
    let tableCell = btn.parentNode?.parentNode as HTMLTableCellElement;
    
    let editSection = tableCell.childNodes[1] as HTMLDivElement;
    editSection.style.display = "block"
    let saveSection = tableCell.childNodes[3] as HTMLDivElement;
    saveSection.style.display = "none"

    loadData();

}



// export {};
