export const Register = "INSERT INTO register (id, email, phone, lastname, firstname, hashedpassword) VALUES ($1, $2, $3, $4, $5, $6)"
export const RegisterGet = "SELECT * FROM register"