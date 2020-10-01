# task-manager
This application enables authenticated users to save and manage their tasks on the fly. The users are expected to provide their name, email, password and age (optional)
to signUp for their account and just their email and password to signIn. User passwords are hashed using bcrypt library and saved in the database (MongoDB). The signedUp users
will be sent an email for validation purposes.
    The users are authenticated using JWT tokens and the tokens for the signed in users are stored in the Database itself.
