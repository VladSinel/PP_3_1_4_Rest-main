function thisUser() {
    fetch("http://localhost:8081/api/user")
        .then(res => res.json())
        .then(data => {
            // <!--top navbar email + logout-->
            $('#userEmail').append(data.email);
            let roles = data.roles.map(role => " " + role.role);
            $('#userRoles').append(roles);

            //<!--right table block-->
            let user = `$(
            <tr>
                <td>${data.id}</td>
                <td>${data.name}</td>
                <td>${data.email}</td>
                <td>${roles}</td>)
             </tr>`;
            $('#userTable').append(user);
        })
}
thisUser();


