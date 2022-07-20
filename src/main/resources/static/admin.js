function thisAdmin() {
    fetch("http://localhost:8081/api/user")
        .then(res => res.json())
        .then(data => {
            // <!--ThisUser top navbar email + logout-->
            $('#adminEmail').append(data.email);
            let roles = data.roles.map(role => " " + role.role);
            $('#adminRoles').append(roles);
        })
}

thisAdmin();

<!--top navbar email + logout-->
function allUsers() {
    fetch("http://localhost:8081/api/admin")
        .then(res => res.json())
        .then(data => {
            data.forEach(user => {
                let tableWithUsers = `$(
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.name}</td>
                            <td>${user.email}</td>
                            <td>${user.roles.map(role => " " + role.role)}</td>
                            <td>
                             <button type="button" class="btn btn-info" data-toggle="modal" onclick="functionEdit(${user.id})"
                             class="btn btn-primary">Edit</button>
                            </td>
                            <td>
                            <button type="button" type="button" class="btn btn-danger" data-toggle="modal" onclick="functionDelete(${user.id})"
                             class="btn btn-danger">Delete</button>
                             </td>
                       </tr>`;
                $('#allUsersTable').append(tableWithUsers);
            })
        })
}

allUsers();

<!-- New User tab -->
formNewUser.addEventListener('submit', (e) => {
    e.preventDefault()
    let id = 0
    let rolesList = [];
    for (let i = 0; i < $('#rolesList').val().length; i++) {
        if ($('#rolesList').val()[i] === 'ROLE_ADMIN') {
            id = 1
        }
        if ($('#rolesList').val()[i] === 'ROLE_USER') {
            id = 2
        }
        if ($('#rolesList').val()[i] === 'ROLE_LOH') {
            id = 3
        }
        rolesList[i] = {id: id, name: $('#rolesList').val()[i]};
    }
    let newUser = {
        name: username.value,
        email: email.value,
        password: password.value,
        roles: rolesList
    }
    fetch("http://localhost:8081/api/admin/adduser", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
    })
        .then(response => response.json())
        .then((data) => {
            const newUserInTable = []
            newUserInTable.push(data)
        })
        .then(() => document.getElementById("all_users").click());
    refreshTable();
    formNewClear();
})

//очистить форму нового юзера, нормально работает только с таймаутом
function formNewClear() {
    setTimeout(500);
    $("#username").val("");
    $("#email").val("");
    $("#password").val("");
    $("#rolesList").val("");
}

// <!-- Modal Delete -->
function functionDelete(id) {
    fetch("http://localhost:8081/api/admin" + '/' + id)
        .then(res => res.json())
        .then(user => {
            $("#modalDelete").modal()
            document.getElementById("idDelete").value = user.id
            document.getElementById("nameDelete").value = user.name
            document.getElementById("emailDelete").value = user.email
            $("#rolesDelete").empty();
            let selectDel = document.getElementById('rolesDelete');
            user.roles.forEach((role) => {
                let option = document.createElement('option');
                option.setAttribute('id', role.id);
                option.setAttribute('name', role.name);
                option.appendChild(document.createTextNode(role.role));
                selectDel.appendChild(option);
            })

        })
}

function fDelete() {
    delForm.addEventListener('submit', (e) => {
        let id = window.delForm.idDelete.value
        console.log(e.target.parentNode.parentNode)
        e.preventDefault();
        e.stopPropagation();
        fetch("http://localhost:8081/api/admin/remove" + '/' + id, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'}
        })
            .then(() => $("#modalDelete").modal("hide"))
    })
    refreshTable();
}

function functionEdit(id) {
    fetch("http://localhost:8081/api/admin" + '/' + id)
        .then(res => res.json())
        .then(user => {
            $("#modalEdit").modal()
            document.getElementById("idEdit").value = user.id
            document.getElementById("nameEdit").value = user.name
            document.getElementById("emailEdit").value = user.email
            document.getElementById("passwordEdit").value = user.password
        })
}


//<!-- Modal Edit -->
function fEdit() {
    let id = 0
    let rolesList = [];
    for (let i = 0; i < $('#rolesEdit').val().length; i++) {
        if ($('#rolesEdit').val()[i] === 'ROLE_ADMIN') {
            id = 1
        }
        if ($('#rolesEdit').val()[i] === 'ROLE_USER') {
            id = 2
        }
        if ($('#rolesEdit').val()[i] === 'ROLE_LOH') {
            id = 3
        }
        rolesList[i] = {id: id, name: $('#rolesEdit').val()[i]};
    }
    let editUser = {
        id: idEdit.value,
        name: nameEdit.value,
        email: emailEdit.value,
        password: passwordEdit.value,
        roles: rolesList
    }

    fetch('http://localhost:8081/api/admin/update', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(editUser),
    }).then(() => $("#modalEdit").modal("hide"))
    refreshTable();
}

//обновить данные без перезагрузки страницы
function refreshTable() {
    let table = document.querySelector('#allUsersTable')
    for (let i = 0; table.rows.length > i;) {
        table.deleteRow(i)
    }
    setTimeout(allUsers, 300);
}

