export interface UserInterface{
    message: string,

    user: {
        _id: string,
        email: string,
        password: string,
        firstName: string,
        lastName: string,
        address: string,
        city: string,
        state: string,
        zipCode: number,
        phoneNumber: number,
        nssNumber: number,
    }
}