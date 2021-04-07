window.addEventListener('load', function() {
    class User {
        constructor(data) {
            this.data = {
                id: data.id,
                name: data.name,
                email: data.email,
                address: data.address,
                phone: data.phone
            }
        }
    
    }
    
    class Contacts {
        constructor() {
            this.data = [];
        }
    
        add(data) {
            let lengthData = this.data.length;
            data.id = lengthData + 1;
            let user = new User(data);
            this.data.push(user);
            return true;
        }
    
        
    }

    class ContactsApp extends Contacts{
        constructor() {
            super()
            this.data = JSON.parse(this.storage()) || []; 
            if(this.ui()) {
                document.body.appendChild(this.app) 
            }
            if(this.data.length > 0) {
                this.onRender() 
            } else {
                this.getData();
            }
            if(document.cookie.indexOf('storageExpiration') == -1) {
                localStorage.clear();
            }
        }

        

        storage(data) {
            if (data != undefined) {
                console.log(data)

                if(data != String) data = JSON.stringify(data)
                localStorage.setItem('data', data);
                let currentDate = new Date();
                // document.cookie = `storageExpiration=${currentDate}; expires=${new Date(Date.now() + 60000)}`; 
                document.cookie = `storageExpiration=${currentDate}; max-age=120`; 
            }
            else {
                return localStorage.getItem('data');
            }
        } 

        getData() {
            fetch('https://jsonplaceholder.typicode.com/users')
            .then(response => {
                return response.text();
            })
            .then(result => {
                localStorage.setItem('data', result)
            })
        }

        ui() {
            let app = document.createElement('div');
            app.classList.add('contacts');

            let form = document.createElement('div');
            form.classList.add('form_wrapper');

            let name = document.createElement('input');
            name.setAttribute('name', 'name');
            name.setAttribute('placeholder', 'name');

            let phone = document.createElement('input');
            phone.setAttribute('name', 'phone');
            phone.setAttribute('type', 'tel');
            phone.setAttribute('placeholder', 'phone');

            let email = document.createElement('input');
            email.setAttribute('name', 'email');
            email.setAttribute('type', 'email');
            email.setAttribute('placeholder', 'email');

            let address = document.createElement('input');
            address.setAttribute('name', 'address');
            address.setAttribute('placeholder', 'address');

            let btnAdd = document.createElement('button');
            btnAdd.classList.add('btn_add')
            btnAdd.innerHTML = 'Add';

            let formDescription = document.createElement('p');
            formDescription.classList.add('form_description');
            formDescription.innerHTML = 'New Contact';
            app.appendChild(formDescription);
            
            form.appendChild(name);
            form.appendChild(phone);
            form.appendChild(email);
            form.appendChild(address);
            form.appendChild(btnAdd);
            app.appendChild(form);

            let contactsList = document.createElement('ul');
            contactsList.classList.add('contacts_list');
            app.appendChild(contactsList);

            let self = this;
            btnAdd.addEventListener('click', function() {   
                let data = self.onAdd(self.app);

                let name = document.querySelector('input[name="name"]');
                let phone = document.querySelector('input[name="phone"]');
                let email = document.querySelector('input[name="email"]');
                let address = document.querySelector('input[name="address"]');
                if(name.value == '' || phone.value == '' || email.value == '' || address.value == '') {
                    alert('Заполните все поля');
                    return;
                }

                if(self.add(data) == true) {
                    self.storage(JSON.stringify(self.data));
                    self.onRender();
                }

                name = app.querySelector('input[name="name"]');
                name.value = '';

                phone = app.querySelector('input[name="phone"]');
                phone.value = '';

                email = app.querySelector('input[name="email"]');
                email.value = '';

                address = app.querySelector('input[name="address"]');
                address.value = '';
            }) 
            this.app = app;
            return true;
        }

        onAdd(app) {
            let data = {};

            let name = app.querySelector('input[name="name"]');
            if(name.value.length > 0) {
                data.name = name.value;
            }

            let phone = app.querySelector('input[name="phone"]');
            if(phone.value.length > 0) {
                data.phone = phone.value;
            }

            let email = app.querySelector('input[name="email"]');
            if(email.value.length > 0) {
                data.email = email.value;
            }

            let address = app.querySelector('input[name="address"]');
            if(address.value.length > 0) {
                data.address = address.value;
            }

            return data;
        }

        edit() {
            let contact = this.closest('.contact');
            contact.dataset.id = contact.id;

            console.log(this)

            let editFormWrapper = document.createElement('div');
            editFormWrapper.classList.add('edit_form_wrapper');
            editFormWrapper.classList.add('show');

            let editForm = document.createElement('div');
            editForm.classList.add('edit_form');

            let editDescription = document.createElement('h2');
            editDescription.classList.add('edit_description');
            editDescription.innerHTML = 'Change the form';
                
            let editName = document.createElement('input');
            editName.setAttribute('name', 'edit_name');
            editName.value = contact.querySelector('.contact_name').innerHTML;

            let editPhone = document.createElement('input');
            editPhone.setAttribute('name', 'edit_phone');
            editPhone.setAttribute('type', 'tel');
            editPhone.value = contact.querySelector('.contact_phone').innerHTML;

            let editEmail = document.createElement('input');
            editEmail.setAttribute('name', 'edit_email');
            editEmail.setAttribute('type', 'email');
            editEmail.value = contact.querySelector('.contact_email').innerHTML;

            let editAddress = document.createElement('input');
            editAddress.setAttribute('name', 'edit_address');
            editAddress.value = contact.querySelector('.contact_address').innerHTML;

            let btnEditSave = document.createElement('button');
            btnEditSave.classList.add('btn_edit_save');
            btnEditSave.innerHTML = 'Save';

            btnEditSave.addEventListener('click', contApp.save);

            editForm.appendChild(editDescription);
            editForm.appendChild(editName);
            editForm.appendChild(editPhone);
            editForm.appendChild(editEmail);
            editForm.appendChild(editAddress);
            editForm.appendChild(btnEditSave);

            editFormWrapper.appendChild(editForm);
            document.body.appendChild(editFormWrapper);

        }

        save() {
            // найти по иден-ру нужный эл-т из массива this.data. 
            // изменить св-во полученного эл-та (user) на обновлённое
            // выполнить onRender()
            // обновить localStorage

            let contact = document.querySelector('[data-id]');
            let id = contact.getAttribute('data-id')

            let user = contApp.data[id - 1];


            let editFormWrapper = document.querySelector('.edit_form_wrapper');

            let editName = editFormWrapper.querySelector('input[name="edit_name"]');
            let editPhone = editFormWrapper.querySelector('input[name="edit_phone"]');
            let editEmail = editFormWrapper.querySelector('input[name="edit_email"]');
            let editAddress = editFormWrapper.querySelector('input[name="edit_address"]');

            if(user.data != undefined) {
                user.data.name = editName.value;
                user.data.phone = editPhone.value;
                user.data.email = editEmail.value;
                user.data.address = editAddress.value;
            } else {
                user.name = editName.value;
                user.phone = editPhone.value;
                user.email = editEmail.value;
                user.address = editAddress.value;
            }

            contApp.onRender();
            contApp.storage(contApp.data)
            editFormWrapper.remove();
        }

        del() {
            // найти по иден-ру нужный эл-т из массива this.data. 
            // удалить найденный эл-т
            // выполнить onRender()
            // обновить localStorage
            let id = Number(this.closest('li').id) - 1;

            let user = contApp.data[id];

            contApp.data.splice(id, 1);
            contApp.onRender();
        }

        onRender() {
            let self = this;

            let ul = this.app.querySelector('ul');
            ul.innerHTML = '';

            let contactsArray = [];

            console.log(this.data)
            
            if(typeof this.data == 'string') this.data = JSON.parse(this.data)

            this.data.forEach(user => {
                if(user.data == undefined) user = {
                    data: user
                }
                let contact = document.createElement('li');
                contact.classList.add('contact');
                contactsArray.push(contact);

                let contArrLength = contactsArray.length;
                contact.id = contArrLength;

                let contactName = document.createElement('div');
                contactName.classList.add('contact_name')
                let contactPhone = document.createElement('div');
                contactPhone.classList.add('contact_phone')
                let contactEmail = document.createElement('div');
                contactEmail.classList.add('contact_email')
                let contactAddress = document.createElement('div');
                contactAddress.classList.add('contact_address')

                let btnEdit = document.createElement('button');
                btnEdit.classList.add('btn_edit')
                btnEdit.innerHTML = 'Edit';

                let btnDelete = document.createElement('button');
                btnDelete.classList.add('btn_delete')
                btnDelete.innerHTML = 'Delete';

                btnEdit.addEventListener('click', self.edit);
                btnDelete.addEventListener('click', self.del)

                let num = document.createElement('div');
                num.classList.add('number');
                num.innerHTML = `${user.data.id}`;
                console.log(user)

                contact.appendChild(contactName);
                contact.appendChild(contactPhone);
                contact.appendChild(contactEmail);
                contact.appendChild(contactAddress);
                contact.appendChild(btnEdit);
                contact.appendChild(btnDelete);

                contact.appendChild(num);

                contactName.innerHTML = user.data.name;
                contactPhone.innerHTML = user.data.phone;
                contactEmail.innerHTML = user.data.email;
                if(typeof user.data.address == 'string') {
                    contactAddress.innerHTML = user.data.address;
                } else {
                    contactAddress.innerHTML = user.data.address.street;
                }

                ul.appendChild(contact);
            })

        }

    }

    let contApp = new ContactsApp();
        
})