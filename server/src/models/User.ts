import * as mongoose from 'mongoose';

import * as bcrypt from 'bcrypt';
const Schema = mongoose.Schema;

export interface UserInterface extends mongoose.Document {
  email: string;
  password: string;
  role?: string;
  status?: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: number;
  phoneNumber: string;
  nssNumber: number;
  privateFields?: {
    email: boolean;
    address: boolean;
    city: boolean;
    state: boolean;
    zipCode: boolean;
    phoneNumber: boolean;
  };
  isValidPassword(password: string): Promise<boolean>;
}
// tslint:disable-next-line: variable-name
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'User',
  },
  status: {
    type: String,
    default: 'Pending',
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zipCode: {
    type: Number,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  nssNumber: {
    type: Number,
    required: true,
  },
  privateFields: {
    type: {
      email: {
        type: Boolean,
      },
      address: {
        type: Boolean,
      },
      city: {
        type: Boolean,
      },
      state: {
        type: Boolean,
      },
      zipCode: {
        type: Boolean,
      },
      phoneNumber: {
        type: Boolean,
      },
    },
    default: {
      email: false,
      address: false,
      city: false,
      state: false,
      zipCode: false,
      phoneNumber: false,
    },
  },
});

//This is called a pre-hook, before the user information is saved in the database
//this function will be called, we'll get the plain text password, hash it and store it.
UserSchema.pre<UserInterface>('save', async function (next: any) {
  //'this' refers to the current document about to be saved
  const user = this;
  //Hash the password with a salt round of 10, the higher the rounds the more secure, but the slower
  //your application becomes.
  const hash = await bcrypt.hash(this.password, 10);
  //Replace the plain text password with the hash and then store it
  this.password = hash;

  //Indicates we're done and moves on to the next middleware
  next();
});

//We'll use this later on to make sure that the user trying to log in has the correct credentials
UserSchema.methods.isValidPassword = async function (password: string) {
  const user = this;
  //Hashes the password sent by the user for login and checks if the hashed password stored in the
  //database matches the one sent. Returns true if it does else false.
  const compare = await bcrypt.compare(password, user.password);
  return compare;
};

// tslint:disable-next-line:variable-name
const UserModel = mongoose.model<UserInterface>('user', UserSchema);
export {UserModel};
